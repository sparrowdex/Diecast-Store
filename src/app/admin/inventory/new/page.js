"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ExhibitPreview from "@/components/ExhibitPreview";
import { UploadButton } from "@uploadthing/react";

export default function NewExhibitPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [featuredExhibits, setFeaturedExhibits] = useState([]);
    const [formData, setFormData] = useState({
      name: "",
      brand: "",
      price: "",
      scale: "",
      images: [],
      video: "",
      material: "",
      condition: "",
      description: "",
      category: "Archive",
      stock: 1,
    });
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      const newFormData = { ...formData, [name]: type === 'checkbox' ? checked : value };
      setFormData(newFormData);
    };

    const handleImageChange = (e) => {
      const { value } = e.target;
      setFormData({ ...formData, images: value.split(',').map(s => s.trim()) });
    };

    const handleImageUpload = (res) => {
      console.log("Image upload complete:", res);
      if (res) {
        const newImageUrls = res.map(file => file.ufsUrl);
        const updatedImages = [...formData.images, ...newImageUrls];
        setFormData({ ...formData, images: updatedImages });
        alert(`Image upload successful! ${res.length} file(s) uploaded.`);
      }
    };

    const handleVideoUpload = (res) => {
      console.log("Video upload complete:", res);
      if (res) {
        const newVideoUrls = res.map(file => file.ufsUrl);
        const updatedVideo = newVideoUrls[0];
        setFormData({ ...formData, video: updatedVideo });
        alert(`Video upload successful! File uploaded.`);
      }
    };
  
    const handleNext = () => {
      // In a real app, you might add validation here before proceeding
      if (formData.category === "Featured") {
        setStep(2);
      } else {
        setStep(2);
      }
    };
  
    const handlePrev = () => {
      if (formData.category === "Featured" && step === 3) {
        setStep(2);
      } else {
        setStep(1);
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      router.push("/admin/inventory");
    };
  
    return (
      <div className="p-12">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">
              {step === 1 ? "New Exhibit" : step === 2 ? "Preview & Edit Exhibit" : "Bento Grid Placement"}
            </h2>
            <p className="text-xs font-mono text-gray-500">
              {step === 1
                ? "Add a new model to the gallery database."
                : step === 2
                ? "Visualize, edit, and confirm the new model details."
                : "Choose bento grid placement for featured exhibit."}
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
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Images
                </label>
                <UploadButton
                  endpoint="mediaUploader"
                  onClientUploadComplete={handleImageUpload}
                  onUploadError={(error) => {
                    alert(`ERROR! ${error.message}`);
                  }}
                />
                {formData.images.length > 0 && (
                  <div className="mt-2 text-xs text-gray-300">
                    <p className="mb-1">Uploaded Images:</p>
                    <ul className="space-y-1">
                      {formData.images.map((url, index) => (
                        <li key={index} className="truncate bg-white/5 p-2 rounded">
                          {url.split('/').pop()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Video (Optional)
                </label>
                <UploadButton
                  endpoint="mediaUploader"
                  onClientUploadComplete={handleVideoUpload}
                  onUploadError={(error) => {
                    alert(`ERROR! ${error.message}`);
                  }}
                />
                {formData.video && (
                  <div className="mt-2 text-xs text-gray-300">
                    <p className="mb-1">Uploaded Video:</p>
                    <div className="truncate bg-white/5 p-2 rounded">
                      {formData.video.split('/').pop()}
                    </div>
                  </div>
                )}
              </div>
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
                  <label htmlFor="stock" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full bg-white/5 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                    placeholder="e.g., 1"
                    required
                  />
              </div>

              <div>
                <label htmlFor="category" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-white/5 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                >
                  <option value="Archive">Archive Collection (Bento Grid)</option>
                  <option value="Featured">Featured Exhibit (Bento Grid)</option>
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
            <ExhibitPreview formData={formData} handleChange={handleChange} handleImageChange={handleImageChange} />
            <div className="px-8 py-4 bg-[#111] border border-white/5 flex justify-end gap-4 mt-[-8px] rounded-b-lg">
              <button onClick={handlePrev} className="text-gray-400 px-6 py-2 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">
                Back to Edit
              </button>
              {formData.category === "Featured" ? (
                <button onClick={() => setStep(3)} className="bg-white text-black px-6 py-2 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors">
                  Next: Bento Placement
                </button>
              ) : (
                <button onClick={handleSubmit} className="bg-white text-black px-6 py-2 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors">
                  Create Exhibit
                </button>
              )}
            </div>
          </div>
        )}

        {step === 3 && formData.category === "Featured" && (
          <div>
            <div className="bg-[#111] border border-white/5 rounded-lg p-8">
              <h3 className="text-xl font-bold mb-6 text-white">Bento Grid Placement</h3>
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6">
                  <h4 className="text-lg font-bold mb-4">Select Bento Grid Type</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 transition-colors">
                      <h5 className="font-bold">Type 1</h5>
                      <p className="text-sm text-gray-600">Standard layout</p>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 transition-colors">
                      <h5 className="font-bold">Type 2</h5>
                      <p className="text-sm text-gray-600">Alternative layout</p>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 transition-colors">
                      <h5 className="font-bold">Type 3</h5>
                      <p className="text-sm text-gray-600">Compact layout</p>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 transition-colors">
                      <h5 className="font-bold">Type 4</h5>
                      <p className="text-sm text-gray-600">Wide layout</p>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6">
                  <h4 className="text-lg font-bold mb-4">Previously Featured Exhibits</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Placeholder for previously featured exhibits */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-600">No previously featured exhibits</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-8 py-4 bg-[#111] border border-white/5 flex justify-end gap-4 mt-[-8px] rounded-b-lg">
              <button onClick={handlePrev} className="text-gray-400 px-6 py-2 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">
                Back to Preview
              </button>
              <button onClick={handleSubmit} className="bg-white text-black px-6 py-2 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors">
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