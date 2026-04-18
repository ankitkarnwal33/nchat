import "dotenv/config";
import { Worker } from "bullmq";
import { sendEmail } from "./ses";
import { redisQueue } from "./redis-queue";
import fs from "fs/promises";
import ejs from "ejs"
import path from "path";



const connection = redisQueue;

export const passwordResetEmailWorker = new Worker(
  "password_reset_email_queue",
  async (job) => {

    const { data } = job;
    const { user, token } = data;

    // const html = await render(ResetPasswordEmail({ resetLink: `${process.env.NEXT_PUBLIC_APP_URL}/update-password?token=${token}` }));
    const template = await fs.readFile(path.join(__dirname, '..', 'features', 'templates', 'password-reset.ejs'), 'utf8');
    const html = await ejs.render(template, {
      user_name: user?.name || "Anonymous",
      reset_password_url: `${process.env.NEXT_PUBLIC_APP_URL}/update-password?token=${token}`,
      company_name: "N-Chat",
    });

    await sendEmail(user.email, "Reset your password", html);
  },
  {
    connection,
    concurrency: 13,
    limiter: {
      max: 13,
      duration: 1000,
    },
  },
);

// passwordResetEmailWorker.on("completed", (job) => {
// //   console.log(`Password reset email sent to ${job.data.user.email}`);
// });
