import React, { useState, useEffect } from "react";
import { ElectionConfig, Result } from "./types";
import { DEFAULT_CONFIG } from "./constants";
import Admin from "./components/Admin";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import { Layout } from "./components/Layout";
import { motion, AnimatePresence } from "motion/react";
import { calculateResults } from "./lib/utils";

async function readApiError(response: Response, fallback: string): Promise<string> {
  try {
    const data = await response.json();
    if (data && typeof data.error === "string") {
      return data.error;
    }
  } catch {
    // Ignore JSON parse errors and use fallback.
  }

  return fallback;
}

export default function App() {
  const [config, setConfig] = useState<ElectionConfig>(DEFAULT_CONFIG);
  const [view, setView] = useState<"start" | "quiz" | "results" | "admin">("start");
  const [userAnswers, setUserAnswers] = useState<Record<string, { value: number; isWeighted: boolean }>>({});
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from API
  useEffect(() => {
    fetch("/api/config")
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setIsLoading(false);
      })
      .catch(e => {
        console.error("Failed to load config", e);
        setIsLoading(false);
      });
  }, []);

  const handleStartQuiz = () => {
    setUserAnswers({});
    setView("quiz");
  };

  const handleFinishQuiz = (answers: Record<string, { value: number; isWeighted: boolean }>) => {
    setUserAnswers(answers);
    const calculated = calculateResults(answers, config.parties, config.questions);
    setResults(calculated);
    setView("results");
  };

  const handleAdminAuthenticate = async (password: string) => {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    return response.ok;
  };

  const handleUpdateConfig = async (newConfig: ElectionConfig, password: string) => {
    const response = await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, config: newConfig })
    });

    if (!response.ok) {
      throw new Error(await readApiError(response, "Failed to save config"));
    }

    setConfig(newConfig);
    setView("start");
  };

  const handleResetConfig = async (password: string) => {
    const response = await fetch("/api/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      throw new Error(await readApiError(response, "Failed to reset config"));
    }

    const data = await response.json();
    setConfig(data);
    setView("start");
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen text-2xl font-black uppercase">Lade Konfiguration...</div>;
  }

  return (
    <Layout currentView={view} onViewChange={setView}>
      <AnimatePresence mode="wait">
        {view === "start" && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
          >
            <div className="relative mb-8 bg-white p-12 border-[8px] border-black">
              <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none mb-4">
                Wahl-O-Mat
              </h1>
              <div className="h-6 bg-red w-full mb-6" />
              <p className="text-xl md:text-2xl font-black uppercase text-black/70 max-w-2xl" style={{textAlign: "left"}}>
                {config.electionName}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  onClick={handleStartQuiz}
                  className="btn btn-primary text-3xl px-12"
                >
                  START
                </button>
                {/*<button
                  onClick={() => setView("admin")}
                  className="btn bg-yellow text-2xl"
                >
                  ADMIN
                </button>*/}
              </div>
            </div>
          </motion.div>
        )}

        {view === "quiz" && (
          <Quiz
            questions={config.questions}
            onFinish={handleFinishQuiz}
            onCancel={() => setView("start")}
          />
        )}

        {view === "results" && (
          <Results
            results={results}
            onRestart={() => setView("start")}
            userAnswers={userAnswers}
            config={config}
          />
        )}

        {view === "admin" && (
          <Admin
            onAuthenticate={handleAdminAuthenticate}
            onUpdate={handleUpdateConfig}
            onCancel={() => setView("start")}
            currentConfig={config}
            onReset={handleResetConfig}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}
