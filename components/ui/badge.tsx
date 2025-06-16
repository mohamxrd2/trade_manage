import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        success:
          "bg-green-100 text-green-800 border-transparent dark:bg-green-900 dark:text-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-800",

        default:
          "bg-blue-100 text-blue-800 border-transparent dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-800",

        secondary:
          "bg-gray-100 text-gray-800 border-transparent dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700",

        destructive:
          "bg-red-100 text-red-800 border-transparent dark:bg-red-900 dark:text-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-800",

        outline:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
