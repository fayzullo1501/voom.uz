import fetch from "node-fetch";

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export const getRouteMetrics = async ({
  fromLat,
  fromLon,
  toLat,
  toLon,
  departureAt,
}) => {
  if (!GOOGLE_API_KEY) {
    throw new Error("GOOGLE_MAPS_API_KEY is not defined");
  }

  const departureTimestamp = Math.floor(
    new Date(departureAt).getTime() / 1000
  );

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json
    ?origins=${fromLat},${fromLon}
    &destinations=${toLat},${toLon}
    &departure_time=${departureTimestamp}
    &key=${GOOGLE_API_KEY}`
    .replace(/\s/g, "");

  const response = await fetch(url);
  const data = await response.json();

  if (
    !data.rows ||
    !data.rows[0] ||
    !data.rows[0].elements ||
    !data.rows[0].elements[0]
  ) {
    throw new Error("Invalid Google API response");
  }

  const element = data.rows[0].elements[0];

  if (element.status !== "OK") {
    throw new Error("Route not found");
  }

  const distanceMeters = element.distance.value;
  const durationSeconds =
    element.duration_in_traffic?.value || element.duration.value;

  const arrivalAt = new Date(
    new Date(departureAt).getTime() + durationSeconds * 1000
  );

  return {
    distanceMeters,
    durationSeconds,
    arrivalAt,
  };
};