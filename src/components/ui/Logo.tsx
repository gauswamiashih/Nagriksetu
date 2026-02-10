import React from 'react';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';

interface LogoProps {
   className?: string; // Class for the outer container
   iconClassName?: string; // Class for the img element (aliased from iconClassName for compat)
   textClassName?: string; // Unused but kept for compatibility
   showText?: boolean;     // Unused but kept for compatibility
}

export const Logo: React.FC<LogoProps> = ({
   className,
   iconClassName,
}) => {
   return (
      <div className={cn("relative flex items-center justify-center select-none", className)}>
         <img
            src={logo}
            alt="NagrikSetu Logo"
            className={cn("h-12 w-auto object-contain drop-shadow-sm", iconClassName)}
         />
      </div>
   );
};
