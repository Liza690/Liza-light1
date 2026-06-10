import dbConnect from "@/lib/db";
import { resolveTenant } from "@/lib/helpers/tenant-resolver";

export async function withTenant(
  request: Request,
  handler: (tenantId: string) => Promise<Response>
): Promise<Response> {
  await dbConnect();
  const tenantId = await resolveTenant(request);
  return handler(tenantId);
}
