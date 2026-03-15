import styles from './Marquee.module.css'

export default function Marquee({ text, variant = 'dark' }) {
  const repeated = `${text} \u2014 `

  return (
    <div className={`${styles.wrapper} ${styles[variant]}`}>
      <div className={styles.track}>
        <span className={styles.text}>{repeated.repeat(10)}</span>
        <span className={styles.text} aria-hidden="true">{repeated.repeat(10)}</span>
      </div>
    </div>
  )
}
