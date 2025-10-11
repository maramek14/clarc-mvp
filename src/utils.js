import { properties } from "./data";

export function getPropertyById(id) {
  return properties.find((p) => p.id === id);
}

export function getRoomById(property, roomId) {
  return property?.rooms.find((r) => r.id === roomId);
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-GB");
}
