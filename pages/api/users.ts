import { TGetUsersRequest } from "@ctypes/request";
import { TGetRecordsResponse, TPostRecordResponse } from "@ctypes/response";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../services/internal";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TPostRecordResponse | TGetRecordsResponse>
) {
  switch (req.method) {
    case "GET":
      return await get(res, req.query as TGetUsersRequest);
    default:
      throw new Error("unknown request");
  }
}

const get = async (res: NextApiResponse, _data: TGetUsersRequest) => {
  const emails = (
    await prisma.record.findMany({
      select: {
        userEmail: true,
      },
      distinct: ["userEmail"],
    })
  ).map((e) => e.userEmail);
  return res.status(200).json(emails);
};
