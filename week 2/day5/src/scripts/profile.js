// profile.js - Profile page
QuizApp.prototype.renderProfilePage = function() {
  if (!this.currentUser) {
    this.navigateTo('signin');
    return;
  }

  this.activeTab = this.activeTab || 'activity';
  const results = Storage.getUserResults(this.currentUser.id);

  document.getElementById('app').innerHTML = `
  ${this.getHeader()}
  <main class="lg:mx-40 md:mx-20 mx-8 my-5">
    <section class="p-4 font-manrope">
      <div class="flex justify-center pb-4 text-center">
        <div>
          <div class="h-32 w-32 mx-4.5">
            <img src="./images/profileHeadShot2.png" alt="profileHeadShot2" class="w-full h-full rounded-full" />
          </div>
          <div>
            <h3 class="font-bold text-primary text-[1.375rem] leading-7 tracking-normal">
              ${this.currentUser.name}
            </h3>
            <p class="font-normal text-base text-[#61738A] leading-6 tracking-normal">
              Quiz Enthusiast
            </p>
            <p class="font-normal text-base text-[#61738A] leading-6 tracking-normal">
              Joined ${new Date(this.currentUser.joinDate).getFullYear()}
            </p>
          </div>
        </div>
      </div>

      <div>
        <div class="flex space-x-6 border-b border-[#DBE0E5] font-bold text-sm">
          <div class="border-b-2 ${this.activeTab === 'activity' ? 'border-primary' : 'border-[#DBE0E5]'} pb-3 mx-4">
            <a href="#" onclick="app.switchTab('activity')" class="${this.activeTab === 'activity' ? 'text-primary' : 'text-[#61738A]'} hover:text-primary">
              Activity
            </a>
          </div>
          <div class="border-b-2 ${this.activeTab === 'profile' ? 'border-primary' : 'border-[#DBE0E5]'} pb-3 mx-4">
            <a href="#" onclick="app.switchTab('profile')" class="${this.activeTab === 'profile' ? 'text-primary' : 'text-[#61738A]'} hover:text-primary">
              Profile
            </a>
          </div>
        </div>

        ${this.activeTab === 'activity' ? this.getActivityTabContent(results) : this.getProfileTabContent()}
      </div>
    </section>
  </main>`;
};

QuizApp.prototype.switchTab = function(tab) {
  this.activeTab = tab;
  this.renderProfilePage();
};

