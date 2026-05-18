import React, { useState } from "react";
import { Question } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ChevronLeft, Check, ThumbsUp, ThumbsDown, HelpCircle, Star } from "lucide-react";
import { cn } from "../lib/utils";

interface QuizProps {
  questions: Question[];
  onFinish: (answers: Record<string, { value: number; isWeighted: boolean }>) => void;
  onCancel: () => void;
}

export default function Quiz({ questions, onFinish, onCancel }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { value: number; isWeighted: boolean }>>({});

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    const isWeighted = answers[currentQuestion.id]?.isWeighted || false;
    setAnswers({
      ...answers,
      [currentQuestion.id]: { value, isWeighted }
    });
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const toggleWeight = () => {
    const current = answers[currentQuestion.id];
    setAnswers({
      ...answers,
      [currentQuestion.id]: {
        value: current?.value ?? 0,
        isWeighted: !current?.isWeighted
      }
    });
  };

  const handleFinish = () => {
    onFinish(answers);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-2">
          <span className="font-black text-4xl uppercase italic">{currentIndex + 1} / {questions.length}</span>
          <span className="font-bold text-black/40 uppercase tracking-widest">Fortschritt</span>
        </div>
        <div className="h-4 border-2 border-black bg-white overflow-hidden">
          <motion.div 
            className="h-full bg-yellow"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col justify-between min-h-[500px]"
        >
          <div className="mb-12">
            <div className="inline-block bg-black text-white px-4 py-1 mb-6 text-sm font-bold uppercase tracking-widest">
              Themenbereich: {currentQuestion.category || "Allgemein"}
            </div>
            <h2 className="text-4xl md:text-6xl font-black leading-[1.1] max-w-2xl">
              {currentQuestion.text}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 border-[6px] border-black bg-black gap-[6px]">
            <AnswerButton 
              active={answers[currentQuestion.id]?.value === 1}
              onClick={() => handleAnswer(1)}
              label="JA"
              subLabel="STIMME ZU"
              activeClass="bg-blue text-white"
              inactiveClass="bg-white hover:bg-blue/90"
            />
            <AnswerButton 
              active={answers[currentQuestion.id]?.value === 0}
              onClick={() => handleAnswer(0)}
              label="—"
              subLabel="NEUTRAL"
              activeClass="bg-yellow text-black"
              inactiveClass="bg-white hover:bg-yellow/90"
            />
            <AnswerButton 
              active={answers[currentQuestion.id]?.value === -1}
              onClick={() => handleAnswer(-1)}
              label="NEIN"
              subLabel="LEHNE AB"
              activeClass="bg-red text-white"
              inactiveClass="bg-white hover:bg-red/90"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 flex justify-between items-center">
        <button
          onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
          className={cn(
            "btn flex items-center gap-2",
            currentIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-black hover:text-white"
          )}
        >
          <ChevronLeft /> ZURÜCK
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={handleFinish}
            className="btn btn-secondary flex items-center gap-2 text-xl"
          >
            ERGEBNIS ANZEIGEN <Check strokeWidth={3} />
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex(currentIndex + 1)}
            className="btn flex items-center gap-2 hover:bg-black hover:text-white"
          >
            NÄCHSTE FRAGE <ChevronRight />
          </button>
        )}
      </div>
    </div>
  );
}

interface AnswerButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  subLabel: string;
  activeClass: string;
  inactiveClass: string;
}

function AnswerButton({ active, onClick, label, subLabel, activeClass, inactiveClass }: AnswerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center h-40 font-black uppercase transition-all group",
        active ? activeClass : inactiveClass
      )}
    >
      <span className="text-5xl mb-2">{label}</span>
      <span className="text-[10px] font-bold tracking-[0.2em] opacity-60 group-hover:opacity-100">{subLabel}</span>
    </button>
  );
}
