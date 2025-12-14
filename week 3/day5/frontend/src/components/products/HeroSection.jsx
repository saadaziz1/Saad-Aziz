const HeroSection = ({ heroImg }) => {
  return (
    <section className="relative h-64 md:h-80">
      <img
        src={heroImg}
        alt="Tea collection hero"
        className="w-full h-full object-cover"
      />
      <div className="absolute bg-opacity-30"></div>
    </section>
  );
};

export default HeroSection;