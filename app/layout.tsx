import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["thai"],
});



export const metadata: Metadata = {
  title: "Task App by kanyada",
  description: "บันทึกงานที่ต้องทำ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${prompt.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
