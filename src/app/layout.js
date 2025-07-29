import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DataProvider } from "../app/context/data"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Task manager",
  description: "Manage your task!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <DataProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </DataProvider>
    </html>
  );
}
