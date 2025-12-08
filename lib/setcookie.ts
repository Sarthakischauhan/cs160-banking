"use client";
import { useEffect, useState } from "react";
import { handleCurrentId } from "@/lib/user";

export default function SetDefaultAccount({ accounts }: any) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done && accounts.length > 0) {
      const setCookie = async () => {
        await handleCurrentId(accounts[0].account_id); // call your API to set cookie
        setDone(true);
        window.location.reload(); // reload once after setting
      };
      setCookie();
    }
  }, [done, accounts]);

  return null; // no UI
}
