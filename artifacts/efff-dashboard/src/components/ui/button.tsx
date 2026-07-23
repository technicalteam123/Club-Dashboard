import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-[var(--efff-cyan-hover)]",
        destructive: "border-destructive bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border-input bg-white text-foreground shadow-sm hover:border-primary hover:bg-accent",
        secondary: "border-input bg-white text-secondary-foreground shadow-sm hover:border-primary hover:bg-accent",
        ghost: "border-transparent hover:bg-white/70 hover:text-foreground",
        link: "border-transparent text-[var(--efff-navy)] underline-offset-4 hover:text-[var(--efff-cyan-hover)] hover:underline",
        glass: "border-white/60 bg-white/55 text-foreground shadow-sm hover:bg-white/80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
