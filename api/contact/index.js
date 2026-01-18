let sendgrid = null;

try {
  sendgrid = require("@sendgrid/mail");
} catch (error) {
  sendgrid = null;
}

const getEnv = (name) => process.env[name] && process.env[name].trim();

module.exports = async function (context, req) {
  if (req.method !== "POST") {
    context.res = { status: 405, body: { error: "Method not allowed" } };
    return;
  }

  const payload = req.body || {};
  const name = String(payload.name || "").trim();
  const email = String(payload.email || "").trim();
  const company = String(payload.company || "").trim();
  const message = String(payload.message || "").trim();

  if (!name || !email) {
    context.res = { status: 400, body: { error: "Name and email are required." } };
    return;
  }

  const apiKey = getEnv("SENDGRID_API_KEY");
  const toEmail = getEnv("CONTACT_TO_EMAIL");
  const fromEmail = getEnv("CONTACT_FROM_EMAIL");

  if (!apiKey || !toEmail || !fromEmail || !sendgrid) {
    context.log("Contact form received but email is not configured.");
    context.res = {
      status: 202,
      body: { ok: true, configured: false },
    };
    return;
  }

  sendgrid.setApiKey(apiKey);

  try {
    await sendgrid.send({
      to: toEmail,
      from: fromEmail,
      subject: "Cloud Dudes consultation request",
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\nMessage:\n${message}`,
    });

    context.res = { status: 200, body: { ok: true, configured: true } };
  } catch (error) {
    context.log("SendGrid error:", error);
    context.res = { status: 500, body: { error: "Failed to send message." } };
  }
};
