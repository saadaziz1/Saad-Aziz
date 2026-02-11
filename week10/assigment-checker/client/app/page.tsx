import Link from "next/link";
import Button from "@/components/atoms/Button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

      <div className="z-10 text-center mb-16 space-y-4">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-primary-glow to-secondary">
          AssignCheck AI
        </h1>
        <p className="text-xl md:text-2xl text-foreground/60 max-w-2xl mx-auto font-medium">
          The future of academic evaluation. Precise, fast, and intelligence-driven.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl z-10">
        {/* Teacher Card */}
        <Link href="/teacher" className="group">
          <div className="glass glass-hover p-10 h-full rounded-3xl flex flex-col items-center text-center space-y-6 cursor-pointer">
            <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">Teacher Portal</h2>
              <p className="text-foreground/70">Create assignments, upload submissions, and generate detailed marks sheets automatically.</p>
            </div>
            <div className="pt-4">
              <span className="px-8 py-4 bg-primary rounded-2xl font-bold text-white group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all">Get Started</span>
            </div>
          </div>
        </Link>

        {/* Student Card */}
        <Link href="/student" className="group">
          <div className="glass glass-hover p-10 h-full rounded-3xl flex flex-col items-center text-center space-y-6 cursor-pointer">
            <div className="w-20 h-20 rounded-2xl bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="space-y-2 text-white">
              <h2 className="text-3xl font-bold text-white">Student Portal</h2>
              <p className="text-foreground/70">Submit your assignments, access grades, and view detailed AI-generated feedback.</p>
            </div>
            <div className="pt-4 text-white">
              <span className="px-8 py-4 bg-secondary rounded-2xl font-bold text-white group-hover:shadow-[0_0_20px_rgba(14,165,233,0.5)] transition-all">Access Portal</span>
            </div>
          </div>
        </Link>
      </div>
    </main>
  );
}
