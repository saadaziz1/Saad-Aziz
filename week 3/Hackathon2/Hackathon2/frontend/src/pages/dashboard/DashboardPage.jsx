import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-20">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to Tea Store!</h1>
        <p className="text-gray-600 mt-4 text-lg">Discover our premium tea collections</p>
      </main>
      <Footer />
    </div>
  );
};