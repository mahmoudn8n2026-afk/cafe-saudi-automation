import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "ستوديو أتمتة كافيهات السعودية ☕ | لوحة التحكم المتطورة",
  description: "المنظومة السحابية لإنتاج فيديوهات تيك توك وريلز وسناب شات للكافيهات السعودية بالذكاء الاصطناعي وبدون تكلفة شهرية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark scroll-smooth">
      <body className="bg-[#0D0B09] text-[#F5F2ED] min-h-screen antialiased selection:bg-[#C28751] selection:text-white">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
