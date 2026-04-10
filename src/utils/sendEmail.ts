/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from "fs";
import * as path from "path";
import nodemailer from "nodemailer";
import Handlebars from "handlebars";
import config from "../config";

const ReadFile = fs.promises.readFile;

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  templateData?: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    encoding?: string;
    contentType?: string;
  }>;
}

interface EmailTemplate {
  compile: (data: any) => string;
}

// Cache for compiled templates
const templateCache = new Map<string, EmailTemplate>();

// ============================
// TRANSPORTER CREATION
// ============================
const createTransporter = async () => {
  const host = config.email_host || "smtp.gmail.com";
  const port = Number(config.email_port || 587);
  const user = config.user_email;
  const pass = config.email_password;

  if (!user || !pass) {
    throw new Error("Email credentials (USER_EMAIL/EMAIL_PASSWORD) are not configured in .env");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
  });

  await transporter.verify();
  return { transporter, user };
};

// ============================
// COMPILE TEMPLATE
// ============================
export const compileTemplate = async (
  templateName: string,
  data: Record<string, any> = {}
): Promise<string> => {
  try {
    if (templateCache.has(templateName)) {
      return templateCache.get(templateName)!.compile(data);
    }

    // Path updated to look into src/templates/emails
    const templatesDir = path.join(process.cwd(), "src", "templates", "emails");
    const templatePath = path.join(templatesDir, `${templateName}.hbs`);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found: ${templatePath}`);
    }

    const templateContent = await ReadFile(templatePath, "utf-8");
    const compiled = Handlebars.compile(templateContent);

    templateCache.set(templateName, { compile: compiled });
    return compiled(data);
  } catch (error) {
    console.error(`Failed to compile template ${templateName}:`, error);
    throw new Error(`Template compilation failed: ${templateName}`);
  }
};

// ============================
// SEND EMAIL
// ============================
export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  template,
  templateData = {},
  attachments = [],
}: SendEmailOptions) => {
  try {
    const { transporter, user } = await createTransporter();

    let finalHtml = html;

    if (template && !html) {
      finalHtml = await compileTemplate(template, templateData);
    }

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"Code Biruni Support" <${user}>`,
      to: Array.isArray(to) ? to.join(",") : to,
      subject,
      text: text || (finalHtml ? finalHtml.replace(/<[^>]*>/g, "") : ""),
      html: finalHtml,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};

// ============================
// PREDEFINED EMAIL TEMPLATES
// ============================
export const EmailTemplates = {
  // OTP Verification
  sendOtpEmail: async (to: string, otp: string, userName?: string) => {
    return sendEmail({
      to,
      subject: "Verification Code - Code Biruni",
      template: "otp-verification",
      templateData: {
        otp,
        userName: userName || "Developer",
        verificationUrl: `${config.frontend_url}/verify-email`,
        currentYear: new Date().getFullYear(),
      },
    });
  },

  // Welcome Email
  sendWelcomeEmail: async (to: string, userName: string) => {
    return sendEmail({
      to,
      subject: "Welcome to Code Biruni Ecosystem!",
      template: "welcome",
      templateData: {
        userName,
        version: "1.0.0",
        currentYear: new Date().getFullYear(),
      },
    });
  },

  // Password Reset
  sendPasswordResetEmail: async (to: string, resetToken: string, userName?: string) => {
    const resetUrl = `${config.frontend_url}/reset-password?token=${resetToken}`;
    return sendEmail({
      to,
      subject: "Reset Your Password - Code Biruni",
      template: "password-reset",
      templateData: {
        userName: userName || "User",
        resetUrl,
        expiryTime: "1 Hour",
        currentYear: new Date().getFullYear(),
      },
    });
  },

  // Password Success
  sendPasswordSuccessEmail: async (to: string, userName: string) => {
    return sendEmail({
      to,
      subject: "Password Changed Successfully",
      template: "password-changed-success",
      templateData: {
        userName,
        currentYear: new Date().getFullYear(),
      },
    });
  },

  // Security Alert
  sendSecurityAlertEmail: async (to: string, userName: string, loginDetails: any) => {
    return sendEmail({
      to,
      subject: "Security Alert: New Login Detected",
      template: "security-alert",
      templateData: {
        userName,
        deviceType: loginDetails.device || "Unknown Device",
        browserName: loginDetails.browser || "Unknown Browser",
        location: loginDetails.location || "Unknown Location",
        ipAddress: loginDetails.ip || "0.0.0.0",
        loginTime: new Date().toLocaleString(),
        secureAccountUrl: `${config.frontend_url}/security-settings`,
        currentYear: new Date().getFullYear(),
      },
    });
  },

  // Subscription
  sendSubscriptionEmail: async (to: string, userName: string, subDetails: any) => {
    return sendEmail({
      to,
      subject: "Payment Confirmation - Code Biruni",
      template: "subscription",
      templateData: {
        userName,
        planName: subDetails.planName,
        amount: subDetails.amount,
        transactionId: subDetails.transactionId,
        currentYear: new Date().getFullYear(),
      },
    });
  },

  // General Notification
  sendNotificationEmail: async (
    to: string | string[],
    title: string,
    message: string,
    userName?: string,
    actionUrl?: string,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ) => {
    const priorityClass = `priority-${priority}`;
    return sendEmail({
      to,
      subject: title,
      template: "notification",
      templateData: {
        userName: userName || "User",
        title,
        message,
        actionUrl,
        priorityClass,
        notificationDate: new Date().toLocaleDateString(),
        currentYear: new Date().getFullYear(),
      },
    });
  },
};

export default EmailTemplates;