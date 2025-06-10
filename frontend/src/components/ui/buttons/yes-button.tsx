"use client";

interface YesButtonProps {
  setGejala: () => void;
  gejala: boolean | null;
}

export const YesButton = ({ setGejala, gejala }: YesButtonProps) => {
  return (
    <button
      onClick={setGejala}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
        gejala === true
          ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
          : "bg-green-500/20 text-green-600 hover:bg-green-500/30"
      }`}
    >
      Ya
    </button>
  );
}; 