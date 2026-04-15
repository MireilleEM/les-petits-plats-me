"use client"
import Header from '../src/components/Header/Header.jsx';
import './globals.css';
import styles from './page.module.css';
import RecipeCard from '../src/components/RecipeCard/RecipeCard.jsx';
import Footer from '../src/components/Footer/Footer.jsx';


  
export default function Home() {

  return (
    <section className="home">
      <Header />
      <div className={styles.recipeContainer}>
        <div className={styles.recipeGrid}> 
        <RecipeCard />
      </div>
      </div>
      <Footer />
    </section>
      
  );
}

 