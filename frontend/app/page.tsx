"use client";

import { useState } from "react";
import { 
  Upload, Sparkles, Image as ImageIcon, Download, 
  Zap, Layers, Settings, History, Wand2, Monitor, Sun, LayoutTemplate, Loader2,
  CheckCircle2, Ratio, FileType, Crown
} from "lucide-react";
import { removeBackground } from "@imgly/background-removal";
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

// --- TEMPLATES ---
const TEMPLATES = [
  {
    id: "neon",
    label: "Cyberpunk",
    icon: <Monitor size={16} />,
    color: "from-pink-500 to-purple-600",
    prompt: "Product photography, wide shot. The product sits centrally on a dark, reflective futuristic desk. Neon geometric shapes glow in the background. 8k resolution, cinematic lighting."
  },
  {
    id: "luxury",
    label: "Luxury",
    icon: <Sparkles size={16} />,
    color: "from-yellow-400 to-orange-500",
    prompt: "High-end commercial shot. The product is placed on a polished black marble podium. Golden rim lighting highlights the edges. The background is a luxurious dark studio. Sharp focus, expensive aesthetic."
  },
  {
    id: "summer",
    label: "Tropical",
    icon: <Sun size={16} />,
    color: "from-blue-400 to-green-400",
    prompt: "Bright summer advertisement. The product rests on a wooden beach table. Sunlight filters through palm leaves, casting realistic shadows. Background is a blurred turquoise ocean. Refreshing, airy, natural light."
  },
  {
    id: "minimal",
    label: "Minimal",
    icon: <LayoutTemplate size={16} />,
    color: "from-gray-300 to-white",
    prompt: "Studio minimalism. The product stands on a seamless infinite white surface. Soft, diffused lighting from the left. Generous white negative space around the product. Ultra-clean, modern look."
  }
];

