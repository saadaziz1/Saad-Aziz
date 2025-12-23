import React from "react";
import { Button } from "../ui/button";

const HeroSection = () => {
  return (
    <div className="lg:max-w-301  w-full flex flex-col lg:flex-row lg:justify-between justify-center items-center 2xl:mx-auto mx-0 font-montserrat">
      <div className="lg:w-1/2 w-full block ">
        <img
          src="./LayoutImages/Landing Main Image.png"
          alt="main"
          className="w-full h-full"
        />
      </div>
      <div className='lg:max-w-114 w-full mx-5 mt-10 px-5  lg:m-0 '>
        <h1 className="font-prosto-one font-normal text-4xl ">
          Every day is unique, just like our tea
        </h1>
        <p className=" text-base font-normal mt-7">
          Lorem ipsum dolor sit amet consectetur. Orci nibh nullam risus
          adipiscing odio. Neque lacus nibh eros in. Lorem ipsum dolor sit amet
          consectetur. Orci nibh nullam risus adipiscing odio. Neque lacus nibh
          eros in.
        </p>

        <Button className="rounded-none font-medium text-sm bg-[#282828] dark:bg-white text-white dark:text-black p-auto mt-7 w-65.75 h-14 ">
          BROWES TEAS
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
