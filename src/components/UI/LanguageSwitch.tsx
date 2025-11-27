"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Globe } from "lucide-react";

export default function LanguageSwitch() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-2 glass-panel p-2 rounded-full">
      <Globe className="w-4 h-4 text-cyan-tech" />
      <div className="flex gap-2 text-sm font-rajdhani">
        {["ro", "en", "zh"].map((l) => (
          <button
            key={l}
            onClick={() => handleLocaleChange(l)}
            className={`px-2 py-1 rounded-full transition-all ${
              locale === l
                ? "bg-neon-purple text-white shadow-[0_0_10px_#7b2cbf]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
