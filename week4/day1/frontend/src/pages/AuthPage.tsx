import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { ThemeToggle } from '../components/ThemeToggle';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background flex items-center justify-center p-4"
    >
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-4 right-4 z-50"
      >
        <motion.div
          className="bg-background/80 backdrop-blur-md border rounded-full p-2 shadow-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <ThemeToggle />
        </motion.div>
      </motion.nav>

      <div className="w-full max-w-md">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Todo App</h1>
          <p className="text-muted-foreground">Manage your tasks efficiently</p>
        </motion.div>
        
        <AnimatePresence mode="wait">
          {isLogin ? (
            <LoginForm key="login" onToggleForm={() => setIsLogin(false)} />
          ) : (
            <RegisterForm key="register" onToggleForm={() => setIsLogin(true)} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}