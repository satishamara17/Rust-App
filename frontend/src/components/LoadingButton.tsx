import React from "react";
import { twMerge } from "tailwind-merge";
import Spinner from "./Spinner";

type LoadingButtonProps = {
  loading: boolean;
  btnColor?: string;
  textColor?: string;
  children: React.ReactNode;
};

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  textColor = "text-white",
  children,
  loading = false,
}) => {
  return (
    <button
      type="submit"
      className={twMerge(
        `w-full py-3.5 font-semibold rounded-xl outline-none border-none flex justify-center items-center transition-all duration-300 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]`,
        `${loading && "opacity-60 cursor-not-allowed"}`
      )}
      style={{
        background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
        boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)',
      }}
      disabled={loading}
    >
      {loading ? (
        <div className="flex items-center gap-3">
          <Spinner />
          <span className="text-white inline-block text-sm">Loading...</span>
        </div>
      ) : (
        <span className={`text-base font-semibold ${textColor}`}>{children}</span>
      )}
    </button>
  );
};
