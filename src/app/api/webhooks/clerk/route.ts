// app/api/webhooks/clerk/route.ts
import { Webhook } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const webhook = new Webhook(webhookSecret);

  try {
    const payload = await webhook.verify(await req.text(), req.headers);

    if (payload.type === "user.created") {
      await prisma.user.create({
        data: {
          clerkUserId: payload.data.id,
          email: payload.data.email_addresses[0].email_address,
          firstName: payload.data.first_name,
          lastName: payload.data.last_name,
        },
      });
    }

    if (payload.type === "user.deleted") {
      await prisma.user.delete({
        where: { clerkUserId: payload.data.id! },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid webhook" }, { status: 401 });
  }
}
