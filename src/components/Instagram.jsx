import { useEffect, useRef } from 'react'
import styles from './Instagram.module.css'
import instagram from '../data/instagramPost'

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

  return (
    <section className={styles.instagram} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.left}>
          <p className={`${styles.label} fade-in`}>Instagram</p>
          <h2 className={`${styles.title} fade-in`}>Volg <em>mij</em></h2>
          <a
            href={instagram.profile}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.follow} fade-in`}
          >
            {instagram.handle}
          </a>
        </div>
        <div className={styles.posts}>
          {instagram.posts.map((post) => (
            <div key={post.url} className={`${styles.postCard} fade-in`} style={{ '--post-aspect': post.aspect, '--post-chrome': post.hideLikes ? '188px' : '212px' }}>
              <iframe
                src={`${post.url.split('?')[0].replace(/\/?$/, '/')}embed`}
                loading="lazy"
                scrolling="no"
                frameBorder="0"
                allowFullScreen
                title={`Instagram-post van ${instagram.handle}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
