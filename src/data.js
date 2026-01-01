export const FEATURED_EXHIBITS = [
  // --- FEATURED EXHIBITS (Main Items for Bento Grid) ---
  {
    id: 1,
    name: "Red Bull Racing RB15",
    brand: "Bburago",
    price: "₹1,400",
    scale: "1:43",
    image: "/cars/rb15.jpg", 
    images: ["/cars/rb15.jpg", "/cars/mclaren.jpg"],
    video: "/videos/rb15-demo.mp4", 
    size: "large", // This will determine the layout in the bento grid
    description: "Max Verstappen's 2019 challenger. Features the iconic matte-finish livery and Honda power unit detailing.",
    material: "Diecast Metal / ABS",
    condition: "Mint (Boxed)",
    disclaimer: "Editor's Note: This model is a key piece from the early Honda partnership era.",
    isNew: true,
  },
  {
    id: 2,
    name: "Mercedes-Maybach S600",
    brand: "Luxury Collection",
    price: "₹1,200",
    scale: "1:24",
    image: "/cars/maybach-land.jpg",
    images: ["/cars/maybach-land.jpg", "/cars/maybach.jpg"],
    video: "/videos/maybach-demo.mp4",
    size: "large", // This will determine the layout in the bento grid
    description: "The pinnacle of luxury. 1:24 scale diecast with opening doors, detailed V12 engine bay, and executive interior.",
    material: "Diecast Metal / Premium Plastic",
    condition: "Excellent",
    disclaimer: "Editor's Note: The weight and feel of this model are exceptional.",
    isNew: true,
  },
  {
    id: 3,
    name: "McLaren MCL36",
    brand: "Bburago",
    price: "₹1,400",
    scale: "1:43",
    image: "/cars/mclaren.jpg",
    images: ["/cars/mclaren.jpg", "/cars/rb15.jpg"],
    size: "medium", // Changed from small to medium for bento grid
    description: "The 2022 season car for McLaren, featuring the striking new-era design.",
    material: "Diecast Metal",
    condition: "Good (Loose)",
    disclaimer: "",
    isNew: true,
  }
];

export const ARCHIVE_COLLECTION = [
  // --- ARCHIVE COLLECTION (Standard Grid Items) ---
  {
    id: 4,
    name: "Mercedes-Maybach (Profile)",
    brand: "Luxury Collection",
    price: "₹1,200",
    scale: "1:24",
    image: "/cars/maybach.jpg",
    images: ["/cars/maybach.jpg", "/cars/maybach-land.jpg"],
    size: "small",
    description: "A profile view showcasing the elegant lines of the Maybach S600.",
    material: "Diecast Metal",
    condition: "Mint (Boxed)",
    disclaimer: "",
    isNew: true,
  },
  {
    id: 5,
    name: "Red Bull RB15 (Side)",
    brand: "Bburago",
    price: "₹1,400",
    scale: "1:43",
    image: "/cars/rb15.jpg",
    images: ["/cars/rb15.jpg", "/cars/mclaren.jpg", "/cars/maybach.jpg"],
    size: "small",
    description: "A side profile of the RB15, highlighting the aerodynamic complexity.",
    material: "Diecast Metal",
    condition: "Very Good",
    disclaimer: "Editor's Note: Display model, may show minor signs of handling."
  }
];

// Combined array of all cars for admin operations
export const CARS = [...FEATURED_EXHIBITS, ...ARCHIVE_COLLECTION];
