import { create } from "zustand";

type GamePhase = "idle" | "shuffling" | "selecting" | "revealed";

interface GameState {
  phase: GamePhase;
  selectedCardId: number | null;
  setPhase: (phase: GamePhase) => void;
  setSelectedCardId: (id: number | null) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  phase: "idle",
  selectedCardId: null,
  setPhase: (phase) => set({ phase }),
  setSelectedCardId: (id) => set({ selectedCardId: id }),
  resetGame: () => set({ phase: "idle", selectedCardId: null }),
}));
