import { motion } from 'framer-motion';
import { LogOut, User } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { useNavigate } from 'react-router-dom';

export function FloatingNav() {
  const { user, logout } = useAuth();
  const navigate  =useNavigate();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-4 right-4 z-50"
    >
      <motion.div
        className="flex items-center gap-2 bg-background/80 backdrop-blur-md border rounded-full px-4 py-2 shadow-lg"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {user? <User className="h-4 w-4" /> : <Button variant="ghost"
          size="sm"
          onClick={()=> navigate('/login')}>Sign in</Button>}
          
          
        
        <ThemeToggle />
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="h-8 w-8 p-0"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.nav>
  );
}