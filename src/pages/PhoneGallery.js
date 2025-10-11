import { usePhoneGallery } from "../hooks";
import PhotoGrid from "../components/PhotoGrid";

export default function PhoneGallery() {
  const { photos } = usePhoneGallery();
  return (
    <div>
      
      <PhotoGrid photos={photos} />
    </div>
  );
}
