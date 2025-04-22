
import "./globals.css";

export const metadata = {
  title: "Crawl app admin",
  description: "This is crawl-app admin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
