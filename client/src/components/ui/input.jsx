import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(
   ({ className, type, ...props }, ref) => {
      return (
         <input
            type={type}
            className={cn(
               "flex h-10 w-full rounded-lg border border-dark-100/40 bg-dark-100/80 px-3.5 py-2 text-sm text-light-100 shadow-sm transition-all duration-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50",
               className
            )}
            ref={ref}
            {...props}
         />
      );
   }
);

Input.displayName = "Input";

export { Input }; 