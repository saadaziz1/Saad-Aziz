import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  return (
    <nav className="bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-end">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}