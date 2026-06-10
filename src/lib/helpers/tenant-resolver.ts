import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Tenant from "@/lib/models/Tenant";

export async function resolveTenant(request: Request): Promise<string> {
  const host = request.headers.get("host") || "localhost:3000";
  const domain = host.split(":")[0];

  await dbConnect();

  if (domain === "localhost" || domain === "127.0.0.1") {
    const defaultTenant = await Tenant.findOne({ domain: "localhost" });
    if (defaultTenant) return defaultTenant.tenantId;

    const { v4: uuidv4 } = await import("uuid");
    const tenantId = uuidv4();
    await Tenant.create({
      tenantId,
      name: "Default",
      domain: "localhost",
    });
    return tenantId;
  }

  const tenant = await Tenant.findOne({
    $or: [{ domain }, { customDomain: domain }],
  });

  if (!tenant) {
    const { v4: uuidv4 } = await import("uuid");
    const tenantId = uuidv4();
    await Tenant.create({
      tenantId,
      name: domain,
      domain,
    });
    return tenantId;
  }

  return tenant.tenantId;
}
