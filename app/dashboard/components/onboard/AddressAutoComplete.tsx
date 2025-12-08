"use client";

import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Input } from "@/components/ui/input";
import { UseFormSetValue } from "react-hook-form";

interface Props {
  setValue: UseFormSetValue<any>;
  value: string;
  onChange: (value: string) => void;
}

export default function AddressAutocomplete({ setValue, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    const init = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: ["places"],
      });

      const google = await loader.load();

      if (!inputRef.current) return;

      const autocomplete = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          fields: ["address_components", "formatted_address"],
          types: ["address"],
        }
      );

      autocompleteRef.current = autocomplete;

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place?.address_components) return;

        let street = "";
        let city = "";
        let state = "";
        let zip = "";

        place.address_components.forEach((comp) => {
          const types = comp.types;

          if (types.includes("street_number")) street = comp.long_name;
          if (types.includes("route")) street += " " + comp.long_name;
          if (types.includes("locality")) city = comp.long_name;
          if (types.includes("administrative_area_level_1"))
            state = comp.short_name;
          if (types.includes("postal_code")) zip = comp.long_name;
        });

        const fullAddress = street.trim();
        
        // Update the input value to show the selected address
        onChange(fullAddress);
        
        // Fill RHF fields
        setValue("address", fullAddress, { shouldValidate: true });
        setValue("city", city, { shouldValidate: true });
        setValue("state", state, { shouldValidate: true });
        setValue("zipCode", zip, { shouldValidate: true });
      });
    };

    init();
  }, [setValue, onChange]);

  // Handle manual input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    // Update the form field immediately when user types or deletes
    // This ensures manual edits are captured and validation runs
    setValue("address", newValue, { shouldValidate: true });
  };

  // Sync the input value with the controlled value prop
  // This ensures React's controlled component stays in sync
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== value) {
      // Only update if the value actually changed to avoid unnecessary updates
      inputRef.current.value = value;
    }
  }, [value]);

  return (
    <Input
      ref={inputRef}
      value={value}
      onChange={handleInputChange}
      placeholder="Start typing your address..."
    />
  );
}
