import { gsap } from "gsap";

export const showSuccessNotification = (message, container) => {
  // Create notification element
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(45deg, #4caf50, #45a049);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(76, 175, 80, 0.3);
      z-index: 9999;
      font-weight: 600;
      backdrop-filter: blur(10px);
    ">
      ${message}
    </div>
  `;
  
  document.body.appendChild(notification);
  
  const tl = gsap.timeline();
  
  // Animation timeline
  tl.fromTo(notification, 
    { 
      x: 100, 
      opacity: 0, 
      scale: 0.8 
    },
    { 
      x: 0, 
      opacity: 1, 
      scale: 1, 
      duration: 0.5, 
      ease: "back.out(1.7)" 
    }
  )
  .to(notification, 
    { 
      x: 100, 
      opacity: 0, 
      scale: 0.8, 
      duration: 0.3, 
      ease: "power2.in",
      delay: 2.5 
    }
  )
  .call(() => {
    document.body.removeChild(notification);
  });
  
  return tl;
};

export const animateTableRow = (element, type = 'add') => {
  if (type === 'add') {
    gsap.fromTo(element,
      { 
        x: -50, 
        opacity: 0, 
        backgroundColor: 'rgba(76, 175, 80, 0.1)' 
      },
      { 
        x: 0, 
        opacity: 1, 
        backgroundColor: 'transparent',
        duration: 0.6, 
        ease: "power2.out" 
      }
    );
  } else if (type === 'remove') {
    gsap.to(element, {
      x: 50,
      opacity: 0,
      scale: 0.9,
      duration: 0.4,
      ease: "power2.in"
    });
  }
};