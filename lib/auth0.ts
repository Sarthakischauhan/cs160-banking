import { Auth0Client} from "@auth0/nextjs-auth0/server";
import { Session } from "@/types/session";

import jwt from "jsonwebtoken"

export const auth0 = new Auth0Client();

export const getRole = (session: Session) : string => {
  if (!session){
    return ""
  }
  const decodedToken = jwt.decode(session.tokenSet.idToken || "") as Record<string, any> | null;
  const roles = decodedToken && decodedToken['https://my-app.example.com/roles'];

  if (!roles){
    return ""
  }

  // assuming roles is an array, we return all roles comma seperated
  return roles.join()
}