import { useState } from "react";

const initialPhoneGallery = [
  { id: "ph1", url: "https://picsum.photos/200/200?random=1" },
  { id: "ph2", url: "https://picsum.photos/200/200?random=2" },
  { id: "ph3", url: "https://picsum.photos/200/200?random=3" },
  { id: "ph4", url: "https://picsum.photos/200/200?random=4" },
];

let globalAppGallery = [
  { id: "app1", url: "https://picsum.photos/200/200?random=11", tag: "check-in" },
  { id: "app2", url: "https://picsum.photos/200/200?random=12", tag: "damage" },
];

export function useAppGallery() {
  const [photos, setPhotos] = useState(globalAppGallery);

  const addPhotos = (newPhotos) => {
    globalAppGallery = [...globalAppGallery, ...newPhotos];
    setPhotos(globalAppGallery);
  };

  const resetGallery = () => {
    globalAppGallery = [];
    setPhotos(globalAppGallery);
  };

  return { photos, addPhotos, resetGallery };
}

export function usePhoneGallery() {
  const [photos] = useState(initialPhoneGallery);
  return { photos };
}
