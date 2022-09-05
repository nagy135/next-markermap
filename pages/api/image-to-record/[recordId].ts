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
  const path = `./public/${file.originalFilename}`;
  fs.writeFileSync(path, data);
  fs.unlinkSync(file.filepath);
  return path;
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const { recordId: recordIdRaw } = req.query;
  if (!recordIdRaw) return res.status(400).send("recordId is required!");
  const recordId = Array.isArray(recordIdRaw) ? recordIdRaw[0] : recordIdRaw;
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    const path = await saveFile(files.image);

    const record = await prisma.record.findUnique({
      where: { id: Number(recordId) },
    });
    if (!record) return res.status(400).send("record doesnt exist!");

    await prisma.image.create({
      data: {
        name: "",
        path,
        recordId: record.id,
      },
    });

    return res.status(201).send("");
  });
  return res.status(200).json({ lol: 1 });
};
