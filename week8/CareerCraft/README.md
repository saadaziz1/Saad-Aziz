# CareerCraft 🚀

[Live Demo](https://career-craft-client-beta.vercel.app/)  

CareerCraft is a resume-builder web app that lets users **enter their data**, see a **live preview**, and **download** the resume as **PDF** or **DOCX**.  
Built using **TypeScript**, **NestJS**, **MongoDB**, and Gemini API (or your backend logic) for generating and formatting based on user input.

---

## 🧩 Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Architecture & Components](#architecture--components)  
- [Getting Started](#getting-started)  
- [Usage](#usage)  
- [Deploying](#deploying)  
- [Contributing](#contributing)  
- [License](#license)  
- [Acknowledgments](#acknowledgments)  

---

## 🛠️ Features

- Input your personal, educational, work, skills, and other resume data  
- Live preview of the resume while you type  
- Download as **PDF** or **DOCX**  
- Clean, modern, responsive UI  
- Backend logic to format and generate documents  
- Easy to extend with custom templates or styles  

---

## 🧰 Tech Stack

| Layer     | Technology                         |
|-----------|--------------------------------------|
| Frontend  | Next.js with TypeScript       |
| Backend   | NestJS                   |
| Database  | MongoDB                                |
| Document Generation | Pupptier      |
| Deployment| Vercel |
| Utilities | DOCX / PDF generation libraries, REST API |

---

## 🏗 Architecture & Components

- **Frontend (client/)**  
  - Form UI for user to input resume data  
  - Live preview rendering of the resume  
  - Buttons to download PDF or DOCX  
  - Communicates with backend APIs to generate documents  

- **Backend (server/)**  
  - Receives user data via API endpoints  
  - Uses Gemini API or internal logic to build formatted resume documents  
  - Offers endpoints to send back PDF or DOCX files  
  - Stores user data if persistence is needed (optional)  

- **Database (MongoDB)**  
  - (Optional) Stores user profiles, resume drafts, templates  

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/wasiiff/CareerCraft.git
cd CareerCraft
