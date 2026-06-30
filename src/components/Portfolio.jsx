import { useEffect, useRef, useState } from 'react'
import projects from '../data/projects'
import ProjectModal from './ProjectModal'
import styles from './Portfolio.module.css'

function useVisibleCount() {
  const [count, setCount] = useState(window.innerWidth <= 480 ? 1 : 3)
  useEffect(() => {
    const onResize = () => setCount(window.innerWidth <= 480 ? 1 : 3)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return count
}

export default function Portfolio() {
  const sectionRef = useRef(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [startIndex, setStartIndex] = useState(0)
  const VISIBLE = useVisibleCount()
  const touchRef = useRef({ startX: 0, startY: 0 })

  const prev = () => setStartIndex((i) => (i - 1 + projects.length) % projects.length)
  const next = () => setStartIndex((i) => (i + 1) % projects.length)

  const handleTouchStart = (e) => {
    touchRef.current.startX = e.touches[0].clientX
    touchRef.current.startY = e.touches[0].clientY
    touchRef.current.swiping = false
  }

  const handleTouchMove = (e) => {
    const dx = Math.abs(e.touches[0].clientX - touchRef.current.startX)
    const dy = Math.abs(e.touches[0].clientY - touchRef.current.startY)
    if (dx > 10 && dx > dy) {
      touchRef.current.swiping = true
      e.preventDefault()
    }
  }

  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchRef.current.startX
    if (touchRef.current.swiping && Math.abs(dx) > 50) {
      if (dx < 0) next()
      else prev()
    }
  }

  const visibleProjects = Array.from({ length: VISIBLE }, (_, i) =>
    projects[(startIndex + i) % projects.length]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.05 }
    )
    sectionRef.current?.querySelectorAll('.fade-in').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <section id="portfolio" className={styles.portfolio} ref={sectionRef}>
        <span className={styles.sectionLabel}>Selected work</span>
        <div className={styles.slider}>
          <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="Vorige">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className={styles.columns} key={startIndex} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            {visibleProjects.map((project) => (
              <div
                key={project.id}
                className={styles.column}
                onClick={() => setSelectedProject(project)}
              >
                <div className={styles.photo}>
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className={styles.projectImg}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder} />
                  )}
                  <div className={styles.overlay}>
                    <span className={styles.label}>{project.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="Volgende">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  )
}
