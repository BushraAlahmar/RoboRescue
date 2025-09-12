## Frontend core technologies

- **Next.js (App Router)**: Pages and layouts live under `src/app`. The locale-aware route is `src/app/[locale]`, and the root layout is `src/app/layout.tsx`.

Example of a simple locale page and link:

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

- **React 18 + TypeScript**: Functional components with strong typing.

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

- **Tailwind CSS**: Utility-first styling directly in JSX.

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

- **Framer Motion**: Animations via container/item Variants.

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

- **Lucide React**: Customizable SVG icons.

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

- **react-hot-toast**: UI toasts via a global `Toaster`.

```tsx
// app/layout.tsx (root provider)
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

// any client file
import toast from "react-hot-toast";
export function Save() {
  return (
    <button onClick={() => toast.success("Saved!")} className="btn">
      Save
    </button>
  );
}
```

- **Monaco Editor**: In‑app code editor.

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

## Internationalization and routing (next-intl)

- The middleware enforces a locale prefix and excludes system and `/api` paths.

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

- Wrap the tree with `NextIntlClientProvider` and load messages dynamically.

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

// usage in a page
import { useTranslations } from "next-intl";
export default function About() {
  const t = useTranslations("about");
  return <p className="text-white/80">{t("description")}</p>;
}
```

## State management and composition (Zustand)

- Lightweight store for sections/levels with handy derived actions.

```ts
// src/lib/store.ts (minimal example)
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
// component usage
import { useAppStore } from "@/lib/store";

export function CurrentLevelName() {
  const level = useAppStore((s) => s.currentLevel);
  return <span>{level ? level.name : "No level"}</span>;
}
```

## Networking and authentication

- **Protected client with automatic token refresh**: injects Authorization headers and retries after refresh.

```ts
import { ProtectedApiClient, handleApiResponse } from "@/lib/api/client";

export async function loadProfile() {
  const res = await ProtectedApiClient.get("/api/profile");
  const parsed = await handleApiResponse(res);
  if (!parsed.success) throw new Error(String(parsed.error));
  return parsed.data;
}
```

- **sessionUtils**: store tokens based on the "remember me" option and read/clear later.

```ts
import { sessionUtils } from "@/lib/api/client";

// after sign-in
await sessionUtils.setTokens(
  { accessToken: "a", refreshToken: "r", userId: "123" },
  true
);

// later
const tokens = sessionUtils.getTokens();
const isLoggedIn = sessionUtils.isAuthenticated();
```

- **Unified response handling**: `handleApiResponse` returns a consistent `ApiResponse<T>`.

```ts
const response = await fetch("/api/some-endpoint");
const result = await handleApiResponse<{ ok: boolean }>(response);
if (result.success) {
  console.log(result.data?.ok);
} else {
  console.error(result.error);
}
```

- **Compile and run Java**: send `FormData` to `/compile`.

```ts
import { compileJava } from "@/lib/api/client";

const { success, output, error } = await compileJava(
  "public class A { public static void main(String[] a){ System.out.println(1); }}"
);
```

- **Service endpoints**: build query strings with `URLSearchParams`.

```ts
const qs = new URLSearchParams({ PageNumber: "1", PageSize: "10" }).toString();
const res = await fetch(`/api/items?${qs}`);
```

## Middleware and route setup

```ts
// src/middleware.ts – matcher configuration and exclusions
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

## JavaSyntaxChecker summary

- **Purpose**: Fast textual validation of Java code and a structured list of errors.
- **Entry point**: `validateSyntax(code: string)` and an exported singleton `javaSyntaxChecker`.

Quick usage:

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
