import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import * as motion from "framer-motion/client";

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};

const Header = () => {
  return (
    <header className="bg-[#F2F0F1] pt-10 md:pt-24 overflow-hidden">
      <div className="md:max-w-frame mx-auto grid grid-cols-1 md:grid-cols-2">

        {/* LEFT CONTENT */}
        <motion.section
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-frame px-4"
        >
          <h2
            className={cn(
              integralCF.className,
              "text-4xl lg:text-[64px] lg:leading-[64px] mb-5 lg:mb-8"
            )}
          >
            FIND CLOTHES THAT MATCHES YOUR STYLE
          </h2>

          <p className="text-black/60 text-sm lg:text-base mb-6 lg:mb-8 max-w-[545px]">
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>

          <Link
            href="/shop"
            className="w-full md:w-52 mb-5 md:mb-12 inline-block text-center bg-black hover:bg-black/80 transition-all text-white px-14 py-4 rounded-full"
          >
            Shop Now
          </Link>

          {/* STATS */}
          <div className="flex md:h-full items-center justify-center md:justify-start flex-wrap sm:flex-nowrap md:space-x-3 lg:space-x-6 xl:space-x-8 md:mb-[116px]">
            <div className="flex flex-col">
              <span className="font-bold text-2xl lg:text-3xl xl:text-[40px]">
                <AnimatedCounter from={0} to={200} />+
              </span>
              <span className="text-xs xl:text-base text-black/60">
                International Brands
              </span>
            </div>

            <Separator orientation="vertical" className="h-12 bg-black/10" />

            <div className="flex flex-col">
              <span className="font-bold text-2xl lg:text-3xl xl:text-[40px]">
                <AnimatedCounter from={0} to={2000} />+
              </span>
              <span className="text-xs xl:text-base text-black/60">
                High-Quality Products
              </span>
            </div>

            <Separator orientation="vertical" className="hidden sm:block h-12 bg-black/10" />

            <div className="flex flex-col w-full sm:w-auto text-center sm:text-left mt-3 sm:mt-0">
              <span className="font-bold text-2xl lg:text-3xl xl:text-[40px]">
                <AnimatedCounter from={0} to={3000} />+
              </span>
              <span className="text-xs xl:text-base text-black/60">
                Happy Customers
              </span>
            </div>
          </div>
        </motion.section>

        {/* RIGHT IMAGE */}
        <motion.section
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative md:px-4 min-h-[448px] md:min-h-[428px] bg-cover bg-top xl:bg-[center_top_-1.6rem] bg-no-repeat bg-[url('/images/header-res-homepage.png')] md:bg-[url('/images/header-homepage.png')]"
        >
          <Image
            priority
            src="/icons/big-star.svg"
            height={104}
            width={104}
            alt="big star"
            className="absolute right-7 xl:right-0 top-12 max-w-[76px] lg:max-w-24 xl:max-w-[104px]"
          />

          <Image
            priority
            src="/icons/small-star.svg"
            height={56}
            width={56}
            alt="small star"
            className="absolute left-7 md:left-0 top-36 sm:top-64 md:top-44 lg:top-56 max-w-11 md:max-w-14"
          />
        </motion.section>

      </div>
    </header>
  );
};

export default Header;
