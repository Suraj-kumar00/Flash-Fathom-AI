import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

type Data = {
  message: string;
};

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to send a confirmation email
const sendConfirmationEmail = async (email: string) => {
  try {
    await transporter.sendMail({
      from: `"FlashFathom AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for subscribing!",
      text: "Thank you for subscribing to our platform!",
      html: `<p>Thank you for subscribing to our platform!</p>`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send confirmation email");
  }
};

export async function GET() {
  return NextResponse.json({ message: "Welcome to the subscribe API!" });
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (
      !email ||
      typeof email !== "string" ||
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
    ) {
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 }
      );
    }

    await sendConfirmationEmail(email);
    return NextResponse.json(
      { message: "Subscription confirmation email sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid JSON format" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Error sending email, please try again later" },
      { status: 500 }
    );
  }
}
