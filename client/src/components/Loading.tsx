import { Loader } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center gap-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700"></div>
      <p className="text-lg font-medium text-primary-700 animate-pulse">
        Loading<span className="tracking-wider">...</span>
      </p>
    </div>
  );
};

export default Loading;
