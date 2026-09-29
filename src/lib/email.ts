// Welcome email via EmailJS REST API. The password is intentionally NOT sent.
export async function sendWelcomeEmail(toEmail: string, accountId: string): Promise<void> {
  const { VITE_EMAILJS_SERVICE_ID: s, VITE_EMAILJS_TEMPLATE_ID: t, VITE_EMAILJS_PUBLIC_KEY: k } = import.meta.env;
  if (!s || !t || !k) return console.warn('EmailJS not configured; skipping welcome email.');
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ service_id: s, template_id: t, user_id: k, template_params: { to_email: toEmail, account_id: accountId } }),
  });
  if (!res.ok) throw new Error('Welcome email failed to send.');
}
