
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/api/", "/cart", "/checkout", "/orders/"],
    },
    sitemap: "https://addiseats.et/sitemap.xml",
  };
}