QuizApp.prototype.toggleEditMode = function() {
  if (this.editMode) {
    const name = document.getElementById('editName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const bio = document.getElementById('editBio').value.trim();
    
    if (name && email) {
      this.currentUser.name = name;
      this.currentUser.email = email;
      this.currentUser.bio = bio;
      this.saveUser(this.currentUser);
      Storage.updateUser(this.currentUser);
    }
  }
  this.editMode = !this.editMode;
  this.renderProfilePage();
};

QuizApp.prototype.getActivityTabContent = function(results) {
  const totalQuizzes = results.length;
  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const avgScore = totalQuizzes > 0 ? Math.round(totalScore / totalQuizzes) : 0;

  return `
    <h2 class="font-bold text-[1.375rem] tracking-normal leading-7 text-primary text-left mt-5 mb-3 mx-4">
      Quiz Statistics
    </h2>
    
    <div class="px-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="border border-[#DBE0E5] rounded-lg p-6 text-center">
          <h4 class="text-2xl font-bold text-[#0D78F2]">${totalQuizzes}</h4>
          <p class="text-[#61738A] text-sm">Quizzes Completed</p>
        </div>
        <div class="border border-[#DBE0E5] rounded-lg p-6 text-center">
          <h4 class="text-2xl font-bold text-[#0D78F2]">${avgScore}%</h4>
          <p class="text-[#61738A] text-sm">Average Score</p>
        </div>
        <div class="border border-[#DBE0E5] rounded-lg p-6 text-center">
          <h4 class="text-2xl font-bold text-[#0D78F2]">${results.filter(r => r.score >= 70).length}</h4>
          <p class="text-[#61738A] text-sm">Passed Quizzes</p>
        </div>
      </div>
    </div>

    <h2 class="font-bold text-[1.375rem] tracking-normal leading-7 text-primary text-left mt-5 mb-3 mx-4">
      Quiz History
    </h2>

    <div class="overflow-hidden border rounded-lg border-[#DBE0E5] m-4 font-medium leading-5">
      <table class="min-w-full text-left text-sm">
        <thead class="text-primary">
          <tr>
            <th class="py-3 px-4">Quiz Name</th>
            <th class="py-3 px-4">Score</th>
            <th class="py-3 px-4">Date</th>
          </tr>
        </thead>
        <tbody>
          ${results.length > 0 ? results.slice(-10).reverse().map(result => `
            <tr class="border-t border-[#DBE0E5]">
              <td class="py-3 px-4">${QUIZ_DATA.find(q => q.id === result.quizId)?.title || 'Unknown Quiz'}</td>
              <td class="py-3 px-4 text-[#61738A]">${result.score}/100</td>
              <td class="py-3 px-4 text-[#61738A]">${new Date(result.date).toLocaleDateString()}</td>
            </tr>
          `).join('') : `
            <tr class="border-t border-[#DBE0E5]">
              <td colspan="3" class="py-6 px-4 text-center text-[#61738A]">No quiz history yet. Take your first quiz!</td>
            </tr>
          `}
        </tbody>
      </table>
    </div>

    <div class="flex gap-4 justify-center mt-6">
      <button onclick="app.navigateTo('quizzes')" class="bg-[#0D78F2] text-white px-6 py-3 rounded-lg font-semibold">
        Take a Quiz
      </button>
      <button onclick="app.logout()" class="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold">
        Logout
      </button>
    </div>
  `;
};

QuizApp.prototype.getProfileTabContent = function() {
  const results = Storage.getUserResults(this.currentUser.id);
  const bio = this.currentUser.bio || 'Avid quiz taker and trivia lover. Always up for a challenge!';
  
  return `
    <div class="flex justify-between items-center mt-5 mb-3 mx-4">
      <h2 class="font-bold text-[1.375rem] tracking-normal leading-7 text-primary text-left">
        Personal Information
      </h2>
      <button onclick="app.toggleEditMode()" class="bg-[#0D78F2] text-white px-4 py-2 rounded-lg text-sm font-semibold">
        ${this.editMode ? 'Save' : 'Edit Profile'}
      </button>
    </div>

    <div class="px-4">
      <div class="grid grid-cols-1 md:grid-cols-[186px_1fr] gap-6">
        <div class="border-t border-[#E5E8EB] py-5 md:w-46.5">
          <p class="text-[#61738A] text-sm leading-5 font-normal">Name</p>
          ${this.editMode ? `
            <input type="text" id="editName" value="${this.currentUser.name}" class="text-primary text-sm leading-5 font-normal mt-1 border border-[#DBE0E5] rounded px-2 py-1 w-full" />
          ` : `
            <p class="text-primary text-sm leading-5 font-normal mt-1">
              ${this.currentUser.name}
            </p>
          `}
        </div>

        <div class="border-t border-[#E5E8EB] py-5 w-full">
          <p class="text-[#61738A] text-sm leading-5 font-normal">Email</p>
          ${this.editMode ? `
            <input type="email" id="editEmail" value="${this.currentUser.email}" class="text-primary text-sm leading-5 font-normal mt-1 border border-[#DBE0E5] rounded px-2 py-1 w-full" />
          ` : `
            <p class="text-primary text-sm leading-5 font-normal mt-1">
              ${this.currentUser.email}
            </p>
          `}
        </div>
      </div>

      <div class="border-t border-[#E5E8EB] py-5 mt-6">
        <p class="text-[#61738A] text-sm leading-5 font-normal">Bio</p>
        ${this.editMode ? `
          <textarea id="editBio" class="text-primary text-sm leading-5 font-normal mt-1 border border-[#DBE0E5] rounded px-2 py-1 w-full" rows="3">${bio}</textarea>
        ` : `
          <p class="text-primary text-sm leading-5 font-normal mt-1">
            ${bio}
          </p>
        `}
      </div>
    </div>

    <h2 class="font-bold text-[1.375rem] tracking-normal leading-7 text-primary text-left mt-5 mb-3 mx-4">
      Quiz History
    </h2>

    <div class="overflow-hidden border rounded-lg border-[#DBE0E5] m-4 font-medium leading-5">
      <table class="min-w-full text-left text-sm">
        <thead class="text-primary">
          <tr>
            <th class="py-3 px-4">Quiz Name</th>
            <th class="py-3 px-4">Score</th>
            <th class="py-3 px-4">Date</th>
          </tr>
        </thead>
        <tbody>
          ${results.length > 0 ? results.slice(-10).reverse().map(result => `
            <tr class="border-t border-[#DBE0E5]">
              <td class="py-3 px-4">${QUIZ_DATA.find(q => q.id === result.quizId)?.title || 'Unknown Quiz'}</td>
              <td class="py-3 px-4 text-[#61738A]">${result.score}/100</td>
              <td class="py-3 px-4 text-[#61738A]">${new Date(result.date).toLocaleDateString()}</td>
            </tr>
          `).join('') : `
            <tr class="border-t border-[#DBE0E5]">
              <td colspan="3" class="py-6 px-4 text-center text-[#61738A]">No quiz history yet. Take your first quiz!</td>
            </tr>
          `}
        </tbody>
      </table>
    </div>
  `;
};