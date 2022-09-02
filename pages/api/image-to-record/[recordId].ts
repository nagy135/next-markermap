import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";

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

const saveFile = async (files: File | File[]) => {
  const file: File = Array.isArray(files) ? files[0] : files;
  const data = fs.readFileSync(file.filepath);
  fs.writeFileSync(`./public/${file.originalFilename}`, data);
  fs.unlinkSync(file.filepath);
  return;
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const { recordId } = req.query;
  console.log(
    "================\n",
    "recordId: ",
    recordId,
    "\n================"
  );
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    await saveFile(files.image);
    return res.status(201).send("");
  });
  return res.status(200).json({ lol: 1 });
};
