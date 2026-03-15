import { useEffect, useRef } from 'react'
import styles from './Hero.module.css'

export default function Hero() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    )
    sectionRef.current?.querySelectorAll('.fade-in').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const scrollToContact = (e) => {
    e.preventDefault()
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className={styles.hero} ref={sectionRef}>
      <div className={styles.content}>
        <h1 className={`${styles.title} fade-in`}>
          Hi, <em>welkom!</em>
        </h1>
        <p className={`${styles.subtitle} fade-in`}>
          Ik ben Alinda, creatief strateeg. Ik breng structuur in creatieve chaos en denk net zo makkelijk
          mee over het concept als over de uitvoering, van strategie tot events.
        </p>
        <a href="#contact" className={`${styles.cta} fade-in`} onClick={scrollToContact}>
          Let's get in touch!
        </a>
      </div>
    </section>
  )
}
