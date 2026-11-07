import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daichi - Direct Farmer-to-Buyer Ecosystem",
  description: "Direct Farm Intelligence & Fair Market Pricing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-daichi-bg text-daichi-charcoal antialiased">
        {children}
      </body>
    </html>
  );
}