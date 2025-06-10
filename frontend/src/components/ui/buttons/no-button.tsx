"use client";

interface NoButtonProps {
  setGejala: () => void;
  gejala: boolean | null;
}

export const NoButton = ({ setGejala, gejala }: NoButtonProps) => {
  return (
    <button
      onClick={setGejala}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
        gejala === false
          ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
          : "bg-red-500/20 text-red-600 hover:bg-red-500/30"
      }`}
    >
      Tidak
    </button>
  );
}; 