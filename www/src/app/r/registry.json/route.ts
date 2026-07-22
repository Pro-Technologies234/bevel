import { GET as getIndex } from "../index.json/route";

export const revalidate = 3600;

export async function GET() {
  return getIndex();
}
