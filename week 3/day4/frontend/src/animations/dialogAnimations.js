import { gsap } from "gsap";

export const dialogFadeInScale = (element, options = {}) => {
  const { duration = 0.4, ease = "back.out(1.7)" } = options;
  
  gsap.fromTo(element, 
    {
      opacity: 0,
      scale: 0.8,
      y: 30
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration,
      ease
    }
  );
};

export const dialogFadeOut = (element, onComplete, options = {}) => {
  const { duration = 0.3, ease = "power2.in" } = options;
  
  gsap.to(element, {
    opacity: 0,
    scale: 0.9,
    y: -20,
    duration,
    ease,
    onComplete
  });
};