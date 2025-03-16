import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Get the headers properly in Next.js API routes
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, return error
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", { status: 400 });
  }

  // Get the raw JSON body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify the webhook signature using Svix
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error: Invalid webhook signature", { status: 400 });
  }

  // Handle the webhook event
  try {
    switch (evt.type) {
      case "user.created":
        await prisma.user.create({
          data: {
            clerkUserId: evt.data.id,
            email: evt.data.email_addresses?.[0]?.email_address || "",
            firstName: evt.data.first_name || "",
            lastName: evt.data.last_name || "",
          },
        });
        break;

      case "user.updated":
        await prisma.user.update({
          where: { clerkUserId: evt.data.id },
          data: {
            email: evt.data.email_addresses?.[0]?.email_address || "",
            firstName: evt.data.first_name || "",
            lastName: evt.data.last_name || "",
          },
        });
        break;

      case "user.deleted":
        await prisma.user
          .delete({
            where: { clerkUserId: evt.data.id },
          })
          .catch(() => console.warn("User not found, skipping deletion."));
        break;

      default:
        console.log("Unhandled webhook event type:", evt.type);
    }

    return NextResponse.json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}
