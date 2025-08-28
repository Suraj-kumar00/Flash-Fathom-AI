"use client";

import React, { useEffect, useState } from "react";

const BacktoTop: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > window.innerHeight * 0.3);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section>
      {visible && (
        <button
          onClick={handleScrollTop}
          className="hidden sm:flex fixed cursor-pointer z-[12] right-10 bottom-16 w-12 h-12 rounded-full border-4 border-[#A557F7] bg-[#A557F7] flex items-center justify-center duration-300 hover:bg-purple-700 active:scale-90 transition"
          aria-label="Scroll to top"
        >
          <svg
            className="w-4 h-4 fill-white"
            viewBox="0 0 384 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"></path>
          </svg>
        </button>
      )}
    </section>
  );
};

export default BacktoTop;
