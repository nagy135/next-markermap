import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import { prisma } from "../../../services/internal";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  switch (req.method) {
    case "POST":
      return await post(req, res);
    default:
      throw new Error("unknown request");
  }
}

const saveFile = async (files: File | File[]): Promise<string> => {
  const file: File = Array.isArray(files) ? files[0] : files;
  const data = fs.readFileSync(file.filepath);
  const path = `${file.originalFilename}`;
  fs.writeFileSync(`./public/${path}`, data);
  fs.unlinkSync(file.filepath);
  return path;
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const { recordId: recordIdRaw } = req.query;
  console.log("================\n", "uploading image to record: ", recordIdRaw, "\n================");
  if (!recordIdRaw) return res.status(400).send("recordId is required!");
  const recordId = Array.isArray(recordIdRaw) ? recordIdRaw[0] : recordIdRaw;
  const form = new formidable.IncomingForm();
  try {
    const responseMsg = await new Promise<string>((resolve, reject) => {
      form.parse(req, async function (err, fields, files) {
        const path = await saveFile(files.image);

        const record = await prisma.record.findUnique({
          where: { id: Number(recordId) },
        });
        if (!record) {
          reject("record doesnt exist!");
          return;
        }

        await prisma.image.create({
          data: {
            name: "",
            path,
            recordId: record.id,
          },
        });
        resolve("added");
      });
    });
    console.log("================\n", "responseMsg: ", responseMsg, "\n================");
    return res.status(201).send({ msg: responseMsg });
  } catch (error) {
    return res.status(400).send({ msg: "" });
  }
};
