import { TGetRecordsRequest, TPostRecordRequest } from "@ctypes/request";
import { TGetRecordsResponse, TPostRecordResponse } from "@ctypes/response";
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../services/internal";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TPostRecordResponse | TGetRecordsResponse>
) {
  switch (req.method) {
    case "GET":
      const data: TGetRecordsRequest = {};
      if (req.query.email) {
        const emailArr = Array.isArray(req.query.email)
          ? req.query.email
          : [req.query.email];
        data.email = emailArr;
      }
      return await get(res, data);
    case "POST":
      return await post(res, {
        ...req.body,
        ...req.query,
      } as TPostRecordRequest);
    default:
      throw new Error("unknown request");
  }
}

const get = async (res: NextApiResponse, data: TGetRecordsRequest) => {
  const where: Prisma.RecordWhereInput = {};

  if (data.email) {
    where.userEmail = { in: data.email };
  }

  const records = await prisma.record.findMany({
    where,
    include: {
      images: true,
    },
  });
  return res.status(200).json(records);
};

const post = async (res: NextApiResponse, data: TPostRecordRequest) => {
  if (!data.name || !data.email)
    return res.status(400).send("Not all the data provided");

  const record = await prisma.record.create({
    data: {
      name: data.name,
      description: data.description,
      userEmail: data.email,
      lat: data.lat,
      lon: data.lon,
      alt: data.alt,
    },
  });
  return res.status(200).json(record);
};
