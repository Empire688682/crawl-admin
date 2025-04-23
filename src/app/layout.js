
import { AppProvider } from "@/component/Context";
import "./globals.css";

export const metadata = {
  title: "Crawl app admin",
  description: "This is crawl-app admin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
      className="px-4 md:px-8 bg-[#0e0e0e]"
      >
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
