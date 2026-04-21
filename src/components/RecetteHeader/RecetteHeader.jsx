import styles from './RecetteHeader.module.css';



export default function RecetteHeader() {
  return (
    <header className={styles.recetteHeader}>
      <div className={styles.logo}>
        {/*LES PETITS PLATS <span style={{fontSize: '0.8rem'}}>⦿</span>*/}
        <img src="/logo/logo.png" alt="Logo Les Petits Plats" className={styles.logoImage} />
      </div>

    </header>
  );
}