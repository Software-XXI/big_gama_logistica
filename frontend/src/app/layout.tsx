import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Big Gamma Logística",
  description: "App offline-first para gestión de logística",
  manifest: "/manifest.json",
};

// Next.js requires viewport to be exported separately from `metadata`.
// See: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Providers>{children}</Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
