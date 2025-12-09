"use client";

import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Input } from "@/components/ui/input";
import { UseFormSetValue } from "react-hook-form";

interface Props {
  setValue: UseFormSetValue<any>;
}

export default function AddressAutocomplete({ setValue }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const init = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: 'weekly',
        libraries: ["places"],
      });

      const google = await loader.load();

      if (!inputRef.current) return;

      const autocomplete = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          fields: ["address_components"],
          types: ["address"],
        }
      );

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

        // Fill RHF fields
        setValue("address", street.trim(), { shouldValidate: true });
        setValue("city", city, { shouldValidate: true });
        setValue("state", state, { shouldValidate: true });
        setValue("zipCode", zip, { shouldValidate: true });
      });
    };

    init();
  }, [setValue]);

  return (
    <Input
      ref={inputRef}
      placeholder="Start typing your address..."
    />
  );
}
