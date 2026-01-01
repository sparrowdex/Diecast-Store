"use client";
import { useState, use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CARS } from "@/data";
import ExhibitPreview from "@/components/ExhibitPreview";

export default function EditExhibitPage({ params, searchParams }) {
  const router = useRouter();
  const { id } = use(params);
  const car = CARS.find(c => c.id.toString() === id);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    scale: "",
    image: "",
    video: "",
    material: "",
    condition: "",
    description: "",
    disclaimer: "",
    size: "small",
  });

  useEffect(() => {
    const savedData = localStorage.getItem('diecast_edit_state');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    } else if (car) {
      setFormData({
        name: car.name || "",
        brand: car.brand || "",
        price: car.price || "",
        scale: car.scale || "",
        image: car.image || "",
        video: car.video || "",
        material: car.material || "",
        condition: car.condition || "",
        description: car.description || "",
        disclaimer: car.disclaimer || "",
        size: car.size || "small",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    localStorage.setItem('diecast_edit_state', JSON.stringify(newFormData));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Exhibit Data:", formData);
    alert("Check the console for the updated exhibit data! We are not saving it yet.");
    router.push("/admin/inventory");
  };

  return (
    <div className="p-12">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Edit Exhibit</h2>
          <p className="text-xs font-mono text-gray-500">Editing <span className="font-bold text-white">#{car.id} - {car.name}</span></p>
        </div>
      </div>

      {/* Form & Preview */}
      <form onSubmit={handleSubmit}>
        <ExhibitPreview formData={formData} handleChange={handleChange} carId={id} />
        
        {/* Form Actions */}
        <div className="px-8 py-4 bg-[#111] border border-white/5 flex justify-end gap-4 mt-[-8px] rounded-b-lg">
            <Link href="/admin/inventory" className="text-gray-400 px-6 py-2 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">
                Cancel
            </Link>
            <button type="submit" className="bg-white text-black px-6 py-2 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors">
                Update Exhibit
            </button>
        </div>
      </form>
    </div>
  );
}