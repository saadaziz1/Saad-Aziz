interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  onClick 
}: ButtonProps) {
  const baseClasses = 'transition-colors rounded font-medium';
  
  const variants = {
    primary: 'bg-[#007aff] text-white hover:bg-[#0066d9]',
    secondary: 'bg-white text-black hover:bg-gray-100',
    outline: 'border border-[#f5f5f5] text-[#f5f5f5] hover:bg-[#f5f5f5] hover:text-black'
  };
  
  const sizes = {
    sm: 'px-4 py-1 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}