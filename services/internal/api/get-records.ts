import { TGetRecordsResponse } from "@ctypes/response";

/**
 * @author Viktor Nagy <viktor.nagy@01people.com>
 */
export default async (email?: string): Promise<TGetRecordsResponse> => {
  return await (
    await fetch("/api/records?" + (email ? new URLSearchParams({ email }) : ""))
  ).json();
};
