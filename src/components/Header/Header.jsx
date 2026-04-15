import styles from './Header.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Image from 'next/image';


export default function Header() {
  return (
    <header className={styles.header}>


{/* L'IMAGE DE FOND OPTIMISÉE pour la rapidité de chargement */}
      <Image 
        src='/images/home.jpg' 
        alt="Bandeau Les Petits Plats"
        fill /* Remplit le conteneur */
        className={styles.backgroundImage}
        priority /* Dit à Next.js de charger cette image EN PRIORITÉ ABSOLUE car elle est tout en haut de la page */
        unoptimized
      />

      <div className={styles.logo}>
        {/*LES PETITS PLATS */}
        <img src="/logo/logo.png" alt="Logo Les Petits Plats" className={styles.logoImage} />
      </div>
s
      <h1 className={styles.title}>
        Découvrez nos recettes du quotidien, simples et délicieuses
      </h1>

      <div className={styles.searchContainer}>
        <input 
          type="text" 
          placeholder="Rechercher une recette, un ingrédient, ..." 
          className={styles.searchInput}
        />
        <button className={styles.searchButton}>
          <FontAwesomeIcon
            icon={faSearch}
            className={styles.searchIcon}
          />
        </button>
      </div>

    </header>
  );
}