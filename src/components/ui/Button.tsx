import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "volt" | "outline" | "outline-white" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  href?: string;
  external?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      href,
      external,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold font-sans rounded-pill transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none select-none text-center cursor-pointer";

    const variantStyles = {
      primary: "bg-asphalt-black text-white hover:bg-neutral-800 active:bg-neutral-900",
      volt: "bg-volt text-asphalt-black hover:bg-volt-hover active:bg-volt-hover shadow-sm",
      outline: "bg-transparent border border-asphalt-black text-asphalt-black hover:bg-neutral-100",
      "outline-white": "bg-transparent border border-white text-white hover:bg-white/10",
      secondary: "bg-neutral-100 text-asphalt-black hover:bg-neutral-200 border border-neutral-200",
      ghost:
        "bg-transparent text-asphalt-black hover:opacity-75 relative after:absolute after:bottom-1 after:left-0 after:h-[1.5px] after:w-0 hover:after:w-full after:bg-current after:transition-all after:duration-300",
    };

    const sizeStyles = {
      default: "h-12 px-7 text-sm sm:text-base tracking-tight",
      sm: "h-10 px-5 text-xs sm:text-sm tracking-tight",
      lg: "h-14 px-8 text-base sm:text-lg tracking-tight",
      icon: "h-11 w-11 p-0 rounded-full",
    };

    const combined = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

    if (href) {
      if (external) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={combined}
          >
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={combined}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} disabled={disabled} className={combined} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
