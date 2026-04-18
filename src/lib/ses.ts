import "dotenv/config";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
    try {
        
        const command = new SendEmailCommand({
          Source: process.env.AWS_SES_SOURCE!,
          Destination: {
            ToAddresses: [to],
          },
          Message: {
            Subject: { Data: subject },
            Body: {
              Html: { Data: html },
            },
          },
        });
      
        await ses.send(command);

    } catch (error) {
        console.error(error);
        throw new Error(error as string);
    }
}
