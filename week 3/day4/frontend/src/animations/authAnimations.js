import { gsap } from "gsap";

export const authFadeIn = (element, options = {}) => {
  const { duration = 0.8, ease = "power2.out" } = options;
  
  gsap.fromTo(element, 
    {
      opacity: 0,
      y: 20
    },
    {
      opacity: 1,
      y: 0,
      duration,
      ease
    }
  );
};

export const authSlideUp = (element, options = {}) => {
  const { duration = 0.6, ease = "power2.out", delay = 0 } = options;
  
  gsap.fromTo(element, 
    {
      opacity: 0,
      y: 40,
      scale: 0.95
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration,
      ease,
      delay
    }
  );
};

export const authStaggerFields = (elements, options = {}) => {
  const { duration = 0.5, stagger = 0.1, ease = "power2.out", delay = 0.3 } = options;
  
  gsap.fromTo(elements, 
    {
      opacity: 0,
      y: 30,
      x: -10
    },
    {
      opacity: 1,
      y: 0,
      x: 0,
      duration,
      ease,
      stagger,
      delay
    }
  );
};