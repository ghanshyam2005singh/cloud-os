"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function GalleryApp() {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  // Fetch images from Supabase Storage
  useEffect(() => {
    async function fetchImages() {
      const { data, error } = await supabase.storage
        .from("gallery")
        .list("", { limit: 100 });
      if (data) {
        setImages(data.map((file: any) =>
          supabase.storage.from("gallery").getPublicUrl(file.name).data.publicUrl
        ));
      }
    }
    fetchImages();
  }, []);

  // Handle image upload
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { error } = await supabase.storage
      .from("gallery")
      .upload(file.name, file);
    setUploading(false);
    if (!error) window.location.reload();
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Gallery</h3>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        className="mb-4"
      />
      <div className="grid grid-cols-3 gap-4">
        {images.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt="Gallery"
            className="rounded-lg cursor-pointer border border-gray-300"
            onClick={() => setPreview(url)}
          />
        ))}
      </div>
      {preview && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <img src={preview} alt="Preview" className="max-h-[80vh] rounded-xl shadow-2xl" />
          <button
            className="absolute top-8 right-8 bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => setPreview(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}