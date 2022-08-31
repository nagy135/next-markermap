export type TGetRecordsRequest = {
  email?: string;
};

export type TPostRecordRequest = {
  name: string;
  description: string;
  email: string;
  lat: number;
  lon: number;
  alt: number;
};
