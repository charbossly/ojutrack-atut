import React from "react";
import { useNavigate } from "react-router-dom";
export default function BackBtn() {
  const navigate = useNavigate();
  return (
    <div className="absolute top-2 left-2">
      <button
        onClick={() => navigate("/")}
        className="p-2 rounded-full bg-white shadow-md"
      >
        <svg
          className="h-4 w-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    </div>
  );
}
