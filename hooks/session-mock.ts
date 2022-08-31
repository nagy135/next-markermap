import { useSession } from "next-auth/react";

const isMockLoggedIn = true;
export function useMockSession() {
  if (process.env.NEXT_PUBLIC_ENV === "production") return useSession();
  else {
    return isMockLoggedIn
      ? {
          data: {
            user: {
              name: "nagy135",
              email: "test@test.sk",
              image: "https://avatars.githubusercontent.com/u/11056512?v=4",
            },
          },
          status: "authenticated",
        }
      : {
          data: null,
        };
  }
}
