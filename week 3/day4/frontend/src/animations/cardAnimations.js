import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const staggeredEntrance = (elements, options = {}) => {
  const {
    delay = 0.15,
    duration = 0.8,
    ease = "back.out(1.7)",
    trigger = null,
    start = "top 85%"
  } = options;

  elements.forEach((element, index) => {
    if (!element) return;
    
    gsap.fromTo(element, 
      {
        y: 80,
        opacity: 0,
        scale: 0.8
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration,
        ease,
        delay: index * delay,
        scrollTrigger: {
          trigger: trigger || element,
          start,
          toggleActions: "play none none none"
        }
      }
    );
  });
};

export const hoverEffect = (element, options = {}) => {
  const {
    scale = 1.03,
    boxShadow = "0px 20px 50px rgba(0,0,0,0.25)",
    duration = 0.3
  } = options;

  const handleMouseEnter = () => {
    gsap.to(element, {
      boxShadow,
      scale,
      duration,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
      scale: 1,
      duration,
      ease: "power2.out"
    });
  };

  element?.addEventListener('mouseenter', handleMouseEnter);
  element?.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element?.removeEventListener('mouseenter', handleMouseEnter);
    element?.removeEventListener('mouseleave', handleMouseLeave);
  };
};