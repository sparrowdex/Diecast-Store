"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ExhibitPreview from "@/components/ExhibitPreview";

export default function NewExhibitPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
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
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleNext = () => {
      // In a real app, you might add validation here before proceeding
      setStep(2);
    };
  
    const handlePrev = () => {
      setStep(1);
    };
  
    // In a real app, you'd handle form submission here.
    // For now, we'll just log it and redirect.
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("New Exhibit Data:", formData);
      alert("Check the console for the new exhibit data! We are not saving it yet.");
      router.push("/admin/inventory");
    };
  
    return (
      <div className="p-12">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">
              {step === 1 ? "New Exhibit" : "Preview & Edit Exhibit"}
            </h2>
            <p className="text-xs font-mono text-gray-500">
              {step === 1
                ? "Add a new model to the gallery database."
                : "Visualize, edit, and confirm the new model details."}
            </p>
          </div>
        </div>
  
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="bg-[#111] border border-white/5 rounded-lg">
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Form Fields */}
              <InputField name="name" label="Exhibit Name" value={formData.name} onChange={handleChange} placeholder="e.g., Red Bull Racing RB19" required />
              <InputField name="brand" label="Brand" value={formData.brand} onChange={handleChange} placeholder="e.g., Bburago" required />
              <InputField name="price" label="Price" value={formData.price} onChange={handleChange} placeholder="e.g., ₹1,400" required />
              <InputField name="scale" label="Scale" value={formData.scale} onChange={handleChange} placeholder="e.g., 1:43" required />
              <InputField name="image" label="Image URL(s)" value={formData.image} onChange={handleChange} placeholder="e.g., /cars/rb19.jpg, /cars/rb19_2.jpg" required />
              <InputField name="video" label="Video URL (Optional)" value={formData.video} onChange={handleChange} placeholder="e.g., /videos/rb19-demo.mp4" />
              <InputField name="material" label="Material" value={formData.material} onChange={handleChange} placeholder="e.g., Diecast Metal / ABS" />
              <InputField name="condition" label="Condition" value={formData.condition} onChange={handleChange} placeholder="e.g., Mint (Boxed)" />
  
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-white/5 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                  placeholder="A brief description of the model..."
                ></textarea>
              </div>
  
              <div className="md:col-span-2">
                <label htmlFor="disclaimer" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Editor's Note (Disclaimer)
                </label>
                <textarea
                  id="disclaimer"
                  name="disclaimer"
                  rows="3"
                  value={formData.disclaimer}
                  onChange={handleChange}
                  className="w-full bg-white/5 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                  placeholder="e.g., Display model, may show minor signs of handling."
                ></textarea>
              </div>
  
              <div>
                <label htmlFor="size" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Section
                </label>
                <select
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full bg-white/5 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-yellow-500 transition-all appearance-none"
                >
                  <option value="small">Archive Collection</option>
                  <option value="large">Featured Exhibit</option>
                </select>
              </div>
            </div>
  
            {/* Form Actions */}
            <div className="px-8 py-4 bg-black/20 border-t border-white/5 flex justify-end gap-4">
              <Link href="/admin/inventory" className="text-gray-400 px-6 py-2 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">
                Cancel
              </Link>
              <button type="submit" className="bg-white text-black px-6 py-2 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors">
                Next: Preview
              </button>
            </div>
          </form>
        )}
  
        {step === 2 && (
          <div>
            <ExhibitPreview formData={formData} handleChange={handleChange} />
            <div className="px-8 py-4 bg-[#111] border border-white/5 flex justify-end gap-4 mt-[-8px] rounded-b-lg">
              <button onClick={handlePrev} className="text-gray-400 px-6 py-2 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">
                Back to Edit
              </button>            <button onClick={handleSubmit} className="bg-white text-black px-6 py-2 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors">
              Create Exhibit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Input Field Component
function InputField({ name, label, placeholder, required = false, value, onChange }) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-white/5 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
