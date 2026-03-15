import { useEffect, useRef } from 'react'
import styles from './LinkedIn.module.css'
import linkedinPosts from '../data/linkedinPosts'

export default function LinkedIn() {
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
    <section className={styles.linkedin} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.left}>
          <p className={`${styles.label} fade-in`}>LinkedIn</p>
          <h2 className={`${styles.title} fade-in`}>Recente <em>posts</em></h2>
        </div>
        <div className={styles.posts}>
          {linkedinPosts.map((post) => (
            <div key={post.id} className={`${styles.postCard} fade-in`} style={{ height: post.height * 0.7 }}>
              <iframe
                src={post.src}
                width="504"
                height={post.height}
                frameBorder="0"
                allowFullScreen
                title={`LinkedIn post ${post.id}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
