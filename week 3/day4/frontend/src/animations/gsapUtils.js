import gsap from 'gsap';

export const fadeIn = (element, duration = 0.8) => {
  gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration });
};

export const slideUp = (element, duration = 0.6) => {
  gsap.fromTo(element, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration });
};

export const staggerFadeIn = (elements, stagger = 0.1) => {
  gsap.fromTo(elements, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger, duration: 0.5 });
};

export const scaleIn = (element, duration = 0.4) => {
  gsap.fromTo(element, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration });
};

export const countUp = (element, end, duration = 2) => {
  gsap.to(element, {
    innerText: end,
    duration,
    snap: { innerText: 1 },
    ease: 'power1.out',
  });
};
