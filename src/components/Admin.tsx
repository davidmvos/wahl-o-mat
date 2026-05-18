import React, { useState } from "react";
import { ElectionConfig, Question, Party, AnswerValue } from "../types";
import { Upload, Download, Trash2, CheckCircle2, AlertCircle, FileJson, Plus, Edit2, Save, X, Lock, Settings2, Users, HelpCircle } from "lucide-react";
import { cn } from "../lib/utils";

interface AdminProps {
  onAuthenticate: (password: string) => Promise<boolean>;
  onUpdate: (config: ElectionConfig, password: string) => Promise<void>;
  onCancel: () => void;
  currentConfig: ElectionConfig;
  onReset?: (password: string) => Promise<void>;
}

export default function Admin({ onAuthenticate, onUpdate, onCancel, currentConfig, onReset }: AdminProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [config, setConfig] = useState<ElectionConfig>(currentConfig);
  const [tab, setTab] = useState<"questions" | "parties" | "json">("questions");
  const [jsonInput, setJsonInput] = useState(JSON.stringify(currentConfig, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(false);
    setError(null);
    setIsAuthenticating(true);

    try {
      const isValid = await onAuthenticate(password);
      if (!isValid) {
        setAuthError(true);
        return;
      }

      setIsAuthenticated(true);
    } catch {
      setError("Server nicht erreichbar. Bitte erneut versuchen.");
      setAuthError(true);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (!parsed.questions || !parsed.parties) throw new Error("Formatfehler.");
        setConfig(parsed);
        setJsonInput(JSON.stringify(parsed, null, 2));
      } catch (err) {
        setError("JSON konnte nicht gelesen werden.");
      }
    };
    reader.readAsText(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      await onUpdate(config, password);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Konfiguration konnte nicht gespeichert werden.");
    } finally {
      setIsSaving(false);
    }
  };

  const addQuestion = () => {
    const newId = (config.questions.length + 1).toString();
    const newQuestion: Question = { id: newId, text: "Neue Frage...", category: "Allgemein" };
    setConfig({ ...config, questions: [...config.questions, newQuestion] });
  };

  const updateQuestion = (id: string, text: string) => {
    setConfig({
      ...config,
      questions: config.questions.map(q => q.id === id ? { ...q, text } : q)
    });
  };

  const deleteQuestion = (id: string) => {
    setConfig({
      ...config,
      questions: config.questions.filter(q => q.id !== id)
    });
  };

  const addParty = () => {
    const newId = "p" + (config.parties.length + 1);
    const newParty: Party = { id: newId, name: "Neue Partei", answers: {}, description: "" };
    setConfig({ ...config, parties: [...config.parties, newParty] });
  };

  const updateParty = (id: string, field: keyof Party, value: any) => {
    setConfig({
      ...config,
      parties: config.parties.map(p => p.id === id ? { ...p, [field]: value } : p)
    });
  };

  const setPartyAnswer = (partyId: string, questionId: string, value: AnswerValue) => {
    setConfig({
      ...config,
      parties: config.parties.map(p => 
        p.id === partyId ? { ...p, answers: { ...p.answers, [questionId]: value } } : p
      )
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-12 max-w-md w-full bg-white"
        >
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-red border-4 border-black flex items-center justify-center">
              <Lock className="text-white" size={32} />
            </div>
          </div>
          <h2 className="text-4xl font-black uppercase text-center mb-8">Admin Login</h2>
          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <p className="text-[10px] font-black uppercase mb-2 tracking-widest">Passwort</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-[6px] border-black p-4 focus:outline-none bg-light"
                autoFocus
              />
              {authError && <p className="text-red font-black uppercase text-xs mt-2 italic">Falsches Passwort!</p>}
              {error && <p className="text-red font-black uppercase text-xs mt-2 italic">{error}</p>}
            </div>
            <button type="submit" disabled={isAuthenticating} className="btn btn-primary w-full text-xl py-4 disabled:opacity-50">
              {isAuthenticating ? "PRUEFT..." : "LOGIN"}
            </button>
            <button type="button" onClick={onCancel} className="w-full text-[10px] font-black uppercase tracking-widest mt-4">
              Zurück zur Startseite
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
        <div>
          <h2 className="text-6xl font-black uppercase tracking-tighter mb-2">Einstellungen</h2>
          <div className="flex gap-4">
            <button 
              onClick={() => setTab("questions")} 
              className={cn("text-sm font-black uppercase tracking-widest pb-1 border-b-4 transition-all", tab === "questions" ? "border-red" : "border-transparent opacity-40 hover:opacity-100")}
            >
              Fragen
            </button>
            <button 
              onClick={() => setTab("parties")} 
              className={cn("text-sm font-black uppercase tracking-widest pb-1 border-b-4 transition-all", tab === "parties" ? "border-yellow" : "border-transparent opacity-40 hover:opacity-100")}
            >
              Parteien
            </button>
            <button 
              onClick={() => setTab("json")} 
              className={cn("text-sm font-black uppercase tracking-widest pb-1 border-b-4 transition-all", tab === "json" ? "border-blue" : "border-transparent opacity-40 hover:opacity-100")}
            >
              JSON / Sync
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          {success && <span className="text-green-600 font-black uppercase flex items-center gap-1"><CheckCircle2 size={16}/> Gespeichert!</span>}
          <button onClick={handleSave} disabled={isSaving} className="btn btn-primary flex items-center gap-2">
            <Save size={18} /> {isSaving ? "SPEICHERT..." : "KONFIGURATION SPEICHERN"}
          </button>
        </div>
      </div>

      {error && <p className="mb-6 text-red font-black uppercase text-xs tracking-widest">{error}</p>}

      <div className="grid grid-cols-1 gap-12">
        {tab === "questions" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center bg-black text-white p-4">
              <h3 className="font-black uppercase tracking-widest">Fragenkatalog ({config.questions.length})</h3>
              <button onClick={addQuestion} className="bg-white text-black px-4 py-1 font-black uppercase text-xs flex items-center gap-1 hover:bg-yellow">
                <Plus size={14} /> Neue Frage
              </button>
            </div>
            <div className="space-y-4">
              {config.questions.map((q, idx) => (
                <div key={q.id} className="card p-6 flex gap-6 items-start">
                  <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-xl shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-grow">
                    <input 
                      value={q.text}
                      onChange={(e) => updateQuestion(q.id, e.target.value)}
                      className="w-full text-xl font-bold border-b-2 border-black/10 focus:border-black focus:outline-none mb-2 py-1"
                    />
                    <div className="flex gap-4">
                      <select 
                        className="text-[10px] font-black uppercase tracking-widest bg-light px-2"
                        value={q.category || "Allgemein"}
                        onChange={(e) => setConfig({
                          ...config,
                          questions: config.questions.map(item => item.id === q.id ? { ...item, category: e.target.value } : item)
                        })}
                      >
                        <option>Allgemein</option>
                        <option>Wirtschaft</option>
                        <option>Umwelt</option>
                        <option>Bildung</option>
                        <option>Soziales</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={() => deleteQuestion(q.id)} className="text-red hover:bg-red hover:text-white p-2 transition-all">
                    <Trash2 size={24} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === "parties" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex justify-between items-center bg-black text-white p-4">
              <h3 className="font-black uppercase tracking-widest">Parteien ({config.parties.length})</h3>
              <button onClick={addParty} className="bg-white text-black px-4 py-1 font-black uppercase text-xs flex items-center gap-1 hover:bg-yellow">
                <Plus size={14} /> Neue Partei
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {config.parties.map(p => (
                <div key={p.id} className="card flex flex-col">
                  <div className="p-6 border-b-[4px] border-black flex justify-between items-center">
                    <input 
                      value={p.name}
                      onChange={(e) => updateParty(p.id, "name", e.target.value)}
                      className="text-2xl font-black uppercase bg-transparent focus:outline-none w-full"
                    />
                    <button onClick={() => setConfig({...config, parties: config.parties.filter(item => item.id !== p.id)})} className="text-red">
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex gap-4 items-center">
                      <div className="flex-grow">
                        <p className="text-[10px] font-black uppercase mb-2 opacity-40 italic">Partei-Farbe</p>
                        <div className="flex gap-2 items-center">
                          <input 
                            type="color"
                            value={p.color || "#000000"}
                            onChange={(e) => updateParty(p.id, "color", e.target.value)}
                            className="w-12 h-12 border-4 border-black cursor-pointer bg-white"
                          />
                          <input 
                            type="text"
                            value={p.color || "#000000"}
                            onChange={(e) => updateParty(p.id, "color", e.target.value)}
                            className="flex-grow border-b-2 border-black/10 focus:border-black focus:outline-none p-2 font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase mb-2 opacity-40 italic">Kurzbeschreibung</p>
                      <textarea 
                        value={p.description || ""}
                        onChange={(e) => updateParty(p.id, "description", e.target.value)}
                        className="w-full bg-light p-3 text-sm focus:outline-none min-h-[80px]"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase mb-4 border-b-2 border-black/10 pb-1">Antworten-Matrix</p>
                      <div className="space-y-3">
                        {config.questions.map(q => (
                          <div key={q.id} className="flex items-center justify-between gap-4">
                            <span className="text-[11px] font-bold leading-tight flex-grow line-clamp-1">{q.text}</span>
                            <div className="flex border-2 border-black bg-white overflow-hidden shrink-0">
                              <button 
                                onClick={() => setPartyAnswer(p.id, q.id, 1)}
                                className={cn("px-2 py-1 text-[10px] font-black border-r-2 border-black", p.answers[q.id] === 1 ? "bg-blue text-white" : "hover:bg-blue/10")}
                              >
                                JA
                              </button>
                              <button 
                                onClick={() => setPartyAnswer(p.id, q.id, 0)}
                                className={cn("px-2 py-1 text-[10px] font-black border-r-2 border-black", p.answers[q.id] === 0 ? "bg-yellow" : "hover:bg-yellow/10")}
                              >
                                —
                              </button>
                              <button 
                                onClick={() => setPartyAnswer(p.id, q.id, -1)}
                                className={cn("px-4 py-1 text-[10px] font-black", p.answers[q.id] === -1 ? "bg-red text-white" : "hover:bg-red/10")}
                              >
                                NEIN
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === "json" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="card p-6 border-black">
                <h3 className="font-black uppercase mb-4 flex items-center gap-2">
                  <FileJson size={20} /> Datensatz
                </h3>
                <p className="text-[10px] font-black uppercase mb-4 opacity-60 leading-tight">
                  Importieren oder exportieren Sie die gesamte Konfiguration.
                </p>
                <div className="relative mb-4">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="border-4 border-dashed border-black p-8 bg-light flex flex-col items-center justify-center gap-4 group hover:bg-white transition-colors">
                    <div className="w-10 h-10 border-4 border-black flex items-center justify-center text-3xl font-black">+</div>
                    <span className="text-[10px] font-black uppercase text-center tracking-widest leading-none">JSON Upload</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
                    const dl = document.createElement('a'); dl.href = dataStr; dl.download = "wahlomat_export.json"; dl.click();
                  }}
                  className="btn w-full flex items-center justify-center gap-2 mb-4"
                >
                  <Download size={18} /> EXPORT JSON
                </button>
                {onReset && (
                  <button 
                    onClick={async () => {
                      if (window.confirm("Sind Sie sicher, dass Sie den Wahl-O-Mat auf die Standardkonfiguration zurücksetzen möchten? Dadurch gehen alle Änderungen verloren.")) {
                        setError(null);
                        setIsResetting(true);
                        try {
                          await onReset(password);
                        } catch (e) {
                          setError(e instanceof Error ? e.message : "Zurücksetzen fehlgeschlagen.");
                        } finally {
                          setIsResetting(false);
                        }
                      }
                    }}
                    disabled={isResetting}
                    className="btn btn-primary w-full flex items-center justify-center gap-2 bg-red"
                  >
                    <Trash2 size={18} /> {isResetting ? "SETZT ZURUECK..." : "STANDARD WIEDERHERSTELLEN"}
                  </button>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="card p-6 flex flex-col min-h-[500px]">
                <p className="text-[10px] font-black uppercase mb-4 tracking-widest">Rohdaten Editor</p>
                <textarea
                  value={jsonInput}
                  onChange={(e) => {
                    setJsonInput(e.target.value);
                    try {
                      const p = JSON.parse(e.target.value);
                      if (p.questions && p.parties) setConfig(p);
                    } catch(e) {}
                  }}
                  className="flex-1 w-full bg-black text-white p-4 font-mono text-[10px] border-4 border-black focus:outline-none min-h-[400px] resize-none"
                  spellCheck={false}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

import { motion } from "motion/react";
