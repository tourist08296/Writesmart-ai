import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WriteSmart AI - 你的写作智能助手",
  description: "通过 AI 技术帮助学生提升写作能力，支持图片识别与全方位评分。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-gray-50 uppercase-none">
          {children}
        </main>
      </body>
    </html>
  );
}
