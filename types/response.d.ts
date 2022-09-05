import { Record, Image, Prisma } from "@prisma/client";

type RecordWithImages = Prisma.RecordGetPayload<{ include: { images: true } }>;

export type TPostRecordResponse = Record;
export type TGetRecordsResponse = RecordWithImages[];
