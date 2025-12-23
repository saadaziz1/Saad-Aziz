import Image from 'next/image';

interface AvatarProps {
  src?: string;
  username: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-sm',
  xl: 'w-20 h-20 text-2xl'
};

export const Avatar = ({ src, username, size = 'md', className = '' }: AvatarProps) => {
  const sizeClass = sizeClasses[size];
  
  return (
    <div className={`${sizeClass} bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden ${className}`}>
      {src ? (
        <Image 
          src={src} 
          alt={username}
          width={size === 'xl' ? 80 : size === 'lg' ? 40 : size === 'md' ? 32 : 24}
          height={size === 'xl' ? 80 : size === 'lg' ? 40 : size === 'md' ? 32 : 24}
          className="w-full h-full object-cover"
          unoptimized
        />
      ) : (
        username.slice(0, 2).toUpperCase()
      )}
    </div>
  );
};