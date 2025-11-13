"use client";

import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
} from "@/components/ui/select";
import {
  usePathname,
  useSearchParams,
  useRouter,
  ReadonlyURLSearchParams,
} from "next/navigation";

import { useDebouncedCallback } from "use-debounce";

/** Single text input */
interface TextFilterProps {
  label: string;
  name?: string;
  value: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
}

function useURLFilter(delay = 300) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const updateFilter = useDebouncedCallback((name: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value.trim()) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    const queryString = params.toString();
    replace(queryString ? `${pathname}?${queryString}` : pathname);
  }, delay);

  return { updateFilter, searchParams };
}

/**
 * Single filter input component.
 * @param param0 - Properties for a single filter input including label, placeholder, and type.
 * @returns Component rendering a single input field for filtering.
 */
export function TextFilter({
  label,
  name = "",
  value = "",
  placeholder,
  type = "text",
  ...props
}: TextFilterProps) {
  const { updateFilter, searchParams } = useURLFilter();

  return (
    <div {...props}>
      <Label className="mb-2">{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        name={name}
        className="w-full"
        onChange={(e) => {
          updateFilter(name, e.target.value);
        }}
        defaultValue={searchParams.get(name)?.toString()}
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
  minName = "",
  maxName = "",
  maxValue,
  minValue,
  minPlaceholder,
  maxPlaceholder,
  prefix,
  type = "text",
  ...props
}: RangeFilterProps) {
  const { updateFilter, searchParams } = useURLFilter();

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
            onChange={(e) => {
              updateFilter(minName, e.target.value);
            }}
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
            onChange={(e) => {
              updateFilter(maxName, e.target.value);
            }}
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
  name = "",
  ...props
}: SelectFilterProps) {
  const { updateFilter, searchParams } = useURLFilter();

  return (
    <div className="flex flex-col" {...props}>
      <label className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 mb-2">
        {label}
      </label>
      <select
        name={name}
        defaultValue={value}
        className="border p-2 rounded-md"
        onChange={(e) => {
          updateFilter(name, e.target.value);
        }}
      >
        <option value="">ANY</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
