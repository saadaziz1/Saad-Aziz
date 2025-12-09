// app.js - Main application controller
class QuizApp {
  constructor() {
    this.currentUser = null;
    this.currentQuiz = null;
    this.currentQuestionIndex = 0;
    this.userAnswers = [];
    this.timer = null;
    this.selectedCategory = 'All';
    this.lastResult = null;
    this.timeLeft = 60;
  }

  init() {
    this.loadUser();
    this.renderLandingPage();
  }

  loadUser() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  saveUser(user) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.renderLandingPage();
  }

  navigateTo(page, data = null) {
    this.closeMobileMenu();
    this.closeUserMenu();
    switch(page) {
      case 'landing':
        this.renderLandingPage();
        break;
      case 'signin':
        this.renderSigninPage();
        break;
      case 'signup':
        this.renderSignupPage();
        break;
      case 'profile':
        this.renderProfilePage();
        break;
      case 'quizzes':
        this.renderQuizzesPage();
        break;
      case 'quiz':
        this.renderQuizPage(data);
        break;
      case 'review':
        this.renderReviewPage();
        break;
      case 'result':
        this.renderResultPage();
        break;
    }
  }

  closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    if (mobileMenu && overlay) {
      mobileMenu.classList.add('translate-x-full');
      overlay.classList.add('hidden');
    }
  }

  toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    
    if (mobileMenu.classList.contains('translate-x-full')) {
      mobileMenu.classList.remove('translate-x-full');
      overlay.classList.remove('hidden');
    } else {
      mobileMenu.classList.add('translate-x-full');
      overlay.classList.add('hidden');
    }
  }

  toggleUserMenu() {
  const menu = document.getElementById('userMenu');
  menu.classList.toggle('hidden');
}

  closeUserMenu() {
    const menu = document.getElementById("userMenu");
  const profileBtn = event.target.closest(".max-w-10");

  if (!menu) return;

  // If click is not on the profile image OR inside menu → close
  if (!profileBtn && !event.target.closest("#userMenu")) {
    menu.classList.add("hidden");
  }
  }

  renderLandingPage() {
    document.getElementById('app').innerHTML = `
  ${this.getHeader()}
  <main class="lg:mx-40 md:mx-20 mx-8 my-5">
    <section class="p-4 font-manrope text-center text-white">
      <div class="bg-[url('./images/landingPage.png')] w-full min-h-120 bg-no-repeat bg-cover bg-center rounded-lg relative">
        <div class="absolute inset-0 bg-linear-to-r from-black/10 to-black/40 rounded-lg">
          <div class="lg:mt-60 mt-40">
            <h1 class="font-extrabold md:text-[3rem] sm:text-[2.5rem] text-[2rem] tracking-[-2px] leading-15">
              Welcome to QuizMaster
            </h1>
            <p class="font-normal md:text-[1rem] text-sm leading-6 mt-2 md:pl-10">
              Test your knowledge with our engaging quizzes. Compete with friends and climb the leaderboard. Start your quiz journey today!
            </p>
          </div>
          <button onclick="app.navigateTo('${this.currentUser ? 'quizzes' : 'signin'}')" class="bg-[#0D78F2] font-bold text-base min-w-21 h-12 rounded-lg px-5 mt-8.75">
            Get Started
          </button>
        </div>
      </div>
    </section>
    <section class="p-4 font-manrope text-center text-primary">
      <div class="text-left">
        <h1 class="text-[2.25rem] font-extrabold leading-11">Key Features</h1>
        <p class="font-normal text-[1rem] leading-6 mt-4">
          Explore the exciting features that make QuizMaster awesome.
        </p>
      </div>
      <div class="flex flex-col md:flex-row items-center justify-between gap-3 text-left mt-10 w-full md:h-39.25 h-fit ">
          <div class="border border-[#DBE0E5] rounded-lg p-4 pb-9 w-full h-full">
            <div>
              <svg
                width="18"
                height="21"
                viewBox="0 0 18 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M9 3C4.02944 3 0 7.02944 0 12C0 16.9706 4.02944 21 9 21C13.9706 21 18 16.9706 18 12C17.9943 7.03179 13.9682 3.00568 9 3ZM9 19.5C4.85786 19.5 1.5 16.1421 1.5 12C1.5 7.85786 4.85786 4.5 9 4.5C13.1421 4.5 16.5 7.85786 16.5 12C16.4953 16.1402 13.1402 19.4953 9 19.5ZM13.2806 7.71937C13.4215 7.86005 13.5006 8.05094 13.5006 8.25C13.5006 8.44906 13.4215 8.63995 13.2806 8.78063L9.53063 12.5306C9.23757 12.8237 8.76243 12.8237 8.46937 12.5306C8.17632 12.2376 8.17632 11.7624 8.46937 11.4694L12.2194 7.71937C12.3601 7.57854 12.5509 7.49941 12.75 7.49941C12.9491 7.49941 13.1399 7.57854 13.2806 7.71937ZM6 0.75C6 0.335786 6.33579 0 6.75 0H11.25C11.6642 0 12 0.335786 12 0.75C12 1.16421 11.6642 1.5 11.25 1.5H6.75C6.33579 1.5 6 1.16421 6 0.75Z"
                  fill="#121417"
                />
              </svg>
            </div>
            <div class="mt-3">
              <h3 class="font-bold text-base">Timed Quizzes</h3>
              <p
                class="font-normal text-[#61738A] text-sm leading-5 tracking-normal"
              >
                Challenge yourself with timed quizzes to test your speed and
                accuracy.
              </p>
            </div>
          </div>

          <div class="border border-[#DBE0E5] rounded-lg p-4 pb-9 w-full h-full">
            <div>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M21.75 6H19.5V5.25C19.5 4.42157 18.8284 3.75 18 3.75H6C5.17157 3.75 4.5 4.42157 4.5 5.25V6H2.25C1.42157 6 0.75 6.67157 0.75 7.5V9C0.75 11.0711 2.42893 12.75 4.5 12.75H4.84219C5.74518 15.6116 8.26452 17.6614 11.25 17.9634V20.25H9C8.58579 20.25 8.25 20.5858 8.25 21C8.25 21.4142 8.58579 21.75 9 21.75H15C15.4142 21.75 15.75 21.4142 15.75 21C15.75 20.5858 15.4142 20.25 15 20.25H12.75V17.9606C15.7444 17.6578 18.2288 15.5569 19.1325 12.75H19.5C21.5711 12.75 23.25 11.0711 23.25 9V7.5C23.25 6.67157 22.5784 6 21.75 6ZM4.5 11.25C3.25736 11.25 2.25 10.2426 2.25 9V7.5H4.5V10.5C4.5 10.75 4.51219 11 4.53656 11.25H4.5ZM18 10.4156C18 13.7456 15.3291 16.4756 12.0459 16.5H12C8.68629 16.5 6 13.8137 6 10.5V5.25H18V10.4156ZM21.75 9C21.75 10.2426 20.7426 11.25 19.5 11.25H19.4531C19.4839 10.9729 19.4995 10.6944 19.5 10.4156V7.5H21.75V9Z"
                  fill="#121417"
                />
              </svg>
            </div>
            <div class="mt-3">
              <h3 class="font-bold text-base">Leaderboard</h3>
              <p
                class="font-normal text-[#61738A] text-sm leading-5 tracking-normal"
              >
                Compete with friends and other users to see who can achieve the
                highest scores.
              </p>
            </div>
          </div>
          <div class="border border-[#DBE0E5] rounded-lg p-4 pb-9 w-full h-full">
            <div>
            <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.5 15.75C19.5 16.1642 19.1642 16.5 18.75 16.5H0.75C0.335786 16.5 0 16.1642 0 15.75V0.75C0 0.335786 0.335786 0 0.75 0C1.16421 0 1.5 0.335786 1.5 0.75V9.59719L6.25594 5.4375C6.52266 5.20401 6.91644 5.18915 7.2 5.40187L12.7134 9.53719L18.2559 4.6875C18.454 4.49149 18.7443 4.4214 19.0099 4.5055C19.2756 4.58959 19.4727 4.81402 19.5218 5.08828C19.5709 5.36254 19.464 5.64143 19.2441 5.8125L13.2441 11.0625C12.9773 11.296 12.5836 11.3108 12.3 11.0981L6.78656 6.96469L1.5 11.5903V15H18.75C19.1642 15 19.5 15.3358 19.5 15.75Z" fill="#121417"/>
</svg>

            </div>
           <div class="mt-3">
              <h3 class="font-bold text-base">Progress Tracking</h3>
              <p
                class="font-normal text-[#61738A] text-sm leading-5 tracking-normal"
              >
                Track your progress and see how you improve over time with detailed performance reports.
              </p>
            </div>
          </div>
        </div>
    </section>
  </main>`;
  }

  getHeader() {
    return `
<header class="font-manrope border-b border-[#E5E8EB] p-10 w-full h-16.25 text-color-primary flex justify-between items-center">
  <div class="flex gap-4 items-center font-bold text-lg">
    <span>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M0 0H12L10 6L12 12H0L2 6L0 0Z" fill="#121417"/>
      </svg>
    </span>
    <h1 onclick="app.navigateTo('landing')" class="cursor-pointer">QuizMaster</h1>
  </div>
  <div class="hidden md:flex gap-8 items-center">
    <nav>
      <ul class="flex gap-9 items-center font-medium text-sm">
        <li><a href="javascript:void(0)" onclick="app.navigateTo('landing')">Home</a></li>
        ${this.currentUser ? '<li><a href="javascript:void(0)" onclick="app.navigateTo(\'quizzes\')">Quizzes</a></li>' : ''}
        ${this.currentUser ? '<li><a href="javascript:void(0)" onclick="app.navigateTo(\'profile\')">Profile</a></li>' : ''}
      </ul>
    </nav>

    ${this.currentUser ? `<button class="bg-[#F0F2F5] rounded-lg p-3">
<svg
width="15"
height="17"
viewBox="0 0 15 17"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<path
fill-rule="evenodd"
clip-rule="evenodd"
d="M14.8271 11.8703C14.3936 11.1234 13.749 9.01016 13.749 6.25C13.749 2.79822 10.9508 0 7.49902 0C4.04724 0 1.24902 2.79822 1.24902 6.25C1.24902 9.01094 0.603711 11.1234 0.170117 11.8703C-0.0552549 12.2568 -0.0568941 12.7342 0.165819 13.1223C0.388532 13.5103 0.801635 13.7497 1.24902 13.75H4.4373C4.73458 15.2046 6.01432 16.2493 7.49902 16.2493C8.98373 16.2493 10.2635 15.2046 10.5607 13.75H13.749C14.1963 13.7494 14.6091 13.5099 14.8316 13.1219C15.0542 12.734 15.0525 12.2567 14.8271 11.8703ZM7.49902 15C6.70464 14.9998 5.99663 14.4989 5.73184 13.75H9.26621C9.00142 14.4989 8.2934 14.9998 7.49902 15ZM1.24902 12.5C1.85059 11.4656 2.49902 9.06875 2.49902 6.25C2.49902 3.48858 4.7376 1.25 7.49902 1.25C10.2604 1.25 12.499 3.48858 12.499 6.25C12.499 9.06641 13.1459 11.4633 13.749 12.5H1.24902Z"
fill="#121417"
/>
</svg>
</button>` : ``}

    ${this.currentUser ? `
   <div class="relative"">
  <div onclick="app.toggleUserMenu()" class="max-w-10 max-h-10 rounded-[1.25rem] cursor-pointer">
    <img src="./images/profileHeadShot.png" class="w-full h-full rounded-[1.25rem]"/>
  </div>

  <!-- Dropdown -->
  <div id="userMenu" class="z-50 hidden absolute right-0 mt-2 w-48 bg-white shadow-lg p-4">
    <p class="font-semibold">${this.currentUser.name}</p>
    <p class="text-sm text-gray-600 mb-3">${this.currentUser.email}</p>
    <button onclick="app.logout()" class="w-full bg-red-500 text-white py-2 mt-2 rounded-lg hover:bg-red-600">
      Log Out
    </button>
  </div>
</div>
    ` : `
    <button onclick="app.navigateTo('signin')" class="bg-[#0D78F2] text-white px-4 py-2 rounded-lg">Sign In</button>
    `}
  </div>

  <div id="hamburger" onclick="app.toggleMobileMenu()" class="text-[#292929] dark:text-white  block md:hidden cursor-pointer p-2">
    <div class="flex flex-col gap-[.5188rem]">
        
        <svg width="33" height="3" viewBox="0 0 33 3" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.25 1.25H31.25" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <svg width="33" height="3" viewBox="0 0 33 3" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.25 1.25H31.25" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <svg width="33" height="3" viewBox="0 0 33 3" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.25 1.25H31.25" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
    </div>
  </div>

  <!-- Mobile Menu -->
  <div id="mobileMenu" class="fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform translate-x-full transition-transform duration-300 ease-in-out z-50 md:hidden">
    <div class="p-6">
      <div class="flex justify-end mb-8">
        <button onclick="app.toggleMobileMenu()" class="text-gray-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      
      <nav class="mb-8">
        <ul class="space-y-6">
          <li><a href="javascript:void(0)" onclick="app.navigateTo('landing')" class="text-lg font-medium">Home</a></li>
          ${this.currentUser ? '<li><a href="javascript:void(0)" onclick="app.navigateTo(\'quizzes\')" class="text-lg font-medium">Quizzes</a></li>' : ''}
          ${this.currentUser ? '<li><a href="javascript:void(0)" onclick="app.navigateTo(\'profile\')" class="text-lg font-medium">Profile</a></li>' : ''}
        </ul>
      </nav>

      <div class="space-y-4">
        ${this.currentUser ? `
        <button class="bg-[#F0F2F5] rounded-lg p-3 w-full flex justify-center">
          <svg width="15" height="17" viewBox="0 0 15 17" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.8271 11.8703C14.3936 11.1234 13.749 9.01016 13.749 6.25C13.749 2.79822 10.9508 0 7.49902 0C4.04724 0 1.24902 2.79822 1.24902 6.25C1.24902 9.01094 0.603711 11.1234 0.170117 11.8703C-0.0552549 12.2568 -0.0568941 12.7342 0.165819 13.1223C0.388532 13.5103 0.801635 13.7497 1.24902 13.75H4.4373C4.73458 15.2046 6.01432 16.2493 7.49902 16.2493C8.98373 16.2493 10.2635 15.2046 10.5607 13.75H13.749C14.1963 13.7494 14.6091 13.5099 14.8316 13.1219C15.0542 12.734 15.0525 12.2567 14.8271 11.8703ZM7.49902 15C6.70464 14.9998 5.99663 14.4989 5.73184 13.75H9.26621C9.00142 14.4989 8.2934 14.9998 7.49902 15ZM1.24902 12.5C1.85059 11.4656 2.49902 9.06875 2.49902 6.25C2.49902 3.48858 4.7376 1.25 7.49902 1.25C10.2604 1.25 12.499 3.48858 12.499 6.25C12.499 9.06641 13.1459 11.4633 13.749 12.5H1.24902Z" fill="#121417"/>
          </svg>
        </button>
        
        <div  class="flex flex-col items-center gap-3 cursor-pointer">
          <img src="./images/profileHeadShot.png" class="w-10 h-10 rounded-full"/>
             <p class="font-semibold">${this.currentUser.name}</p>
    <p class="text-sm text-gray-600 mb-3">${this.currentUser.email}</p>
   
         <button onclick="app.logout()" class="bg-red-500 text-white px-4 py-2 rounded-lg w-full">Log Out</button>

        </div>
        ` : `
        <button onclick="app.navigateTo('signin')" class="bg-[#0D78F2] text-white px-4 py-2 rounded-lg w-full">Sign In</button>
        `}
      </div>
    </div>
  </div>

  <!-- Mobile Menu Overlay -->
  <div id="mobileMenuOverlay" class="fixed inset-0 bg-black/20 bg-opacity-50 z-40 hidden md:hidden" onclick="app.toggleMobileMenu()"></div>
</header>`;
  }
}

// Initialize app when DOM is loaded
let app;
window.addEventListener('DOMContentLoaded', () => {
  app = new QuizApp();
  app.init();
});