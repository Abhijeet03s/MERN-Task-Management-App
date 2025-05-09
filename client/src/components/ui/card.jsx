import * as React from "react";
import { cn } from "../../lib/utils";

const Card = React.forwardRef(
   ({ className, hover = false, ...props }, ref) => (
      <div
         ref={ref}
         className={cn(
            "rounded-xl border border-dark-100/30 bg-dark-200 shadow-card",
            hover && "transition-all duration-200 hover:shadow-glow hover:border-primary-500/30",
            className
         )}
         {...props}
      />
   )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef(
   ({ className, ...props }, ref) => (
      <div
         ref={ref}
         className={cn("flex flex-col space-y-1.5 p-3 sm:p-6", className)}
         {...props}
      />
   )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(
   ({ className, ...props }, ref) => (
      <h3
         ref={ref}
         className={cn("text-2xl font-semibold text-light-100 leading-none tracking-tight", className)}
         {...props}
      />
   )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(
   ({ className, ...props }, ref) => (
      <p
         ref={ref}
         className={cn("text-sm text-light-500/80", className)}
         {...props}
      />
   )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(
   ({ className, ...props }, ref) => (
      <div ref={ref} className={cn("p-3 sm:p-6 pt-0", className)} {...props} />
   )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(
   ({ className, ...props }, ref) => (
      <div
         ref={ref}
         className={cn("flex items-center p-6 pt-0", className)}
         {...props}
      />
   )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }; 