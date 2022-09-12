import { SessionContextValue, useSession } from "next-auth/react";

const isMockLoggedIn = true;
export function useMockSession(): SessionContextValue {
  if (process.env.NEXT_PUBLIC_ENV === "production") return useSession();
  else {
    return isMockLoggedIn
      ? {
          data: {
            user: {
              name: "nagy135",
              email: "lul@lul.sk",
              image: "https://avatars.githubusercontent.com/u/11056512?v=4",
            },
            expires: "never",
          },
          status: "authenticated",
        }
      : {
          data: null,
          status: "unauthenticated",
        };
  }
}
