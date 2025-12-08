const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');
const overlay = document.getElementById('overlay');
const mobileNavLinks = mobileMenu.querySelectorAll('a');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.remove('translate-x-full');
  overlay.classList.remove('hidden');
});

const closeMenuFn = () => {
  mobileMenu.classList.add('translate-x-full');
  overlay.classList.add('hidden');
};

closeMenu.addEventListener('click', closeMenuFn);
overlay.addEventListener('click', closeMenuFn);
mobileNavLinks.forEach(link => link.addEventListener('click', closeMenuFn));

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
