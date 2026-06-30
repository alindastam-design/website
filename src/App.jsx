import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import Reviews from './components/Reviews'
import Contact from './components/Contact'
import Crossword from './components/Crossword'
import Footer from './components/Footer'
import styles from './App.module.css'

export default function App() {
  return (
    <div className={styles.app}>
      <Navbar />
      <Hero />
      <Portfolio />
{/* <Crossword /> */}
      <About />
      <Services />
{/* <Reviews /> */}
      <Contact />
      <Footer />
    </div>
  )
}
