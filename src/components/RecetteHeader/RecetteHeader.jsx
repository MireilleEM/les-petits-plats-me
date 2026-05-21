import styles from './RecetteHeader.module.css';



export default function RecetteHeader() {
  return (
    <header className={styles.recetteHeader}>
      <div className={styles.logo}>
        <img src="/logo/logo.png" alt="Logo Les Petits Plats" className={styles.logoImage} />
      </div>

    </header>
  );
}