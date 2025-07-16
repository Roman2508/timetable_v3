import { unstable_createContext } from "react-router";

import type { UserType } from "./store/auth/auth-types";

export const userContext = unstable_createContext<UserType | null>(null);
