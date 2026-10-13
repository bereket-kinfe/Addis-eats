
import { ImageResponse } from "next/og";
import { getDish } from "@/lib/api";

export const size = { width: 1200, height: 630 };

export const alt = "Addis Eats Ethiopian dish";
export const contentType = "image/png";

export default async function Image({ params }) {
  const { id } = await params;
  const dish = await getDish(id);

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 72,
          background: "#0A1F3D",
          color: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        <div>{dish?.name || "Addis Eats"}</div>
        <div style={{ fontSize: 36, color: "#38BDF8", marginTop: "20px" }}>
          {dish ? `${dish.price} ETB` : "Fresh Ethiopian Cuisine"}
        </div>
      </div>
    ),
    size
  );
}