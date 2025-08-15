"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function FilesApp() {
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // Fetch files from Supabase Storage
  useEffect(() => {
    async function fetchFiles() {
      const { data, error } = await supabase.storage
        .from("files")
        .list("", { limit: 100 });
      if (data) setFiles(data);
    }
    fetchFiles();
  }, []);

  // Handle file upload
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { error } = await supabase.storage
      .from("files")
      .upload(file.name, file);
    setUploading(false);
    if (!error) window.location.reload();
  }

  // Handle file download
  async function handleDownload(fileName: string) {
    const { data } = supabase.storage.from("files").getPublicUrl(fileName);
    window.open(data.publicUrl, "_blank");
  }

  // Handle file delete
  async function handleDelete(fileName: string) {
    await supabase.storage.from("files").remove([fileName]);
    window.location.reload();
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Files</h3>
      <input
        type="file"
        onChange={handleUpload}
        disabled={uploading}
        className="mb-4"
      />
      <ul className="divide-y divide-gray-300">
        {files.map(file => (
          <li key={file.name} className="flex items-center justify-between py-2">
            <span>{file.name}</span>
            <div className="flex gap-2">
              <button
                className="bg-blue-600 text-white px-2 py-1 rounded"
                onClick={() => handleDownload(file.name)}
              >
                Download
              </button>
              <button
                className="bg-red-600 text-white px-2 py-1 rounded"
                onClick={() => handleDelete(file.name)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}