import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Scribe | Take notes & Learn",
  description: "Take lesson notes and manage your school life with ease.",
  icons: [{ rel: "icon", url: "/scribe.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <Head />
      <body>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </TRPCReactProvider>

        <script
          defer
          type="module"
          src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
        ></script>
        <script
          defer
          noModule
          src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"
        ></script>
      </body>
    </html>
  );
}

const Head = () => {
  return (
    <head>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=yes, user-scalable=no, viewport-fit=cover"
      />
      <meta name="application-name" content="Greatex" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Greatex" />
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin={"use-credentials"}
      ></link>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap"
        rel="stylesheet"
      ></link>
      <link rel="icon" type="image/x-icon" href="/scribe_icon192.png"></link>
      <meta name="description" content="Scribe is you school companion" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-tap-highlight" content="no" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="shortcut icon" href="/icons/maskable_icon_x192.png" />
      {/* <Script src="../../install-pwa.js" /> */}
    </head>
  );
};
