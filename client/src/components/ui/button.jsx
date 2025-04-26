import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
   "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-300 disabled:opacity-60 disabled:pointer-events-none",
   {
      variants: {
         variant: {
            default: "bg-primary-600 text-white shadow-md hover:bg-primary-700",
            destructive:
               "bg-accent-red/90 text-white shadow-sm hover:bg-accent-red",
            outline:
               "border border-light-400/20 bg-transparent shadow-sm hover:bg-dark-100 text-light-100",
            secondary:
               "bg-dark-100 text-light-100 shadow-sm hover:bg-dark-350",
            ghost:
               "hover:bg-dark-100 text-light-100 hover:text-primary-400",
            link: "text-primary-400 underline-offset-4 hover:underline",
            soft: "bg-primary-500/10 text-primary-500 hover:bg-primary-500/20",
         },
         size: {
            default: "h-10 px-4 py-2",
            sm: "h-8 rounded-md text-xs",
            lg: "h-11 rounded-md px-8 text-base",
            icon: "h-9 w-9",
         },
      },
      defaultVariants: {
         variant: "default",
         size: "default",
      },
   }
);

const Button = React.forwardRef(
   ({ className, variant, size, asChild = false, ...props }, ref) => {
      const Comp = asChild ? Slot : "button";
      return (
         <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
         />
      );
   }
);

Button.displayName = "Button";

export { Button, buttonVariants }; 