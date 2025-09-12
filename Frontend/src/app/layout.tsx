import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OOP Game",
  description: "The best game to learn oop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 