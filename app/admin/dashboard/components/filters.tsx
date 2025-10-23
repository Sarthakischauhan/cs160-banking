import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";

type Input = {
  id: string;
  placeholder?: string;
  type?: string;
  prefix?: string;
};

interface FilterInputProps {
  label: string;
  placeholder?: string;
  type?: string;
  prefix?: string;
}

interface FilterRangeProps {
  label: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  type?: string;
  prefix?: string;
}

/**
 * Single filter input component.
 * @param param0 - Properties for a single filter input including label, placeholder, and type.
 * @returns Component rendering a single input field for filtering.
 */
function FilterInput({
  inputProps,
  ...props
}: {
  inputProps: FilterInputProps;
}) {
  return (
    <div {...props}>
      <Label className="mr-2 mb-2">{inputProps.label}</Label>
      <Input
        type={inputProps.type ? inputProps.type : ""}
        placeholder={inputProps.placeholder}
        className="w-full"
      />
    </div>
  );
}

/**
 * Multiple filter inputs grouped together.
 * @param param0 - An array of filter field definitions including label, placeholder, and type.
 * @returns Component rendering multiple input fields for filtering.
 */
function FilterGroup({
  label,
  inputFields,
  ...props
}: {
  label: string;
  inputFields: Input[];
}) {
  return (
    <div className="flex flex-col" {...props}>
      <div>
        <Label className="mr-2 mb-2">{label}</Label>
      </div>
      <div className="flex flex-row gap-4">
        {inputFields.map((field) => (
          <Input
            key={field.id}
            type={field.type ? field.type : "text"}
            placeholder={field.placeholder}
            className="w-1/2"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * A range filter component with min and max inputs.
 * @param rangeProps - Properties for the range filter including label, min/max placeholders, type, and prefix.
 * @returns Component rendering two input fields for specifying a range.
 */
function FilterRange({
  rangeProps,
  ...props
}: {
  rangeProps: FilterRangeProps;
}) {
  return (
    <div>
      <Label className="mr-2 mb-2">{rangeProps.label}</Label>
      <div className="flex flex-row items-center">
        <InputGroup className="w-3/7 mr-2">
          {rangeProps.prefix ? (
            <InputGroupAddon>{rangeProps.prefix}</InputGroupAddon>
          ) : (
            <></>
          )}
          <InputGroupInput
            type={rangeProps.type}
            placeholder={rangeProps.minPlaceholder}
          ></InputGroupInput>
        </InputGroup>
        <span>-</span>
        <InputGroup className="w-3/7 ml-2">
          {rangeProps.prefix ? (
            <InputGroupAddon>{rangeProps.prefix}</InputGroupAddon>
          ) : (
            <></>
          )}
          <InputGroupInput
            type={rangeProps.type}
            placeholder={rangeProps.maxPlaceholder}
          ></InputGroupInput>
        </InputGroup>
      </div>
    </div>
  );
}

export { FilterInput, FilterRange, FilterGroup };
