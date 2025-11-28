"use client";

import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { LanguageSwitch } from "@/components/UI";
import { getLoveReading, ReadingResult, DrawnCard } from "@/components/Deck3D/AIReader";

// Dynamic import for CSS3D component to avoid SSR issues
const TarotShuffle = dynamic(() => import("@/components/Deck3D/TarotShuffle"), {
  ssr: false,
});

type GamePhase =
  | "idle"
  | "shuffling"
  | "sphere"
  | "selecting"
  | "reading"
  | "result";

export default function Home() {
  const [reading, setReading] = useState<ReadingResult | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [gamePhase, setGamePhase] = useState<GamePhase>("idle");

  const handleReveal = () => {
    setGamePhase("shuffling");
    // Trigger the shuffle animation via custom event
    window.dispatchEvent(new Event('trigger-shuffle'));
  };

  const handleDraw = useCallback(async (drawnCards: DrawnCard[]) => {
    setIsReading(true);
    try {
      const result = await getLoveReading(drawnCards);
      setReading(result);
    } catch (error) {
      console.error("Failed to get reading:", error);
    } finally {
      setIsReading(false);
      setGamePhase("result");
    }
  }, []);

  const handlePhaseChange = useCallback((phase: GamePhase) => {
    setGamePhase(phase);
  }, []);

  const showSlots = useMemo(
    () => ["selecting", "reading", "result"].includes(gamePhase),
    [gamePhase]
  );

  const showButton = useMemo(
    () => ["idle", "result"].includes(gamePhase),
    [gamePhase]
  );

  return (
    <main className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center">
      {/* Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/UI/bg_magic.png)' }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-center">
        <h1 className="text-3xl font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-cyan-tech drop-shadow-[0_0_10px_rgba(76,201,240,0.5)]">
          CYBER DESTIN
        </h1>
        <LanguageSwitch />
      </header>

      {/* 3D Scene Container */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="w-full h-full pointer-events-auto">
          <TarotShuffle
            onDraw={handleDraw}
            cardImage="/UI/card_back.png"
            particleColor="#82eaff"
            onPhaseChange={handlePhaseChange}
          />
        </div>
      </div>

      {/* Card Slots (Visual Guide) */}
      {showSlots && (
        <div className="fixed bottom-20 left-0 right-0 z-30 flex justify-center gap-8">
          {[0, 1, 2].map((slot) => (
            <div
              key={slot}
              className="w-[200px] h-[340px] rounded-xl border-2 border-dashed border-cyan-tech/30 bg-black/20 flex items-center justify-center"
            >
              <span className="text-cyan-tech/50 text-sm">
                {slot === 0 ? '过去' : slot === 1 ? '现在' : '未来'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* UI Controls */}
      <div className="relative z-50 flex flex-col items-center mt-[40vh]">
        {showButton && (
          <button
            onClick={handleReveal}
            className="group relative px-8 py-4 bg-black/50 border border-cyan-tech rounded-full overflow-hidden transition-all hover:scale-105 hover:border-hot-pink hover:shadow-[0_0_30px_rgba(247,37,133,0.5)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-tech/20 to-neon-purple/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative font-rajdhani font-bold text-xl tracking-widest text-white group-hover:text-cyan-tech transition-colors">
              REVEAL YOUR LOVE DESTINY
            </span>
          </button>
        )}

        {/* Reading Result Display */}
        {reading && (
          <div className="mt-12 w-full max-w-4xl p-8 glass-panel rounded-2xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <h2 className="text-3xl font-orbitron text-center mb-8 text-hot-pink">
              Love Insight
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-black/40 rounded-lg border border-white/10">
                <h3 className="text-cyan-tech font-bold mb-2">Past</h3>
                <p className="text-lg font-rajdhani mb-2">{reading.past.name} {reading.past.upright ? "" : "(Reversed)"}</p>
                <p className="text-sm text-gray-300">{reading.past.love_meaning}</p>
              </div>
              <div className="p-4 bg-black/40 rounded-lg border border-white/10">
                <h3 className="text-cyan-tech font-bold mb-2">Present</h3>
                <p className="text-lg font-rajdhani mb-2">{reading.present.name} {reading.present.upright ? "" : "(Reversed)"}</p>
                <p className="text-sm text-gray-300">{reading.present.love_meaning}</p>
              </div>
              <div className="p-4 bg-black/40 rounded-lg border border-white/10">
                <h3 className="text-cyan-tech font-bold mb-2">Future</h3>
                <p className="text-lg font-rajdhani mb-2">{reading.future.name} {reading.future.upright ? "" : "(Reversed)"}</p>
                <p className="text-sm text-gray-300">{reading.future.love_meaning}</p>
              </div>
            </div>

            <div className="space-y-4 text-center">
              <div>
                <h3 className="text-xl font-bold text-neon-purple mb-2">Summary</h3>
                <p className="text-gray-200 leading-relaxed">{reading.summary}</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-neon-purple mb-2">Advice</h3>
                <p className="text-gray-200 leading-relaxed">{reading.advice}</p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <button 
                onClick={() => window.location.reload()}
                className="text-sm text-white/50 hover:text-white underline"
              >
                Start New Reading
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
