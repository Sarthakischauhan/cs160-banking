import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { ControllerRenderProps } from "react-hook-form";

type MoneyInputProps = {
  field: ControllerRenderProps<any, any>;
};

export function MoneyInput(props: MoneyInputProps) {
  

  return (
    <Input
      placeholder="00.00"
      className="!text-5xl text-center h-20"
      value={formatCurrency(props.field.value)}
      onChange={(e) => {
        // Remove non-digits
        const raw = e.target.value.replace(/\D/g, "");
        // Parse into cents
        const num = parseFloat(raw) / 100;
        // Update form value
        props.field.onChange(num.toFixed(2));
      }}
    />
  );
}
