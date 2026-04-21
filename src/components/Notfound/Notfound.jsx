import styles from './Notfound.module.css';




export default function Notfound() {
  return (
    <header className={styles.nfHeader}>
      <div className={styles.logo}>
        {/*LES PETITS PLATS <span style={{fontSize: '0.8rem'}}>⦿</span>*/}
        <img src="/logo/logo.png" alt="Logo Les Petits Plats" className={styles.logoImage} />
      </div>
      <div className={styles.errorImageContainer}>

      <h1 className={styles.title}>
        404 :(
      </h1>
      <h2 className={styles.subtitle}>
        La page que vous demandez est introuvable.
      </h2>

    </div>

    </header>
  );
}