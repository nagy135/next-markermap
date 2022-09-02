
/**
 * @author Viktor Nagy <viktor.nagy@01people.com>
 */
export default async (
  recordId: number,
  data: FormData
): Promise<any> => {
  return await (
    await fetch(`/api/image-to-record/${recordId}`, {
      method: "POST",
      body: data
    })
  ).json();
};
