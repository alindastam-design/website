import styles from './Footer.module.css'

export default function Footer() {
  const scrollToTop = (e) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.left}>
          <span className={styles.name}>Alinda Stam</span>
          <span className={styles.copy}>&copy; {new Date().getFullYear()} Alle rechten voorbehouden</span>
        </div>

        <div className={styles.center}>
          <a href="https://www.instagram.com/alindastam" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://nl.linkedin.com/in/alinda-stam-72608a61" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:hello@alindastam.nl">Email</a>
        </div>

        <div className={styles.right}>
          <a href="#" onClick={scrollToTop} className={styles.topBtn}>
            Terug naar boven &uarr;
          </a>
        </div>
      </div>
    </footer>
  )
}
