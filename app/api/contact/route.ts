import nodemailer from "nodemailer";

const mailUser = process.env.EMAIL_USER;
const mailPass = process.env.EMAIL_PASS;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !phone || !message) {
      return Response.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!mailUser || !mailPass) {
      console.error("Contact email is not configured");

      return Response.json(
        { success: false, error: "Email service is not configured" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: mailUser,
        pass: mailPass,
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === "production",
      },
    });

    await transporter.sendMail({
      from: mailUser,
      to: process.env.CONTACT_TO_EMAIL || mailUser,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h3>New Contact Request</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Contact email failed:", getErrorMessage(error));

    return Response.json(
      {
        success: false,
        error: "Email not sent",
        detail:
          process.env.NODE_ENV === "production"
            ? undefined
            : getErrorMessage(error),
      },
      { status: 502 }
    );
  }
}
