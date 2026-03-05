import prisma from "@/lib/prisma";
import SubPageNavbar from '@/components/SubPageNavbar';
import Catalog from "./catalog";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

export default async function CatalogPage() {
  let cars = [];
  try {
    cars = await prisma.product.findMany({
      where: {
        NOT: {
          collectionStatus: 'ARCHIVED'
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Database error fetching catalog products:", error);
  }

  return (
    <div className={`${GeistSans.className} ${GeistMono.variable} min-h-screen bg-white`}>
      <SubPageNavbar 
        title="Catalog Ref.01"
        links={[
          { name: 'Home', href: '/' },
          { name: 'Collection', href: '/access' },
          { name: 'Journal', href: '/journal' },
        ]}
      />
      <main>
        <Catalog cars={cars} />
      </main>
    </div>
  );
}