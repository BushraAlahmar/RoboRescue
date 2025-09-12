import { redirect } from "next/navigation";

export default function RootPage() {
  // Redirect to the default locale
  redirect("/en");
}

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";
