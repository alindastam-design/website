import { useEffect, useRef } from 'react'
import reviews from '../data/reviews'
import styles from './Reviews.module.css'

export default function Reviews() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.05 }
    )
    sectionRef.current?.querySelectorAll('.fade-in').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const offsets = [
    { top: '0', left: '20%' },
    { top: '0', left: '55%' },
    { top: '-20px', left: '20%' },
  ]

  return (
    <section id="reviews" className={styles.reviews} ref={sectionRef}>
      <div className={styles.header}>
        <h2 className={`${styles.title} fade-in`}>
          Wat anderen <em>zeggen..</em>
        </h2>
      </div>

      <div className={styles.scattered}>
        {reviews.map((review, i) => (
          <div
            key={review.id}
            className={`${styles.card} fade-in`}
            style={{
              transitionDelay: `${i * 0.12}s`,
              marginTop: offsets[i]?.top || '0',
              marginLeft: offsets[i]?.left || '0',
            }}
          >
            <div className={styles.stars}>
              {'★'.repeat(review.stars)}
            </div>
            <p className={styles.quote}>"{review.quote}"</p>
            <div className={styles.author}>
              <span className={styles.name}>{review.name}</span>
              <span className={styles.role}>{review.role}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
