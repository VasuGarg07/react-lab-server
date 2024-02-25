import { BASE_URL } from "../configuration/app.config";

export const verifyEmailSubject = "Verify Your Email Address to Get Started";

export const verifyEmailBody = (token: string, username: string) => {
  // Personalize the greeting with the user's name if available
  const greeting = username ? `Hello, ${username}!` : "Hello!";

  return (`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email Address</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: auto; padding: 20px; }
      .button { background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; display: inline-block; border-radius: 5px; text-decoration: none; }
      .footer { margin-top: 20px; font-size: 12px; color: #aaa; }
    </style>
  </head>
  <body>
    <div class="container">
      ${greeting}
      <p>Please click the button below to verify your email address and activate your account. This link will expire in 2 hours and can only be used once.</p>
      
      <a href="${BASE_URL}verify-email?token=${token}" class="button" target="_blank">Verify Email Address</a>
      
      <p>If the button above doesn't work, copy and paste the following link into your web browser:</p>
      <p><a href="${BASE_URL}verify-email?token=${token}" target="_blank">${BASE_URL}verify-email?token=${token}</a></p>
      
      <div class="footer">
        If you did not create an account using this email address, please ignore this email.
      </div>
    </div>
  </body>
  </html>
  `);
};
