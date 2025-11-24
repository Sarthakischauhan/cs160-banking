import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { Session } from "@/types/session";

import { jwtDecode } from "jwt-decode";

export const auth0 = new Auth0Client();

export const getRole = (session: Session): string => {
  if (!session) {
    return "";
  }
  
  const idToken = session.tokenSet.idToken || "";

  if (!idToken) {
    return "";
  }

  const decodedToken = jwtDecode(idToken) as Record<string, any>;
  
  if (!decodedToken) {
    return "";
  }
  
  const roles = decodedToken["https://my-app.example.com/roles"];

  if (!roles) {
    return "";
  }


  return roles.join();
};
