"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Import app components (to be created)
import FilesApp from "../apps/FilesApp";
import TerminalApp from "../apps/TerminalApp";
import EditorApp from "../apps/EditorApp";
import GalleryApp from "../apps/GalleryApp";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const apps = [
  { name: "Files", icon: "📁", component: FilesApp },
  { name: "Terminal", icon: "🖥️", component: TerminalApp },
  { name: "Editor", icon: "📝", component: EditorApp },
  { name: "Gallery", icon: "🖼️", component: GalleryApp },
];

export default function Desktop() {
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        window.location.href = "/";
      }
    });
  }, []);

  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [showStart, setShowStart] = useState(false);

  function openApp(appName: string) {
    if (!openWindows.includes(appName)) {
      setOpenWindows([...openWindows, appName]);
    }
    setShowStart(false);
  }

  function closeApp(appName: string) {
    setOpenWindows(openWindows.filter(name => name !== appName));
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      {/* Desktop Icons */}
      <div className="absolute left-8 top-20 flex flex-col gap-6">
        {apps.map(app => (
          <button
            key={app.name}
            className="flex flex-col items-center group"
            onClick={() => openApp(app.name)}
          >
            <span className="text-4xl">{app.icon}</span>
            <span className="text-white text-xs mt-1 group-hover:underline">{app.name}</span>
          </button>
        ))}
      </div>
      
      {/* Taskbar/Dock */}
      <div className="fixed bottom-0 left-0 w-full flex justify-center items-center bg-black/40 backdrop-blur-lg py-3">
        {/* Windows Start Button */}
        <div className="relative flex items-center">
          <button
            className="mx-3 px-4 py-2 rounded-xl bg-white/10 hover:bg-blue-700 text-white text-lg shadow-lg flex items-center justify-center"
            title="Start"
            onClick={() => setShowStart(!showStart)}
          >
            {/* Windows logo SVG */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="9" height="9" fill="#2563eb" />
              <rect x="13" y="2" width="9" height="9" fill="#2563eb" />
              <rect x="2" y="13" width="9" height="9" fill="#2563eb" />
              <rect x="13" y="13" width="9" height="9" fill="#2563eb" />
            </svg>
          </button>
          {showStart && (
            <div
              className="fixed inset-0 z-50"
              onClick={() => setShowStart(false)}
            >
              <div
                className="absolute left-1/2 bottom-24 transform -translate-x-1/2 bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-4 min-w-[320px] max-w-[90vw] border border-blue-200"
                onClick={e => e.stopPropagation()}
              >
                <div className="font-bold text-2xl mb-4 text-blue-700 text-center">All Apps</div>
                <div className="grid grid-cols-2 gap-3">
                  {apps.map(app => (
                    <button
                      key={app.name}
                      className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-blue-100 text-gray-900 font-semibold transition"
                      onClick={() => openApp(app.name)}
                    >
                      <span className="text-2xl">{app.icon}</span>
                      <span>{app.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {apps.map(app => (
          <button
            key={app.name}
            className={`mx-3 px-4 py-2 rounded-xl ${openWindows.includes(app.name) ? "bg-blue-600" : "bg-white/10"} hover:bg-blue-700 text-white text-lg shadow-lg`}
            onClick={() => openApp(app.name)}
          >
            {app.icon}
          </button>
        ))}
      </div>

      {/* Windows */}
      {openWindows.map(appName => {
        const app = apps.find(a => a.name === appName);
        if (!app) return null;
        const AppComponent = app.component;
        return (
          <div key={appName} className="fixed top-32 left-1/3 z-10 bg-white rounded-2xl shadow-2xl p-8 min-w-[320px] max-w-md">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{appName}</h2>
              <button
                className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded"
                onClick={() => closeApp(appName)}
              >
                ✕
              </button>
            </div>
            <AppComponent />
          </div>
        );
      })}
    </div>
  );
}