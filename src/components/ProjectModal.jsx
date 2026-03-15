import { useEffect, useState } from 'react'
import styles from './ProjectModal.module.css'

export default function ProjectModal({ project, onClose }) {
  const [mediaIndex, setMediaIndex] = useState(0)
  const media = project.media || []
  const hasCarousel = media.length > 1

  const prev = () => setMediaIndex((i) => (i - 1 + media.length) % media.length)
  const next = () => setMediaIndex((i) => (i + 1) % media.length)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleEsc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleEsc)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  const renderMedia = () => {
    if (media.length > 0) {
      const item = media[mediaIndex]
      return (
        <div className={styles.carouselWrapper}>
          {item.type === 'video' ? (
            <video
              key={item.src}
              src={item.src}
              className={styles.projectVideo}
              controls
              playsInline
            />
          ) : (
            <img src={item.src} alt={project.title} className={styles.projectImg} />
          )}

          {hasCarousel && (
            <>
              <button className={`${styles.carouselArrow} ${styles.carouselLeft}`} onClick={prev}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className={`${styles.carouselArrow} ${styles.carouselRight}`} onClick={next}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className={styles.dots}>
                {media.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.dot} ${i === mediaIndex ? styles.dotActive : ''}`}
                    onClick={() => setMediaIndex(i)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )
    }

    if (project.image) {
      return <img src={project.image} alt={project.title} className={styles.projectImg} />
    }

    return (
      <div className={styles.imagePlaceholder}>
        <span>{project.category}</span>
      </div>
    )
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Sluiten">
          &times;
        </button>

        {renderMedia()}

        <div className={styles.content}>
          <span className={styles.category}>{project.title}</span>
          <p className={styles.desc}>{project.description}</p>

          {project.results && (
            <div className={styles.results}>
              <ul>
                {project.results.map((r, i) => (
                  <li key={i} className={styles.resultItem}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
