import { useEffect, useRef } from 'react'
import styles from './About.module.css'

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    )
    sectionRef.current?.querySelectorAll('.fade-in').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="over-mij" className={styles.about} ref={sectionRef}>
      <div className={styles.content}>
        <div className={`${styles.imageCol} fade-in`}>
          <img src="/images/alinda-profiel.jpg" alt="Alinda Stam" className={styles.profileImg} />
        </div>

        <div className={`${styles.textCol} fade-in`}>
          <span className={styles.label}>Over mij</span>
          <h2 className={styles.title}>
            Hey <em>hoi!</em>
          </h2>
          <p className={styles.text}>
            Opgegroeid in Friesland, groot geworden met een schaar en een stapel tijdschriften.
            Ik knipte de beste stukken uit elk magazine en plakte ze samen tot mijn eigen perfecte
            editie. En dat doe ik nu nog steeds: losse ideeën samenvoegen tot iets wat klopt.
          </p>
          <p className={styles.text}>
            Die fascinatie voor concepten en beeld is nooit weggegaan. Ik ben Alinda: creatief
            strateeg. Ik help merken en makers om ideeën vorm te geven, van eerste concept tot uitvoering.
          </p>
          <p className={styles.text}>
            Dat kan een evenement zijn, een contentstrategie, een podcastconcept, of een campagne
            die er ook nog eens goed uitziet.
          </p>
          <p className={styles.text}>Nieuwsgierig?</p>
          <a href="#portfolio" className={styles.cta}>Selected work</a>
        </div>
      </div>
    </section>
  )
}
