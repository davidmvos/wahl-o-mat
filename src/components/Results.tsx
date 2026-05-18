import React from "react";
import { ElectionConfig, Party, Result, UserAnswer } from "../types";
import { motion } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { RefreshCw, Share2, Info } from "lucide-react";

interface ResultsProps {
  results: Result[];
  onRestart: () => void;
  userAnswers: any;
  config: ElectionConfig;
}

export default function Results({ results, onRestart, userAnswers, config }: ResultsProps) {
  const topResult = results[0];
  const chartData = results.map(r => ({
    name: r.partyName,
    val: r.score,
    color: r.color || "#000000",
    description: r.description
  }));

  function getQuestionByIndex(idx: any): any {
    return config.questions.find((value) => value.id == idx.toString());
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="card p-4 bg-white border-[4px] border-black max-w-xs shadow-none">
          <p className="font-black uppercase mb-1 text-lg">{data.name}</p>
          <p className="font-black text-2xl mb-2 text-red">{data.val}%</p>
          <p className="text-[10px] font-bold uppercase leading-tight opacity-70">
            {data.description || "Keine Beschreibung verfügbar."}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-24">
      <div className="text-center">
        <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4">
          Ihr Ergebnis
        </h2>
        <div className="h-4 bg-black w-32 mx-auto mb-4" />
        <p className="text-xl text-black font-black uppercase tracking-[0.2em] opacity-40">
          Analyse abgeschlossen
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Match Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-12 bg-red text-white flex flex-col items-center justify-center text-center col-span-1 relative overflow-hidden"
          style = {{backgroundColor: topResult.color}}
        >
          <span className="font-black uppercase tracking-widest text-[10px] mb-8 border-2 border-white px-3 py-1 z-10">Top Match</span>
          <div className="text-9xl font-black leading-none mb-6 z-10">
            {topResult.score}%
          </div>
          <h3 className="text-4xl font-black uppercase mb-4 z-10">{topResult.partyName}</h3>
          <p className="text-sm font-bold uppercase tracking-wider opacity-80 z-10">Größte Übereinstimmung</p>
        </motion.div>

        {/* Chart Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-8 col-span-1 lg:col-span-2 min-h-[450px]"
        >
          <h4 className="font-black uppercase mb-8 border-b-8 border-yellow pb-2 inline-block">
            Schnittmenge der Parteien
          </h4>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="0 0" horizontal={false} stroke="#00000010" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontWeight: "900", fill: "#000000", fontSize: 12 }}
                  axisLine={{ strokeWidth: 6, stroke: "#000000" }}
                  width={100}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#00000005' }} />
                
                {/* Visual indicator for the top score level */}
                <ReferenceLine x={topResult.score} stroke="#D2232A" strokeWidth={4} strokeDasharray="8 8" label={{ position: 'top', value: 'TOP MATCH', fill: '#D2232A', fontSize: 10, fontWeight: '900' }} />

                <Bar dataKey="val" barSize={30}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      stroke="#000000" 
                      strokeWidth={4} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase opacity-40">
            <div className="w-4 h-4 border-2 border-dashed border-red" />
            <span>Abstand zum Top-Ergebnis</span>
          </div>
        </motion.div>
      </div>

      {/* Party Context Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue flex items-center justify-center border-4 border-black text-white">
            <Info size={24} />
          </div>
          <h3 className="text-3xl font-black uppercase">Die Parteien im Detail</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((r, idx) => (
            <div key={r.partyId} className="card p-6 flex flex-col border-black hover:bg-white transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-8 h-8 border-[3px] border-black" 
                  style={{ backgroundColor: r.color || "#000" }}
                />
                <span className="font-black uppercase text-xl">{r.partyName}</span>
                <span className="ml-auto font-black italic text-lg opacity-40 opacity-100 bg-yellow px-2 border-2 border-black">#{idx + 1}</span>
              </div>
              <p className="text-sm font-bold uppercase leading-[1.4] opacity-70 mb-4 flex-grow">
                {r.description || "Keine nähere Beschreibung hinterlegt."}
              </p>
              <div className="mt-auto h-2 bg-black/5 overflow-hidden border-2 border-black">
                <div 
                  className="h-full" 
                  style={{ width: `${r.score}%`, backgroundColor: r.color || "#000" }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Answer Detail Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue flex items-center justify-center border-4 border-black text-white">
            <Info size={24} />
          </div>
          <h3 className="text-3xl font-black uppercase">Ihre Antworten im Vergleich</h3>
        </div>
        
        <div>
          {Object.entries(
            userAnswers as Record<string, { value: string | number; isWeighted?: boolean }>
          ).map(([questionId, answer]) => {
            const q: any = getQuestionByIndex(questionId);

            let a;

            return (
              <div key={questionId} className="card p-4 border-2 border-black mb-3">
                <h4 className="font-black uppercase">{q?.text ?? `Frage ${questionId}`}</h4>
                <p className="text-sm font-bold">
                  Antwort: {String(answer.value)} {answer.isWeighted ? "(gewichtet)" : ""}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center py-12">
        <button
          onClick={onRestart}
          className="btn btn-primary flex items-center gap-4 text-2xl px-12"
        >
          <RefreshCw /> NEU STARTEN
        </button>
        <button
          onClick={() => window.print()}
          className="btn flex items-center gap-4 text-xl"
        >
          <Share2 /> DRUCKEN
        </button>
      </div>

      <div className="p-12 border-t-[6px] border-black text-center">
        <p className="text-[11px] font-black uppercase italic max-w-2xl mx-auto opacity-30 leading-loose">
          Disclaimer: Dieser Wahl-O-Mat ist ein Bildungsinstrument und stellt keine offizielle Wahlempfehlung dar. 
          Ihre Daten werden vertraulich im lokalen Speicher Ihres Browsers verarbeitet.
        </p>
      </div>
    </div>
  );
}
