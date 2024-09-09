import { Webhook } from "svix";
import { headers } from "next/headers";
import { env } from "@/env";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { api } from "@/trpc/server";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint

  if (!env.WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(env.WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);

  console.log("");
  console.log("");
  console.log("");
  console.log("Webhook body:", body);
  console.log("");
  console.log("");
  console.log("");

  if (eventType === "user.created") {
    const email = evt.data.email_addresses.find(
      (email) => email.id === evt.data.primary_email_address_id,
    );

    await api.user.create({
      email: email?.email_address ?? "user@mail.com",
      emailVerified:
        evt.data.email_addresses[0]?.verification?.status === "verified",
      id: evt.data.id,
      image: evt.data.image_url,
      username: evt.data.username ?? "username",
    });
  }

  return new Response("", { status: 200 });
}
