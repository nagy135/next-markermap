import { createContext } from "react";

const defaultGuest = {
  guest: false,
  setGuest: (change: boolean) => {},
};
export const GuestContext = createContext(defaultGuest);
