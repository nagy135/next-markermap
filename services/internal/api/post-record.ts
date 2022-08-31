import { TPostRecordRequest } from "@ctypes/request";
import { TPostRecordResponse } from "@ctypes/response";

/**
 * @author Viktor Nagy <viktor.nagy@01people.com>
 */
export default async (
  data: TPostRecordRequest
): Promise<TPostRecordResponse> => {
  return await (
    await fetch("/api/records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  ).json();
};
