import { useEffect, useRef, useState } from 'react'
import styles from './Contact.module.css'

export default function Contact() {
  const sectionRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    )
    sectionRef.current?.querySelectorAll('.fade-in').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <section id="contact" className={styles.contact} ref={sectionRef}>
      <div className={styles.content}>
        <div className={`${styles.textCol} fade-in`}>
          <span className={styles.label}>Contact</span>
          <h2 className={styles.title}>
            Let's get <em>in touch!</em>
          </h2>
          <p className={styles.text}>
            Heb je een project in gedachten of wil je gewoon even sparren?
            Stuur me een berichtje!
          </p>

          <div className={styles.links}>
            <a href="mailto:hello@alindastam.nl" className={styles.link}>
              hello@alindastam.nl
            </a>
            <a href="https://www.instagram.com/alindastam" target="_blank" rel="noopener noreferrer" className={styles.link}>
              Instagram
            </a>
            <a href="https://nl.linkedin.com/in/alinda-stam-72608a61" target="_blank" rel="noopener noreferrer" className={styles.link}>
              LinkedIn
            </a>
          </div>
        </div>

        <form className={`${styles.form} fade-in`} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="name" className={styles.fieldLabel}>Naam</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Je naam"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.fieldLabel}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="je@email.nl"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="message" className={styles.fieldLabel}>Bericht</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className={styles.textarea}
              placeholder="Vertel me over je project..."
            />
          </div>
          <button
            type="submit"
            className={styles.submit}
            disabled={status === 'loading' || status === 'success'}
          >
            {status === 'loading' ? 'Versturen…' : status === 'success' ? 'Verstuurd!' : 'Verstuur bericht'}
          </button>

          {status === 'success' && (
            <p className={styles.feedback}>
              Bedankt! Je bericht is verstuurd. Ik neem snel contact op.
            </p>
          )}
          {status === 'error' && (
            <p className={`${styles.feedback} ${styles.feedbackError}`}>
              Er ging iets mis. Probeer het opnieuw of mail direct naar{' '}
              <a href="mailto:hello@alindastam.nl">hello@alindastam.nl</a>.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
