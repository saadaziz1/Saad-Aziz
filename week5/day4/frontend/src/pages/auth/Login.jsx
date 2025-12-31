import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import LabelInputContainer from "@/components/common/LabelInputContainer";
import BottomGradient from "@/components/common/BottomGradient";
import useAuthStore from "@/store/authStore";


export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();

 
  
  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(formData);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  return (
    <div className="flex items-center justify-center mt-10">
      <div
      className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black ">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to TeaCommerce
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        
        Login to get started
      </p>
      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            placeholder="admin@teacommerce.com" 
            type="email" 
            value={formData.email}
            onChange={handleChange}
            required
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            placeholder="••••••••" 
            type="password" 
            value={formData.password}
            onChange={handleChange}
            required
          />
        </LabelInputContainer>
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <button
          className="group/btn relative block h-10 w-full rounded-md bg-linear-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-50"
          type="submit"
          disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login →'}
          <BottomGradient />
        </button>
        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
          Don't have an account? <Link to="/signup" className="underline text-blue-500">Sign up</Link>
        </p>
      </form>
    </div>
    </div>
    
  );
}




