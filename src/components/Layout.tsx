import React from "react";
import { LayoutPanelLeft, Settings, Info, Home } from "lucide-react";
import { cn } from "../lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: any) => void;
}

export function Layout({ children, currentView, onViewChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-light flex flex-col font-sans selection:bg-yellow border-[12px] border-black">
      <header className="flex border-b-[6px] border-black h-24 bg-white shrink-0">
        <div className="flex-none w-24 bg-red flex items-center justify-center border-r-[6px] border-black">
          <div className="w-10 h-10 bg-white rounded-full"></div>
        </div>
        <div className="flex-grow flex items-center px-8 cursor-pointer" onClick={() => onViewChange("start")}>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
            Wahl-O-Mat <span className="text-blue">v1</span>
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center px-4 border-l-[6px] border-black gap-2">
          <NavButton 
            active={currentView === "start"} 
            onClick={() => onViewChange("start")}
            icon={<Home size={20} />}
            label="Home"
          />
          <NavButton 
            active={currentView === "admin"} 
            onClick={() => onViewChange("admin")}
            icon={<Settings size={20} />}
            label="Admin"
          />
        </nav>

      </header>

      <div className="flex-grow flex overflow-hidden">
        <main className="flex-grow p-6 md:p-12 overflow-y-auto">
          {children}
        </main>
      </div>

      <footer className="h-16 bg-black text-white flex items-center justify-between px-8 border-t-[6px] border-black shrink-0 font-bold uppercase tracking-widest text-[11px]">
        <div className="flex gap-8">
          <span className="cursor-pointer hover:text-yellow transition-colors">Datenschutz</span>
          <span className="cursor-pointer hover:text-yellow transition-colors">Impressum</span>
        </div>
        <div className="flex items-center gap-4 text-white/40">
          &copy; David Vos 2026 | Wahl-o-mat v1
        </div>
      </footer>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 font-black uppercase transition-all border-[3px] border-transparent",
        active ? "bg-black text-white" : "hover:border-black"
      )}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}
