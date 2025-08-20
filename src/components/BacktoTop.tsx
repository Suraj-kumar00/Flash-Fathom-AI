"use client";

import React, { useEffect, useState } from "react";

const BacktoTop: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect((): (() => void) => {
    const toggleVisibility = (): void => {
      if (window.scrollY > window.innerHeight * 0.3) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return (): void => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const handleScrollTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section>
      {visible && (
        <button
          onClick={handleScrollTop}
          className="flex fixed cursor-pointer z-[12] right-10 bottom-16 after:content-['scroll_to_top'] after:text-white after:absolute after:text-nowrap after:scale-0 hover:after:scale-100 transition-all ease-linear after:duration-200 w-16 h-16 rounded-full border-[3px] border-[#A557F7] dark:border-white bg-[#111827] dark:bg-[#A557F7] pointer items-center justify-center duration-300 hover:rounded-[50px] hover:w-36 group/button overflow-hidden active:scale-90"
        >
          <svg
            className="w-3 fill-white delay-50 duration-200 group-hover/button:-translate-y-12"
            viewBox="0 0 384 512"
          >
            <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"></path>
          </svg>
        </button>
      )}
    </section>
  );
};

export default BacktoTop;
