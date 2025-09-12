## تقنيات الواجهة الأمامية الأساسية

- **Next.js (App Router)**: الصفحات والتخطيطات موجودة تحت `src/app`. يدعم مسار اللغة `src/app/[locale]` والتخطيط الجذري في `src/app/layout.tsx`.

مثال صفحة ومسار لغة بسيط:

```tsx
// app/[locale]/page.tsx
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");
  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <Link href="/en/about" className="text-blue-500 underline">
        {t("aboutLink")}
      </Link>
    </main>
  );
}
```

- **React 18 + TypeScript**: مكونات دالّية مع typing قوي.

```tsx
type CardProps = { title: string; children: React.ReactNode };

export function Card({ title, children }: CardProps) {
  return (
    <section className="rounded-xl border border-white/10 p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
```

- **Tailwind CSS**: أسلوبية utilities مباشرة داخل JSX.

```tsx
export function PrimaryButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button
      {...props}
      className="px-4 py-2 rounded-lg bg-metallic-accent text-white hover:bg-metallic-accent/80 disabled:opacity-60"
    />
  );
}
```

- **Framer Motion**: تحريكات عبر Variants للحاوية والعناصر.

```tsx
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

export function AnimatedList({ items }: { items: string[] }) {
  return (
    <motion.ul initial="hidden" animate="visible" variants={container}>
      {items.map((text) => (
        <motion.li key={text} variants={item} className="py-1">
          {text}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

- **Lucide React**: أيقونات SVG قابلة للتخصيص.

```tsx
import { CheckCircle2 } from "lucide-react";

export function SuccessNote({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-green-400">
      <CheckCircle2 size={18} />
      <span>{text}</span>
    </div>
  );
}
```

- **react-hot-toast**: توستات واجهة المستخدم عبر `Toaster` ومساعد بسيط.

```tsx
// app/layout.tsx (المزود الجذري)
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

// أي ملف عميل
import toast from "react-hot-toast";
export function Save() {
  return (
    <button onClick={() => toast.success("Saved!")} className="btn">
      Save
    </button>
  );
}
```

- **Monaco Editor**: محرر كود داخل التطبيق.

```tsx
import Editor from "@monaco-editor/react";

export function CodeEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="h-72 border border-white/10 rounded-lg overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage="java"
        value={value}
        onChange={(val) => onChange(val || "")}
        theme="vs-dark"
      />
    </div>
  );
}
```

## التدويل والتوجيه (next-intl)

- يفرض الـ middleware بادئة اللغة ويستبعد مسارات النظام و`/api`.

```ts
// src/middleware.ts
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "de"],
  defaultLocale: "en",
  localePrefix: "always",
});

export const config = {
  matcher: ["/((?!_next|api|.*\\.\n*).*)"],
};
```

- تغليف الشجرة بـ `NextIntlClientProvider` وتحميل الرسائل ديناميكياً.

```tsx
// src/app/[locale]/layout.tsx
import { NextIntlClientProvider, useMessages } from "next-intl";

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = useMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

// استخدام داخل صفحة
import { useTranslations } from "next-intl";
export default function About() {
  const t = useTranslations("about");
  return <p className="text-white/80">{t("description")}</p>;
}
```

## إدارة الحالة والتأليف (Zustand)

- مخزن خفيف للمقاطع والمستويات مع دوال مشتقة عملية.

```ts
// src/lib/store.ts (مثال مبسط)
import { create } from "zustand";

type Level = { id: string; levelNumber: number; name: string };
type Store = {
  levels: Level[];
  currentLevel?: Level;
  setLevels: (levels: Level[]) => void;
  setCurrentByNumber: (n: number) => void;
};

export const useAppStore = create<Store>((set, get) => ({
  levels: [],
  setLevels: (levels) => set({ levels }),
  setCurrentByNumber: (n) => {
    const level = get().levels.find((l) => l.levelNumber === n);
    set({ currentLevel: level });
  },
}));
```

```tsx
// استخدام داخل مكون
import { useAppStore } from "@/lib/store";

export function CurrentLevelName() {
  const level = useAppStore((s) => s.currentLevel);
  return <span>{level ? level.name : "No level"}</span>;
}
```

## الشبكات والمصادقة

- **عميل محمي مع تحديث تلقائي للرموز**: يحقن ترويسة Authorization ويعيد المحاولة بعد تحديث الرموز.

```ts
import { ProtectedApiClient, handleApiResponse } from "@/lib/api/client";

export async function loadProfile() {
  const res = await ProtectedApiClient.get("/api/profile");
  const parsed = await handleApiResponse(res);
  if (!parsed.success) throw new Error(String(parsed.error));
  return parsed.data;
}
```

- **sessionUtils**: تخزين الرموز بحسب خيار "تذكرني" والقراءة/المسح.

```ts
import { sessionUtils } from "@/lib/api/client";

// بعد تسجيل الدخول
await sessionUtils.setTokens(
  { accessToken: "a", refreshToken: "r", userId: "123" },
  true
);

// لاحقاً
const tokens = sessionUtils.getTokens();
const isLoggedIn = sessionUtils.isAuthenticated();
```

- **توحيد معالجة الاستجابات**: `handleApiResponse` يعيد `ApiResponse<T>` موحد.

```ts
const response = await fetch("/api/some-endpoint");
const result = await handleApiResponse<{ ok: boolean }>(response);
if (result.success) {
  console.log(result.data?.ok);
} else {
  console.error(result.error);
}
```

- **ترجمة وتشغيل جافا**: إرسال `FormData` إلى `/compile`.

```ts
import { compileJava } from "@/lib/api/client";

const { success, output, error } = await compileJava(
  "public class A { public static void main(String[] a){ System.out.println(1); }}"
);
```

- **نقاط الخدمة (Service endpoints)**: بناء سلاسل الاستعلام عبر `URLSearchParams`.

```ts
const qs = new URLSearchParams({ PageNumber: "1", PageSize: "10" }).toString();
const res = await fetch(`/api/items?${qs}`);
```

## الوسيط (Middleware) وإعداد المسارات

```ts
// src/middleware.ts – إعداد matcher واستثناء المسارات الحساسة
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "de"],
  defaultLocale: "en",
  localePrefix: "always",
});

export const config = {
  matcher: ["/((?!_next|api|.*\\.\n*).*)"],
};
```

---

## ملخص JavaSyntaxChecker

- **الغرض**: تحقق نصي سريع لبنية شيفرة Java وإرجاع أخطاء منظمة.
- **نقطة الدخول**: `validateSyntax(code: string)` وتصدير `javaSyntaxChecker` كمفردة.

استخدام سريع:

```ts
import { javaSyntaxChecker } from "@/lib/javaSyntaxChecker";

const result = javaSyntaxChecker.validateSyntax(`
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello");
  }
}
`);

if (!result.isValid) {
  result.errors.forEach((e) =>
    console.warn(`${e.line}:${e.column} - ${e.message}`)
  );
}
```
