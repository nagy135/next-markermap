import { TGetUsersResponse } from "@ctypes/response";

/**
 * @author Viktor Nagy <viktor.nagy@01people.com>
 */
export default async (): Promise<TGetUsersResponse> => {
  return await (
    await fetch("/api/users")
  ).json();
};
