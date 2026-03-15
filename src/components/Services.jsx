import { useEffect, useRef } from 'react'
import services from '../data/services'
import styles from './Services.module.css'

export default function Services() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.05 }
    )
    sectionRef.current?.querySelectorAll('.fade-in').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="diensten" className={styles.services} ref={sectionRef}>
      <div className={styles.header}>
        <h2 className={styles.title}>Wat kan ik voor je <em>doen?</em></h2>
      </div>
      <div className={styles.grid}>
        {services.map((service, i) => (
          <div
            key={service.id}
            className={`${styles.card} fade-in`}
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            <span className={styles.number}>{service.number}</span>
            <h3 className={styles.cardTitle}>{service.title}</h3>
            <p className={styles.cardDesc}>{service.description}</p>
            <div className={styles.cardLine} />
          </div>
        ))}
      </div>
    </section>
  )
}
