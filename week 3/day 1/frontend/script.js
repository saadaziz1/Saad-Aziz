const navItems = document.querySelectorAll(".nav-item");
const underline = document.getElementById("nav-underline");


underline.style.transition = "width 0.3s ease, transform 0.3s ease";

navItems.forEach(item => {
  item.addEventListener("click", () => {
    const rect = item.getBoundingClientRect();
    const parentRect = item.parentElement.getBoundingClientRect();

 
    underline.style.width = (rect.width+14.7031) + "px";
    underline.style.transform = `translateX(${rect.left - parentRect.left}px)`;
  });
});


const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;

  if(menuOpen) {
    // slide menu
    mobileMenu.style.maxHeight = mobileMenu.scrollHeight + "px";

    // transform hamburger into X
    hamburger.children[0].style.transform = "rotate(45deg) translate(7px, 5px)";
    hamburger.children[1].style.opacity = "0";
    hamburger.children[2].style.transform = "rotate(-45deg) translate(7px, -5px)";
  } else {
    // collapse menu
    mobileMenu.style.maxHeight = "0px";

    // reset hamburger
    hamburger.children[0].style.transform = "rotate(0deg) translate(0, 0)";
    hamburger.children[1].style.opacity = "1";
    hamburger.children[2].style.transform = "rotate(0deg) translate(0, 0)";
  }
});
