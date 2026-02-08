<<<<<<< HEAD
import { useRef } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

interface RevealProps {
   children: React.ReactNode;
   className?: string;
   delay?: number; // in milliseconds
   threshold?: number;
}

export function Reveal({ children, className, delay = 0, threshold = 0.1 }: RevealProps) {
   const { ref, isVisible } = useScrollAnimation(threshold);
   const transitionDelay = `${delay}ms`;

   return (
      <div
         ref={ref as React.RefObject<HTMLDivElement>}
         className={cn(
            "transition-all duration-700 ease-out transform",
            isVisible
               ? "opacity-100 translate-y-0"
               : "opacity-0 translate-y-12",
            className
         )}
         style={{ transitionDelay }}
      >
         {children}
      </div>
   );
}
=======
import { useRef } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

interface RevealProps {
   children: React.ReactNode;
   className?: string;
   delay?: number; // in milliseconds
   threshold?: number;
}

export function Reveal({ children, className, delay = 0, threshold = 0.1 }: RevealProps) {
   const { ref, isVisible } = useScrollAnimation(threshold);
   const transitionDelay = `${delay}ms`;

   return (
      <div
         ref={ref as React.RefObject<HTMLDivElement>}
         className={cn(
            "transition-all duration-700 ease-out transform",
            isVisible
               ? "opacity-100 translate-y-0"
               : "opacity-0 translate-y-12",
            className
         )}
         style={{ transitionDelay }}
      >
         {children}
      </div>
   );
}
>>>>>>> 0251dfea8c914f952057908c07daaf9cec5b8ee2
