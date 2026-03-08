import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bazar da Jú",
  description:
    "Estamos de mudança e desapegando de vários itens. Móveis, eletrônicos, decoração e mais. Retirada no Campeche.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={dmSans.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
