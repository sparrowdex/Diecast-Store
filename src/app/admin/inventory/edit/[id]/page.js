import prisma from "@/lib/prisma";
import EditExhibit from "./EditExhibit";

export default async function EditExhibitPage({ params }) {
  const { id } = await params;
  const car = await prisma.product.findUnique({
    where: {
      id: id,
    },
  });

  return <EditExhibit car={car} />;
}