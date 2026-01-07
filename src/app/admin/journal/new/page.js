"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/components/UploadButton";
import RichTextEditor from "@/components/RichTextEditor";
import "../../../tiptap.css";


export default function NewJournalEntryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    author: "",
    isPublished: false,
    imageUrl: "",
    videoUrl: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContentChange = (newContent) => {
    setFormData(prev => ({
      ...prev,
      content: newContent
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      router.push("/admin/journal");
    } catch (error) {
      console.error("Failed to create journal entry:", error);
      alert("Failed to create journal entry. Check the console for more details.");
    }
  };

  return (
    <div className="p-12 text-white">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">New Journal Entry</h2>
          <p className="text-xs font-mono text-gray-500">Create a new article for the journal.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#111] border border-white/5 rounded-lg p-8 grid grid-cols-1 gap-8">
        <InputField name="title" label="Title" value={formData.title} onChange={handleChange} placeholder="e.g., The History of Diecast Models" required />
        <InputField name="slug" label="Slug" value={formData.slug} onChange={handleChange} placeholder="e.g., history-of-diecast-models" required />
        <InputField name="author" label="Author" value={formData.author} onChange={handleChange} placeholder="e.g., John Doe" />
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Content</label>
          <RichTextEditor
            content={formData.content}
            onUpdate={handleContentChange}
          />
        </div>

        <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Media</label>
            <div className="flex items-center gap-4">
                <UploadButton
                    endpoint="mediaUploader"
                    onClientUploadComplete={(res) => {
                        if (res) {
                            const fileUrl = res[0].url;
                            const fileType = res[0].type;
                            if (fileType.startsWith("image/")) {
                                setFormData(prev => ({ ...prev, imageUrl: fileUrl, videoUrl: "" }));
                            } else if (fileType.startsWith("video/")) {
                                setFormData(prev => ({ ...prev, videoUrl: fileUrl, imageUrl: "" }));
                            }
                        }
                    }}
                    onUploadError={(error) => {
                        alert(`ERROR! ${error.message}`);
                    }}
                />
            </div>
            {formData.imageUrl && (
                <div className="mt-4">
                    <p className="text-xs font-mono text-gray-500 mb-2">Image Preview:</p>
                    <img src={formData.imageUrl} alt="Image preview" className="rounded-lg w-full max-w-xs" />
                </div>
            )}
            {formData.videoUrl && (
                <div className="mt-4">
                    <p className="text-xs font-mono text-gray-500 mb-2">Video Preview:</p>
                    <video src={formData.videoUrl} controls className="rounded-lg w-full max-w-xs" />
                </div>
            )}
        </div>

        <div className="flex items-center gap-4">
          <input type="checkbox" name="isPublished" id="isPublished" checked={formData.isPublished} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500" />
          <label htmlFor="isPublished" className="text-sm text-gray-300">Publish this entry</label>
        </div>

        <div className="flex justify-end gap-4 mt-4 border-t border-white/5 pt-4">
          <Link href="/admin/journal" className="text-gray-400 px-6 py-2 font-bold text-xs uppercase tracking-widest">Cancel</Link>
          <button type="submit" className="bg-white text-black px-6 py-2 font-black text-xs uppercase tracking-widest hover:bg-gray-200">Create Entry</button>
        </div>
      </form>
    </div>
  );
}

function InputField({ name, label, placeholder, required = false, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} className="w-full bg-white/5 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-yellow-500 transition-all text-white" />
    </div>
  );
}
