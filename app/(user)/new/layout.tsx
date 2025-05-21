import Creator from "@/components/Creator";
import { Nav } from "@/components/Nav";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";


export const metadata: Metadata = {
  title: "New Project",
  description: "Long to short content creation platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
      >
        <div className="h-screen w-full flex flex-col">
        <Nav/>
        <div className="h-full w-full flex items-start py-20 justify-center">
        {children}
        <Creator/>
        </div>
        </div>
      </body>
    </html>
  );
}
