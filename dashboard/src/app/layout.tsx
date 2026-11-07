import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "كافيه ستوديو ☕ | أتمتة فيديوهات الكافيهات السعودية",
  description: "منظومة إنتاج ونشر فيديوهات الكافيهات بالذكاء الاصطناعي على تيك توك وريلز وسناب شات",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className="bg-[#0c0a09] text-gray-100 min-h-screen antialiased selection:bg-amber-500 selection:text-black">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
