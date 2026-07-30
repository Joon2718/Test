import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const imageUrl = new URL("/og.png", origin).toString();

  return {
    metadataBase: new URL(origin),
    title: "나의 진로 여정 | 대학생 진로설계 워크북",
    description: "하고 싶은 일을 발견하고, 목표까지의 여정을 구체화하는 대학생 진로설계 워크북",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "나의 진로 여정",
      description: "생각을 기록하고, 가능성을 발견하세요.",
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "나의 진로 여정" }],
    },
    twitter: { card: "summary_large_image", title: "나의 진로 여정", description: "생각을 기록하고, 가능성을 발견하세요.", images: [imageUrl] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
