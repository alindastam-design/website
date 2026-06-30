import { useState, useEffect, useRef } from 'react'
import styles from './Crossword.module.css'

const ROWS = 12
const COLS = 12

/*
  Grid layout (12×12):

       0  1  2  3  4  5  6  7  8  9  10 11
   0:  .  H  U  I  S  S  T  I  J  L  .  .
   1:  O  .  .  .  .  R  .  .  .  .  .  .     ← msg: O, R
   2:  B  R  A  N  D  I  N  G  .  .  M  S
   3:  .  .  .  D  .  .  .  .  .  E  E  T     ← msg: D, E
   4:  S  T  R  A  T  E  G  I  E  .  R  I
   5:  .  .  .  .  .  .  I  .  .  N  K  J     ← msg: I, N
   6:  C  A  M  P  A  G  N  E  .  .  .  L
   7:  .  .  .  .  D  .  .  .  .  E  .  .     ← msg: D, E
   8:  V  I  S  I  E  .  .  .  .  .  .  .
   9:  .  .  C  .  .  H  .  A  .  O  .  S     ← msg: C,H,A,O,S
  10:  C  O  N  T  E  N  T  .  .  .  .  .
  11:  .  .  .  D  E  S  I  G  N  .  .  .
*/

const WORDS = [
  { word: 'HUISSTIJL', row: 0, col: 1, dir: 'H' },
  { word: 'BRANDING',  row: 2, col: 0, dir: 'H' },
  { word: 'STRATEGIE', row: 4, col: 0, dir: 'H' },
  { word: 'CAMPAGNE',  row: 6, col: 0, dir: 'H' },
  { word: 'VISIE',     row: 8, col: 0, dir: 'H' },
  { word: 'CONTENT',   row: 10, col: 0, dir: 'H' },
  { word: 'DESIGN',    row: 11, col: 3, dir: 'H' },
  { word: 'MERK',      row: 2, col: 10, dir: 'V' },
  { word: 'STIJL',     row: 2, col: 11, dir: 'V' },
]

const MESSAGE = [
  { row: 1, col: 0,  letter: 'O' },
  { row: 1, col: 5,  letter: 'R' },
  { row: 3, col: 3,  letter: 'D' },
  { row: 3, col: 9,  letter: 'E' },
  { row: 5, col: 6,  letter: 'I' },
  { row: 5, col: 9,  letter: 'N' },
  { row: 7, col: 4,  letter: 'D' },
  { row: 7, col: 9,  letter: 'E' },
  { row: 9, col: 2,  letter: 'C' },
  { row: 9, col: 5,  letter: 'H' },
  { row: 9, col: 7,  letter: 'A' },
  { row: 9, col: 9,  letter: 'O' },
  { row: 9, col: 11, letter: 'S' },
]

const MSG_SET = new Set(MESSAGE.map(m => `${m.row}-${m.col}`))

function buildGrid() {
  const grid = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ letter: null, isMessage: false, wordIndices: [] }))
  )
  WORDS.forEach(({ word, row, col, dir }, wi) => {
    for (let i = 0; i < word.length; i++) {
      const r = dir === 'V' ? row + i : row
      const c = dir === 'H' ? col + i : col
      grid[r][c].letter = word[i]
      grid[r][c].wordIndices.push(wi)
    }
  })
  MESSAGE.forEach(({ row, col, letter }) => {
    grid[row][col].letter = letter
    grid[row][col].isMessage = true
  })
  return grid
}

const GRID = buildGrid()

export default function Crossword() {
  const [crossedWords, setCrossedWords] = useState(new Set())
  const [showMessage, setShowMessage] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return
    const timers = []
    WORDS.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setCrossedWords(prev => new Set([...prev, i]))
        }, 800 + i * 350)
      )
    })
    timers.push(
      setTimeout(() => setShowMessage(true), 800 + WORDS.length * 350 + 500)
    )
    return () => timers.forEach(clearTimeout)
  }, [isVisible])

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.header}>
        <span className={styles.label}>In één woord</span>
        <h2 className={styles.title}>
          Wat ik voor je <em>doe</em>
        </h2>
      </div>

      <div className={styles.wrapper}>
        <div
          className={`${styles.grid} ${isVisible ? styles.gridVisible : ''}`}
          style={{ '--cols': COLS, '--rows': ROWS }}
        >
          {GRID.map((row, r) =>
            row.map((cell, c) => {
              if (!cell.letter) return null

              const isCrossed = cell.wordIndices.some(wi => crossedWords.has(wi))
              const isMsg = cell.isMessage

              return (
                <div
                  key={`${r}-${c}`}
                  className={[
                    styles.cell,
                    styles.filled,
                    isCrossed && !isMsg ? styles.crossed : '',
                    isMsg && showMessage ? styles.messageCell : '',
                  ].filter(Boolean).join(' ')}
                  style={{ gridRow: r + 1, gridColumn: c + 1 }}
                >
                  <span className={styles.letter}>{cell.letter}</span>
                </div>
              )
            })
          )}

          {WORDS.map((w, i) => {
            if (!crossedWords.has(i)) return null
            const len = w.word.length
            const isH = w.dir === 'H'
            return (
              <div
                key={`strike-${i}`}
                className={`${styles.strike} ${isH ? styles.strikeH : styles.strikeV}`}
                style={{
                  gridRow: isH
                    ? w.row + 1
                    : `${w.row + 1} / ${w.row + len + 1}`,
                  gridColumn: isH
                    ? `${w.col + 1} / ${w.col + len + 1}`
                    : w.col + 1,
                }}
              />
            )
          })}
        </div>
      </div>

      <p className={`${styles.reveal} ${showMessage ? styles.revealVisible : ''}`}>
        orde in de chaos
      </p>
    </section>
  )
}
