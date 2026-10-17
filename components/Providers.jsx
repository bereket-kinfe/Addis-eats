"use client";

import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function Providers({ children }) {
  return <ThemeProvider><CartProvider>{children}</CartProvider></ThemeProvider>;
}
