"use client";

import { useEffect, useState } from "react";
import { CircleMarker, MapContainer, Popup, Polyline, TileLayer, useMap } from "react-leaflet";
import { getOrderRouteProgress } from "@/lib/order-status";

const RESTAURANT = [8.995, 38.7896];
const DELIVERY_ADDRESS = [8.98, 38.75];

function FitToRoute({ route }) {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(route.length > 0 ? route : [RESTAURANT, DELIVERY_ADDRESS], {
      padding: [24, 24],
    });
  }, [map, route]);

  return null;
}

function pointAlongRoute(route, progress) {
  if (route.length === 0) return RESTAURANT;
  if (progress <= 0) return route[0];
  if (progress >= 1) return route[route.length - 1];

  let totalLength = 0;
  const segmentLengths = [];
  for (let index = 1; index < route.length; index += 1) {
    const latitudeScale = Math.cos((route[index - 1][0] * Math.PI) / 180);
    const latitudeDelta = route[index][0] - route[index - 1][0];
    const longitudeDelta = (route[index][1] - route[index - 1][1]) * latitudeScale;
    const length = Math.hypot(latitudeDelta, longitudeDelta);
    segmentLengths.push(length);
    totalLength += length;
  }

  let remainingLength = totalLength * progress;
  for (let index = 0; index < segmentLengths.length; index += 1) {
    const length = segmentLengths[index];
    if (remainingLength <= length) {
      const fraction = length === 0 ? 0 : remainingLength / length;
      return [
        route[index][0] + (route[index + 1][0] - route[index][0]) * fraction,
        route[index][1] + (route[index + 1][1] - route[index][1]) * fraction,
      ];
    }
    remainingLength -= length;
  }

  return route[route.length - 1];
}

export default function DeliveryMap({ status }) {
  const [route, setRoute] = useState([]);
  const [routeState, setRouteState] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();
    const requestCoordinates = `${RESTAURANT[1]},${RESTAURANT[0]};${DELIVERY_ADDRESS[1]},${DELIVERY_ADDRESS[0]}`;
    const routeUrl = `https://router.project-osrm.org/route/v1/driving/${requestCoordinates}?overview=full&geometries=geojson`;

    async function loadRoadRoute() {
      try {
        const response = await fetch(routeUrl, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Route request failed (${response.status}).`);
        }

        const result = await response.json();
        const routeCoordinates = result.routes?.[0]?.geometry?.coordinates;
        if (!Array.isArray(routeCoordinates) || routeCoordinates.length < 2) {
          throw new Error("The routing service returned no road route.");
        }

        setRoute(routeCoordinates.map(([longitude, latitude]) => [latitude, longitude]));
        setRouteState("ready");
      } catch (error) {
        if (error.name !== "AbortError") {
          setRouteState("error");
        }
      }
    }

    loadRoadRoute();
    return () => controller.abort();
  }, []);

  const courierPosition = pointAlongRoute(route, getOrderRouteProgress(status));

  return (
    <div className="relative">
      <MapContainer
        center={[8.989, 38.77]}
        zoom={13}
        scrollWheelZoom={false}
        className="h-80 w-full rounded-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <FitToRoute route={route} />
        {route.length > 0 && <Polyline positions={route} color="#dc2626" weight={5} />}
        <CircleMarker center={RESTAURANT} radius={9} pathOptions={{ color: "#1d4ed8" }}>
          <Popup>Restaurant · Bole</Popup>
        </CircleMarker>
        <CircleMarker center={courierPosition} radius={9} pathOptions={{ color: "#dc2626" }}>
          <Popup>Courier · {status}</Popup>
        </CircleMarker>
        <CircleMarker center={DELIVERY_ADDRESS} radius={9} pathOptions={{ color: "#15803d" }}>
          <Popup>Delivery address</Popup>
        </CircleMarker>
      </MapContainer>
      <p className="sr-only" aria-live="polite">
        {routeState === "loading" && "Loading the road route."}
        {routeState === "error" && "The road route could not be loaded; showing the restaurant and delivery locations without a straight-line route."}
        {routeState === "ready" && "Road route loaded."}
      </p>
      {routeState === "error" && (
        <p role="status" className="mt-2 text-sm text-amber-800">
          Road route unavailable right now. The map still shows the restaurant, courier, and delivery address.
        </p>
      )}
    </div>
  );
}