export default function Home() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState("studio"); 
  const [history, setHistory] = useState<any[]>([]); 
  
  // Settings State
  const [aspectRatio, setAspectRatio] = useState("1:1"); // 1:1, 16:9, 9:16
  const [exportFormat, setExportFormat] = useState("PNG"); // PNG, JPG

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); 
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  // --- ACTIONS ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setResult(null);
      setProcessing(true);
      setActiveTab("studio");
      
      try {
        const objectUrl = URL.createObjectURL(file);
        setOriginalUrl(objectUrl);
        setPreviewUrl(objectUrl);

        console.log("Removing background...");
        const blob = await removeBackground(file);
        const cutoutUrl = URL.createObjectURL(blob);
        
        setPreviewUrl(cutoutUrl); 
        setProcessedImage(blob);
        
      } catch (error) {
        console.error("Bg removal failed:", error);
        setProcessedImage(file); 
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleGenerate = async () => {
    if (!processedImage || !prompt) return;
    setLoading(true);
    setResult(null);

    // Append Aspect Ratio to Prompt
    const ratioPrompt = aspectRatio === "16:9" ? " --ar 16:9 (Wide cinematic shot)" : 
                        aspectRatio === "9:16" ? " --ar 9:16 (Tall social media shot)" : "";
    
    const finalPrompt = prompt + ratioPrompt;

    const formData = new FormData();
    formData.append("image", processedImage, "cutout.png");
    formData.append("prompt", finalPrompt);

    try {
      const response = await fetch("http://localhost:3000/generate", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);
      
      setHistory(prev => [{ 
        id: Date.now(), 
        image: data.final_image, 
        prompt: prompt, 
        original: originalUrl 
      }, ...prev]);

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30">
      
      {/* GLOW */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex h-screen">
        
        {/* SIDEBAR */}
        <aside className="w-20 lg:w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col items-center lg:items-start py-8 px-4 gap-6">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-900/20">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <span className="hidden lg:block font-bold text-xl tracking-tight">VisionCraft</span>
          </div>
          <nav className="flex flex-col gap-2 w-full">
            <NavItem icon={<Wand2 size={20} />} label="Studio" active={activeTab === "studio"} onClick={() => setActiveTab("studio")} />
            <NavItem icon={<History size={20} />} label={`History (${history.length})`} active={activeTab === "history"} onClick={() => setActiveTab("history")} />
            <NavItem icon={<Settings size={20} />} label="Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
          </nav>
        </aside>

        {/* WORKSPACE */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          
          {/* VIEW 1: STUDIO */}
          {activeTab === "studio" && (
            <div className="flex flex-col lg:flex-row h-full">
              <div className="w-full lg:w-[400px] border-r border-white/5 bg-black/20 p-6 flex flex-col gap-6 overflow-y-auto">
                <div>
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">1. Product Source</h2>
                  <label className={`group relative flex flex-col items-center justify-center w-full h-48 rounded-xl border border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-purple-500/30 transition-all cursor-pointer overflow-hidden ${processing ? 'pointer-events-none opacity-80' : ''}`}>
                    {processing ? (
                      <div className="flex flex-col items-center justify-center text-purple-400 animate-pulse"><Loader2 size={32} className="animate-spin mb-2" /><p className="text-xs font-bold">Removing Background...</p></div>
                    ) : previewUrl ? (
                      <div className="relative w-full h-full p-4">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain drop-shadow-2xl" />
                        <div className="absolute bottom-2 right-2 bg-green-500/20 text-green-400 text-[10px] px-2 py-1 rounded-full border border-green-500/50 font-bold flex items-center gap-1"><Zap size={10} fill="currentColor" /> AI CUTOUT ACTIVE</div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500 group-hover:text-purple-400 transition-colors"><ImageIcon size={32} className="mb-3 opacity-50" /><p className="text-sm font-medium">Upload Product</p></div>
                    )}
                    <input type="file" className="hidden" onChange={handleImageUpload} disabled={processing} />
                  </label>
                </div>
                <div className="flex-1">
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">2. Scene Composition</h2>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {TEMPLATES.map((t) => (
                      <button key={t.id} onClick={() => setPrompt(t.prompt)} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 transition-all text-left group">
                        <div className={`w-8 h-8 rounded-md bg-gradient-to-br ${t.color} flex items-center justify-center text-white shadow-lg`}>{t.icon}</div>
                        <div><p className="text-xs font-bold text-gray-200">{t.label}</p></div>
                      </button>
                    ))}
                  </div>
                  <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe your scene..." className="w-full h-28 bg-white/[0.02] border border-white/10 rounded-xl p-4 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500/50 resize-none transition-all placeholder:text-gray-600" />
                </div>
                <button onClick={handleGenerate} disabled={loading || processing || !processedImage} className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="animate-spin" size={20} /> Designing Scene...</> : <><Wand2 size={20} /> Generate Asset</>}
                </button>
              </div>
              <div className="flex-1 bg-[#0a0a0a] relative p-8 flex items-center justify-center">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                {result ? (
                  <div className="relative w-full max-w-4xl group animate-in fade-in zoom-in duration-500">
                    <div className="relative rounded-xl border border-white/10 overflow-hidden shadow-2xl bg-black">
                      <ReactCompareSlider itemOne={<ReactCompareSliderImage src={originalUrl || ""} alt="Original" />} itemTwo={<ReactCompareSliderImage src={result.final_image} alt="Result" />} style={{ height: "70vh", objectFit: "contain", backgroundColor: "#000" }} />
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-50">
                        <a href={result.final_image} download className="px-5 py-2.5 bg-white text-black rounded-full font-bold text-sm flex items-center gap-2 hover:bg-gray-200 shadow-lg cursor-pointer transform hover:scale-105 transition-all"><Download size={16} /> Download {exportFormat}</a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-600"><Wand2 size={40} className="opacity-20 mx-auto mb-4" /><p className="text-sm font-medium">Select a template to begin.</p></div>
                )}
              </div>
            </div>
          )}

          {/* VIEW 2: HISTORY */}
          {activeTab === "history" && (
            <div className="p-8 h-full overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><History /> Your Creations</h2>
              {history.length === 0 ? (
                <div className="text-gray-500 mt-20 text-center">No images generated yet. Go to Studio!</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {history.map((item) => (
                    <div key={item.id} className="group relative rounded-xl overflow-hidden border border-white/10 bg-white/5">
                      <img src={item.image} alt="Generated" className="w-full h-64 object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                        <a href={item.image} download className="p-2 bg-white text-black rounded-full hover:scale-110 transition-transform"><Download size={20} /></a>
                        <button onClick={() => { setResult({final_image: item.image}); setOriginalUrl(item.original); setActiveTab("studio"); }} className="p-2 bg-purple-600 text-white rounded-full hover:scale-110 transition-transform"><Wand2 size={20} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW 3: SETTINGS (NEW) */}
          {activeTab === "settings" && (
            <div className="p-8 h-full overflow-y-auto max-w-3xl mx-auto w-full">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><Settings /> App Configuration</h2>
              
              <div className="space-y-8">
                {/* 1. Aspect Ratio */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Ratio size={20} className="text-purple-400" /> Default Aspect Ratio</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {["1:1", "16:9", "9:16"].map((ratio) => (
                      <button 
                        key={ratio} 
                        onClick={() => setAspectRatio(ratio)}
                        className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${aspectRatio === ratio ? 'bg-purple-600 border-purple-500 text-white' : 'bg-black/20 border-white/10 text-gray-400 hover:bg-white/5'}`}
                      >
                        <div className={`border-2 ${aspectRatio === ratio ? 'border-white' : 'border-gray-500'} rounded-sm ${ratio === "1:1" ? "w-8 h-8" : ratio === "16:9" ? "w-12 h-7" : "w-7 h-12"}`} />
                        <span className="font-bold">{ratio}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Output Format */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><FileType size={20} className="text-blue-400" /> Export Format</h3>
                  <div className="flex gap-4">
                    {["PNG", "JPG"].map((fmt) => (
                      <button 
                        key={fmt} 
                        onClick={() => setExportFormat(fmt)}
                        className={`px-6 py-3 rounded-xl border font-medium transition-all ${exportFormat === fmt ? 'bg-blue-600 border-blue-500 text-white' : 'bg-black/20 border-white/10 text-gray-400 hover:bg-white/5'}`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Pro Badge */}
                <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-2xl p-6 flex items-center justify-between">
                   <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2 text-purple-200"><Crown size={20} /> Pro Mode Active</h3>
                      <p className="text-sm text-gray-400 mt-1">High-fidelity 8K upscaling is enabled by default.</p>
                   </div>
                   <div className="px-4 py-1 bg-purple-500/20 border border-purple-500 text-purple-300 rounded-full text-xs font-bold uppercase">
                      Enabled
                   </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 p-3 rounded-xl transition-all w-full group ${active ? 'bg-white/10 text-white shadow-inner' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
      <span className={active ? "text-purple-400" : "group-hover:text-purple-300 transition-colors"}>{icon}</span>
      <span className="hidden lg:block font-medium text-sm">{label}</span>
    </button>
  );
}