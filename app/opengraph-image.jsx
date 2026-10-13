import { ImageResponse } from "next/og";

export const alt = "Addis Eats - Ethiopian food delivery in Addis Ababa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "80px",
          background: "#7f1d1d",
          color: "white",
        }}
      >
        <div style={{ fontSize: 38, fontWeight: 700, color: "#fecaca" }}>ADDIS EATS</div>
        <div style={{ marginTop: 22, fontSize: 72, fontWeight: 800 }}>
          Ethiopian favourites, delivered.
        </div>
        <div style={{ marginTop: 26, fontSize: 34 }}>Fresh meals across Addis Ababa</div>
      </div>
    ),
    size,
  );
}
