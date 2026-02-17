'use client'

import { ConnectButton } from '@/components/ConnectButton';
import { TaskInput } from '@/components/TaskInput';
import { TaskList } from '@/components/TaskList';
import { CheckSquare, ListTodo, Boxes } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden text-white selection:bg-indigo-500/30">

      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-linear-to-br from-violet-600 to-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20">
              <Boxes className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
                Kasplex Todo
              </h1>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Decentralized on zkEVM
              </p>
            </div>
          </div>

          <ConnectButton />
        </header>

        {/* Main Content */}
        <main className="space-y-8">
          {/* Stats/Intro Section could go here */}

          <TaskInput />

          <div className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-white/10 to-transparent" />
            <TaskList />
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-500 text-sm pb-8">
          <p className="flex items-center justify-center gap-2">
            Built with <span className="text-red-500">♥</span> on Kasplex Testnet
          </p>
        </footer>
      </div>
    </div>
  );
}
