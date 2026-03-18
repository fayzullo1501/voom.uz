const Hero = () => {
  return (
    <section className="bg-[#0D1117] text-white py-28 relative overflow-hidden">

      <div className="container-wide text-center">

        {/* TITLE */}
        <h1 className="text-5xl md:text-6xl font-semibold leading-tight">
          Документация по Voom
        </h1>

        {/* SUBTITLE */}
        <p className="mt-6 font-semibold text-gray-400 text-lg">
          Справка по всему Voom
        </p>

      </div>

      {/* gradient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#32BB78]/20 blur-[120px]" />
      </div>

    </section>
  );
};

export default Hero;