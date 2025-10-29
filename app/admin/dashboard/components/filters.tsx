import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent, SelectGroup } from "@/components/ui/select";


/** Single text input */
interface TextFilterProps {
  label: string;
  name?: string;
  value: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
}

/**
 * Single filter input component.
 * @param param0 - Properties for a single filter input including label, placeholder, and type.
 * @returns Component rendering a single input field for filtering.
 */

export function TextFilter({
  label,
  name,
  value = "",
  placeholder,
  type = "text",
  ...props
}: TextFilterProps) {
  return (
    <div {...props}>
      <Label className="mb-2">{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        defaultValue={value}
        name={name}
        className="w-full"
      />
    </div>
  );
}

/** Numeric range filter */
interface RangeFilterProps {
  label: string;
  minName?: string;
  maxName?: string;
  minValue: string;
  maxValue: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  type?: string;
  prefix?: string;
}
/**
 * Multiple filter inputs grouped together.
 * @returns Component rendering multiple input fields for filtering.
 */
export function RangeFilter({
  label,
  minName,
  maxName,
  maxValue,
  minValue,
  minPlaceholder,
  maxPlaceholder,
  prefix,
  type = "text",
  ...props
}: RangeFilterProps) {
  return (
    <div {...props}>
      <Label className="mb-2">{label}</Label>
      <div className="flex gap-2 items-center">
        <InputGroup className="w-1/2">
          {prefix && <InputGroupAddon>{prefix}</InputGroupAddon>}
          <InputGroupInput
            name={minName}
            type={type}
            placeholder={minPlaceholder}
            defaultValue={minValue ? minValue : ""}
          />
        </InputGroup>
        <span>-</span>
        <InputGroup className="w-1/2">
          {prefix && <InputGroupAddon>{prefix}</InputGroupAddon>}
          <InputGroupInput
            name={maxName}
            type={type}
            placeholder={maxPlaceholder}
            defaultValue={maxValue ? maxValue : ""}
          />
        </InputGroup>
      </div>
    </div>
  );
}

/** Select or radio filter */

interface SelectFilterProps {
  label: string;
  name?: string;
  options: string[];
  value: string;
  defaultValue?: string;
}

/**
 * A range filter component with min and max inputs.
 * @param rangeProps - Properties for the range filter including label, min/max placeholders, type, and prefix.
 * @returns Component rendering two input fields for specifying a range.
 */
export function SelectFilter({
  label,
  options,
  value,
  defaultValue,
  name,
  ...props
}: SelectFilterProps) {
  return (
    <div className="flex flex-col" {...props}>
      <label className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 py-2">Account Type</label>
      <select name={name} defaultValue={value} className="border p-2 rounded-md">
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
