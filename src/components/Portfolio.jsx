import { useEffect, useRef, useState } from 'react'
import projects from '../data/projects'
import ProjectModal from './ProjectModal'
import styles from './Portfolio.module.css'

const VISIBLE = 3

export default function Portfolio() {
  const sectionRef = useRef(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [startIndex, setStartIndex] = useState(0)

  const prev = () => setStartIndex((i) => (i - 1 + projects.length) % projects.length)
  const next = () => setStartIndex((i) => (i + 1) % projects.length)

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

          <div className={styles.columns} key={startIndex}>
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
                      className={`${styles.projectImg} ${project.fit === 'contain' ? styles.projectImgContain : ''}`}
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
