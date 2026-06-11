import React from "react";
import { useLoadingStore } from "@/stores/useLoadingStore";

export const TopLoadingBar: React.FC = () => {
  const { activeRequests } = useLoadingStore();

  if (activeRequests === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 w-full overflow-hidden bg-blue-100">
      <div className="h-full bg-[#0f79f3] animate-[loading_1.5s_ease-in-out_infinite]" />
    </div>
  );
};
