import styles from './Quote.module.css'

export default function Quote() {
  return (
    <section className={styles.quote}>
      <div className={styles.inner}>
        <p className={styles.text}>"Nothing great is built alone"</p>
      </div>
    </section>
  )
}
