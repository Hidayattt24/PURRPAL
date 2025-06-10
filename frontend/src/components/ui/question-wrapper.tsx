"use client";

import { YesButton } from "./buttons/yes-button";
import { NoButton } from "./buttons/no-button";
import { RefreshIcon } from "./icons/refresh-icon";
import { IconCheck } from "@tabler/icons-react";

interface QuestionWrapperProps {
  question: string;
  gejala: boolean | null;
  setToYes: () => void;
  setToNo: () => void;
  setToNull: () => void;
}

export const QuestionWrapper = (props: QuestionWrapperProps) => {
  return (
    <div className="w-full py-4 bg-white rounded-xl shadow-lg shadow-black/5 flex items-center justify-between gap-3 px-4 relative border border-neutral-200 hover:border-neutral-300 transition-colors">
      {props.gejala != null && (
        <div className="bg-green-500 rounded-full absolute -right-2 -top-2 p-0.5 shadow-lg shadow-green-500/30 border-2 border-white">
          <IconCheck className="w-4 h-4 text-white" />
        </div>
      )}
      <p className="text-neutral-700 text-sm leading-relaxed">{props.question}</p>
      <div className="flex gap-2.5 min-w-[140px] justify-end">
        {(props.gejala === null || props.gejala === true) && (
          <YesButton setGejala={props.setToYes} gejala={props.gejala} />
        )}
        {(props.gejala === null || props.gejala === false) && (
          <NoButton setGejala={props.setToNo} gejala={props.gejala} />
        )}
        {props.gejala !== null && (
          <button
            onClick={props.setToNull}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-600 transition-colors"
          >
            <RefreshIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}; 