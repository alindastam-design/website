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

const ALLOWED_ORIGINS = ['https://www.alindastam.nl', 'https://alindastam.nl']
function originAllowed(origin) {
  if (!origin) return false
  if (ALLOWED_ORIGINS.includes(origin)) return true
  if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return true
  return /^https:\/\/alinda-stam-portfolio[a-z0-9-]*\.vercel\.app$/.test(origin)
}

const MIN_FILL_TIME = 4000 // ms: sneller dan dit invullen doet geen mens
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Bekende spam-signalen: meerdere links, SEO/crypto-aanbiedingen, cyrillisch
const SPAM_PATTERNS = [
  /(https?:\/\/|www\.)[^\s]+.*(https?:\/\/|www\.)[^\s]+/is, // 2+ links
  /\b(seo|backlinks?|guest post|link building|domain authority|google ranking)\b/i,
  /\b(crypto|bitcoin|forex|casino|viagra|cialis|loan offer)\b/i,
  /[Ѐ-ӿ]{4,}/, // cyrillisch
]

function looksLikeSpam({ name, email, message }) {
  const text = `${name}\n${email}\n${message}`
  if (!EMAIL_RE.test(email)) return 'ongeldig e-mailadres'
  if (name.length > 100 || email.length > 200 || message.length > 5000) return 'te lang'
  if (message.trim().length < 10) return 'te kort'
  if (/https?:\/\/|www\./i.test(name)) return 'link in naam'
  if (/https?:\/\/|www\./i.test(email)) return 'link in e-mail'
  for (const re of SPAM_PATTERNS) if (re.test(text)) return 'spampatroon'
  return null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Te veel berichten. Probeer het later opnieuw.' })
  }

  const { name, email, message, website, startedAt } = req.body || {}

  // Herkomstcontrole: alleen vanaf de eigen site, niet rechtstreeks naar de API
  if (!originAllowed(req.headers.origin)) {
    return res.status(403).json({ error: 'Niet toegestaan' })
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Vul alle velden in' })
  }

  // Honeypot ingevuld of formulier te snel verstuurd: doen alsof het gelukt is,
  // zodat bots niets leren
  const fillTime = Date.now() - Number(startedAt || 0)
  if (website || !startedAt || fillTime < MIN_FILL_TIME) {
    console.log('Spam geblokkeerd (honeypot/tijd)', { ip, website: !!website, fillTime })
    return res.status(200).json({ success: true })
  }

  const spamReason = looksLikeSpam({ name: String(name), email: String(email), message: String(message) })
  if (spamReason) {
    console.log('Spam geblokkeerd', { ip, spamReason })
    return res.status(200).json({ success: true })
  }

  try {
    const { error } = await resend.emails.send({
      // Zolang alindastam.nl niet geverifieerd is in Resend: gebruik onboarding@resend.dev
      // Na domeinverificatie: verander naar 'Portfolio <noreply@alindastam.nl>'
      from: 'Portfolio Contact <noreply@alindastam.nl>',
      to: 'hello@alindastam.nl',
      replyTo: email,
      subject: `Contact via portfolio — ${name}`,
      text: `Naam: ${name}\nEmail: ${email}\n\n${message}`,
    })
    if (error) {
      console.error('Resend error:', error)
      return res.status(500).json({ error: 'Versturen mislukt' })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return res.status(500).json({ error: 'Versturen mislukt' })
  }
}
