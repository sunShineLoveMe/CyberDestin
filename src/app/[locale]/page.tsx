"use client";

import { useTranslations, useLocale } from "next-intl";
import { LanguageSwitch, ReadingResult } from "@/components/UI";
import { Scene as Deck3D } from "@/components/Deck3D";
import { useGameStore } from "@/store/useGameStore";
import { useDailyLimit } from "@/hooks/useDailyLimit";
import { tarotData } from "@/data/tarot_data";

export default function Home() {
  const t = useTranslations("Index");
  const locale = useLocale();
  const { phase, setPhase, selectedCardId, setSelectedCardId, resetGame } = useGameStore();
  const { readingsLeft, isBlocked, incrementReading } = useDailyLimit();

  const handleRevealDestiny = () => {
    if (isBlocked) return;
    setPhase("shuffling");
  };

  const handleShuffleComplete = () => {
    setPhase("selecting");
    // Auto-select after a brief moment of "fan" state
    setTimeout(() => {
      const randomCard = tarotData[Math.floor(Math.random() * tarotData.length)];
      setSelectedCardId(randomCard.id);
      setPhase("revealed");
      incrementReading();
    }, 500);
  };

  const handleCloseResult = () => {
    resetGame();
  };

  const selectedCard = selectedCardId !== null ? tarotData.find(c => c.id === selectedCardId) : null;
  const cardLocale = selectedCard?.locales[locale as keyof typeof selectedCard.locales];

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <LanguageSwitch />
      
      <div className="z-10 text-center mb-8 pointer-events-none">
        <h1 className="font-orbitron text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-hot-pink drop-shadow-[0_0_15px_rgba(123,44,191,0.5)] mb-4">
          {t("title")}
        </h1>
        <p className="font-rajdhani text-xl md:text-2xl text-cyan-tech tracking-widest uppercase">
          {t("description")}
        </p>
        <p className="font-inter text-sm text-gray-400 mt-2">
          Readings left today: {readingsLeft}
        </p>
      </div>

      <div className="w-full h-[60vh] z-0">
        <Deck3D onShuffleComplete={handleShuffleComplete} />
      </div>

      <div className="z-10 mt-8">
        <button 
          onClick={handleRevealDestiny}
          disabled={isBlocked || phase !== "idle"}
          className={`px-8 py-4 bg-hot-pink text-white font-bold font-orbitron text-xl uppercase tracking-widest rounded-full transition-all shadow-[0_0_20px_#f72585] 
            ${isBlocked || phase !== "idle" ? "opacity-50 cursor-not-allowed" : "hover:bg-hot-pink/80 hover:scale-105 active:scale-95"}`}
        >
          {isBlocked ? "Limit Reached" : phase === "idle" ? "Reveal Destiny" : "Destiny Unfolding..."}
        </button>
      </div>

      {phase === "revealed" && cardLocale && (
        <ReadingResult 
          cardName={cardLocale.name}
          keywords={cardLocale.keywords}
          meaning={cardLocale.meaning_love}
          onClose={handleCloseResult}
        />
      )}
    </main>
  );
}
