export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  return Response.json({ name: params.name, files: [], dependencies: {} });
}