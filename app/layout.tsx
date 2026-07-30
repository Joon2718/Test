import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "나의 진로 여정 | 대학생 진로설계 워크북",
  description: "하고 싶은 일을 발견하고, 목표까지의 여정을 구체화하는 대학생 진로설계 워크북",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
