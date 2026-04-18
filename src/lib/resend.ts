import { Resend } from "resend";

import dotenv from "dotenv";
dotenv.config();

export const resend = new Resend("re_Rif7TTsJ_gfBZSvMuz7iazeymGcFVJjHk");

export const sendEmail = async (
  to: string,
  subject: string = "Your Order Confirmation",
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "noreply@wheatless.in",
      to: to,
      subject: subject,
      template: {
        // Template ID from Resend dashboard
        id: "testing_template",
        // Variables to populate in the template
        // IMPORTANT: Names are case-sensitive!
        variables: {
          NAME: "Ankit Karnwal", // Must match exactly
          Content: "This is a test email",
        },
      },
    });
    if (error) {
      console.log(error);
      throw new Error(error.message);
    }
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error as string);
  }
};

export const sendResetPasswordEmail = async (to: string, token: string) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/update-password?token=${token}`;
  await resend.emails.send({
    from: "noreply@wheatless.in",
    to: to,
    subject: "Reset your password",
    template: {
      // Template ID from Resend dashboard
      id: "password-reset",
      // Variables to populate in the template
      // IMPORTANT: Names are case-sensitive!
      variables: {
        url: resetUrl,
      },
    },
  });
};
