/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from "react";
import { cn } from "@/lib/utils";
import { useStore } from "@tanstack/react-form";
import * as LabelPrimitive from "@radix-ui/react-label";

import type { FieldApi } from "@tanstack/react-form";

type TextFieldProps = {
  label?: string;
  field: FieldApi<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >;
};

const TextField = ({ label, field }: TextFieldProps) => {
  //   const field = useFieldContext<string>();
  const errors = useStore(field.store, (s) => s.meta.errors);

  return (
    <div className="space-y-1.5">
      <div className=" text-center">
      <LabelPrimitive.Root
        htmlFor={field.name}
        className={cn(
          "relative z-50 h-full w-full rounded-full border-none bg-transparent pr-20 pl-4 text-sm text-black focus:ring-0 focus:outline-none sm:pl-10 sm:text-base dark:text-white",
          // animating && "text-transparent dark:text-transparent"
        )}
      >
        {label}
      </LabelPrimitive.Root></div>
      <div className="flex items-center justify-center">
        <input
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          data-slot="input"
          aria-invalid={errors.length > 0}
          className={cn(
            "relative mx-auto h-12 w-full max-w-xl overflow-hidden rounded-full bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200 dark:bg-zinc-800",
          )}
        />
      </div>
      {errors.map((error: any) => (
        <p key={error} className="text-sm text-red-500">
          {error}
        </p>
      ))}
    </div>
  );
};

export { TextField };
