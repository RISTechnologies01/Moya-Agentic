import { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";

type MoyaAuthContextValue = { user: User | null };

export const MoyaAuthContext = createContext<MoyaAuthContextValue>({ user: null });

export function useMoyaAuth() {
  return useContext(MoyaAuthContext);
}