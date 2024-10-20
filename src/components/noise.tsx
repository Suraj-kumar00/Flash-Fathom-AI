const Noise = () => {
  return (
    <div
      className="-z-10 absolute inset-0 w-full h-full scale-[1.2] opacity-5 overflow-x-"
      style={{
        overflowX: "hidden",
        backgroundImage: "url(/noise.webp)",
        backgroundSize: "10%",
        maskImage: "radial-gradient(#fff, transparent, 15%)",
      }}
    />
  );
};

export default Noise;
