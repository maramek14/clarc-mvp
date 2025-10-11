import { usePhoneGallery } from "../hooks";
import PhotoGrid from "../components/PhotoGrid";

export default function PhoneGallery() {
  const { photos } = usePhoneGallery();
  return (
    <div>
      <h1>Phone Gallery</h1>
      <PhotoGrid photos={photos} />
    </div>
  );
}
