import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Simple in-memory rate limiter (resets on cold start)
const rateLimit = new Map()
const RATE_LIMIT_MAX = 3        // max 3 berichten
const RATE_LIMIT_WINDOW = 3600000 // per uur (ms)

function isRateLimited(ip) {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimit.set(ip, { start: now, count: 1 })
    return false
  }
  entry.count++
  return entry.count > RATE_LIMIT_MAX
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Te veel berichten. Probeer het later opnieuw.' })
  }

  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Vul alle velden in' })
  }

  try {
    await resend.emails.send({
      // Zolang alindastam.nl niet geverifieerd is in Resend: gebruik onboarding@resend.dev
      // Na domeinverificatie: verander naar 'Portfolio <noreply@alindastam.nl>'
      from: 'Portfolio Contact <noreply@alindastam.nl>',
      to: 'hello@alindastam.nl',
      replyTo: email,
      subject: `Contact via portfolio — ${name}`,
      text: `Naam: ${name}\nEmail: ${email}\n\n${message}`,
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return res.status(500).json({ error: 'Versturen mislukt' })
  }
}
