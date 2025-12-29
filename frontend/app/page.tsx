"use client";
import { useState } from "react";
import { Upload, Wand2, Image as ImageIcon, Loader2 } from "lucide-react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Handle the API call to your Backend
  const generateImage = async () => {
    if (!file || !prompt) return alert("Please upload an image and add a prompt!");
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("prompt", prompt);

    try {
      // Connects to your Bun Backend
      const res = await fetch("http://localhost:3000/process", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Error connecting to AI Backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center py-12 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4">
          VisionCraft - Harjapan Singh
        </h1>
        <p className="text-gray-400 text-lg">Transform raw product photos into commercial masterpieces.</p>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT: INPUT ZONE */}
        <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800 shadow-xl">
          
          {/* 1. Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">1. Upload Product</label>
            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${preview ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-500'}`}>
              <input type="file" onChange={handleFileChange} className="hidden" id="upload" accept="image/*" />
              <label htmlFor="upload" className="cursor-pointer flex flex-col items-center">
                {preview ? (
                  <img src={preview} className="h-48 object-contain rounded-lg shadow-sm" alt="Preview" />
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-500 mb-2" />
                    <span className="text-gray-400">Click to upload product image</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* 2. Prompt Input */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-2">2. Describe the Scene</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Sitting on a marble table with morning sunlight and coffee beans..."
              className="w-full bg-[#111] border border-gray-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none h-32"
            />
          </div>

          {/* 3. Generate Button */}
          <button
            onClick={generateImage}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
            {loading ? "Designing Scene..." : "Generate AI Image"}
          </button>
        </div>

        {/* RIGHT: OUTPUT ZONE */}
        <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800 shadow-xl flex flex-col items-center justify-center min-h-[500px]">
          {result?.final_image ? (
            <div className="animate-in fade-in zoom-in duration-500 w-full">
               <h3 className="text-green-400 font-semibold mb-4 flex items-center gap-2">
                 <ImageIcon className="w-5 h-5" /> Generation Successful
               </h3>
               <img src={result.final_image} alt="Generated" className="w-full rounded-xl shadow-2xl border border-gray-700" />

               <a href={result.final_image} download="visioncraft-result.jpg" className="text-blue-400 hover:text-blue-300 text-sm underline mt-2">
                     Download Image
               </a>
               
               {/* Analysis Details (Optional to impress lead) */}
               <div className="mt-6 p-4 bg-black/50 rounded-lg border border-gray-800 text-sm text-gray-400">
                 <p className="font-bold text-gray-300 mb-1">AI Vision Analysis:</p>
                 <p>{result.original_analysis || "No analysis data"}</p>
               </div>
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <div className="bg-[#111] p-6 rounded-full inline-block mb-4">
                <ImageIcon className="w-12 h-12 opacity-20" />
              </div>
              <p>Your masterpiece will appear here</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}