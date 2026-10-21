import "./globals.css";
import "leaflet/dist/leaflet.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";

export const metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://addiseats.et",
  ),
  title: {
    template: "%s | Addis Eats",
    default: "Addis Eats - Food delivery in Addis Ababa",
  },
  description: "Order Doro Wat, Tibs, and Kitfo delivered across Addis Ababa.",
  openGraph: {
    type: "website",
    siteName: "Addis Eats",
    locale: "en_ET",
    title: "Addis Eats - Food delivery in Addis Ababa",
    description: "Order Ethiopian favourites delivered across Addis Ababa.",
    url: "https://addiseats.et",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Addis Eats - Ethiopian food delivery in Addis Ababa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Addis Eats - Food delivery in Addis Ababa",
    description: "Order Ethiopian favourites delivered across Addis Ababa.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f8fafc] text-slate-900">
        <Providers>
          <div className="mx-auto max-w-6xl px-4 py-4 sm:py-6">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
