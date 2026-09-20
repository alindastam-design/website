import { useEffect, useRef } from 'react'
import styles from './Instagram.module.css'
import instagramPost from '../data/instagramPost'

export default function Instagram() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    )
    sectionRef.current?.querySelectorAll('.fade-in').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const embedSrc = `${instagramPost.url.split('?')[0].replace(/\/?$/, '/')}embed`

  return (
    <section className={styles.instagram} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.left}>
          <p className={`${styles.label} fade-in`}>Instagram</p>
          <h2 className={`${styles.title} fade-in`}>Laatste <em>post</em></h2>
          <a
            href={instagramPost.profile}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.follow} fade-in`}
          >
            Volg {instagramPost.handle}
          </a>
        </div>
        <div className={`${styles.postCard} fade-in`} style={{ '--post-aspect': instagramPost.aspect }}>
          <iframe
            src={embedSrc}
            loading="lazy"
            scrolling="no"
            frameBorder="0"
            allowFullScreen
            title={`Instagram-post van ${instagramPost.handle}`}
          />
        </div>
      </div>
    </section>
  )
}
