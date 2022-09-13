import { TGetRecordsRequest } from "@ctypes/request";
import { TGetRecordsResponse } from "@ctypes/response";

/**
 * @author Viktor Nagy <viktor.nagy@01people.com>
 */
export default async (
  data: TGetRecordsRequest
): Promise<TGetRecordsResponse> => {
  const { email } = data;
  return await (
    await fetch(
      "/api/records?" +
        new URLSearchParams(email.map((e) => ["email", e] ?? []))
    )
  ).json();
};
