import * as React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.ComponentProps<"input"> {
  /** Height variant for the input */
  variant?: "default" | "lg";
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "h-9",
      lg: "h-11",
    };

    return (
      <Input
        ref={ref}
        className={cn(variantClasses[variant], className)}
        {...props}
      />
    );
  }
);

FormInput.displayName = "FormInput";

export { FormInput };
