import { AdminHeader } from "../../AdminHeader";
import { UploadForm } from "./UploadForm";
import { site } from "@/lib/site";

export default function NewProductPage() {
  const city = site.address.split(",").slice(-2, -1)[0]?.trim() || "";
  return (
    <>
      <AdminHeader title="Upload a product" sub="Photo, name, short description, MRP and discount — it appears on the website instantly." />
      <UploadForm defaultLocation={city} />
    </>
  );
}
