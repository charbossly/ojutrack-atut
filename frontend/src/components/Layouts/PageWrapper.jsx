import React from "react";
import { getCurrentTime } from "../../utils";
import { Link } from "react-router-dom";

import Header from "../Header";

export default function PageWrapper({ children }) {
  return (
    <div className="gap-y-4  justify-between font-poppins flex-col md:gap-y-4  h-screen   flex items-center md:justify-center">
      <Header />
      <div className="relative w-full   md:h-full   rounded-[40px] md:rounded-none  overflow-hidden">
        <div className="absolute inset-0  rounded-[40px] md:rounded-none pointer-events-none"></div>

        <div className="relative w-full h-full  overflow-y-auto">
          <main className="flex flex-col items-center justify-center relative">
            {children}
          </main>
        </div>

        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-[100px] h-1 rounded-full"></div>
      </div>
      <div className=" text-center text-gray-500 text-xs mb-4">
        Made with ❤️ by<Link to="/credits"> Face Similarity Group - ATUT</Link>
      </div>
    </div>
  );
}
