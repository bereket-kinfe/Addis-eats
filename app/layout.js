import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";

export const metadata = {
  metadataBase: new URL("https://addiseats.et"),
  title: {
    template: "%s | Addis Eats",
    default: "Addis Eats - Food delivery in Addis Ababa",
  },
  description: "Order Doro Wat, Tibs, and Kitfo delivered across Addis Ababa.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f8fafc] text-slate-900">
        <Providers>
          <div className="mx-auto max-w-6xl px-4 py-6">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}