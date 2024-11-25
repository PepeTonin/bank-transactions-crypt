"use client";

import "./globals.css";

import { Roboto } from "next/font/google";
import { NextUIProvider } from "@nextui-org/system";
import { Provider } from "react-redux";
import { store } from "@/store/store";

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "300", "400", "500", "700", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>
        <Provider store={store}>
          <NextUIProvider>{children}</NextUIProvider>
        </Provider>
      </body>
    </html>
  );
}
