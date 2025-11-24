import type { ControllerRenderProps } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

type MoneyInputProps = {
  field: ControllerRenderProps<any, any>;
};

export function MoneyInput({ field }: MoneyInputProps) {
  // Convert stored number to formatted string for display
  const displayValue =
    field.value !== undefined && field.value !== null
      ? formatCurrency(field.value)
      : "";

  return (
    <Input
      placeholder="00.00"
      className="text-5xl text-center h-20"
      value={displayValue}
      onChange={(e) => {
        // Remove all non-digits
        const raw = e.target.value.replace(/\D/g, "");
        // Parse to numeric value in dollars
        const num = parseFloat(raw) / 100;
        // Save *numeric* value to form state
        field.onChange(isNaN(num) ? 0 : num);
      }}
    />
  );
}
