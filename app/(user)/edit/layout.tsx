import Creator from "@/components/Creator";
import { Nav } from "@/components/Nav";
import { ShortEditorProvider } from "@/contexts/ShortEditorContext";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Edit",
  description: "Edit your project",
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
        <ShortEditorProvider>
        <div className="h-fit w-full flex flex-col">
        <Nav/>
        <div className="h-screen w-full flex items-start py-20 justify-center">
        {children}
        <Creator/>
        </div>
        </div>
        </ShortEditorProvider>
      </body>
    </html>
  );
}
