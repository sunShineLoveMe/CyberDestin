"use client";

interface ReadingResultProps {
  cardName: string;
  keywords: string[];
  meaning: string;
  onClose: () => void;
}

export default function ReadingResult({ cardName, keywords, meaning, onClose }: ReadingResultProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="glass-panel max-w-md w-full p-6 rounded-xl border border-neon-purple shadow-[0_0_20px_rgba(123,44,191,0.3)]">
        <h2 className="text-3xl font-orbitron text-neon-purple mb-4 text-center">{cardName}</h2>
        
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {keywords.map((keyword, i) => (
            <span key={i} className="px-3 py-1 bg-cyan-tech/10 border border-cyan-tech/30 rounded-full text-cyan-tech text-xs font-rajdhani uppercase tracking-wider">
              {keyword}
            </span>
          ))}
        </div>
        
        <p className="text-gray-200 font-inter leading-relaxed mb-8 text-center">
          {meaning}
        </p>
        
        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-transparent border border-hot-pink text-hot-pink hover:bg-hot-pink/10 font-bold font-rajdhani uppercase tracking-widest rounded-lg transition-all"
          >
            Close
          </button>
          <button 
            onClick={() => {
              const text = `My CyberDestin Card: ${cardName}\n${meaning}\n\nDiscover yours at CyberDestin RO`;
              navigator.clipboard.writeText(text);
              alert("Result copied to clipboard!");
            }}
            className="flex-1 py-3 bg-hot-pink hover:bg-hot-pink/80 text-white font-bold font-rajdhani uppercase tracking-widest rounded-lg transition-all shadow-[0_0_15px_#f72585]"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
