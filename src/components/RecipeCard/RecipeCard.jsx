import styles from './RecipeCard.module.css';
import recipes from '../../data/recipes.json';
import Link from 'next/link';
import Image from 'next/image';

const RecipeCard = () => {

  return (
     <>
  {recipes.map((recipe) => (
    <Link key={recipe.id} href={`/recipe/${recipe.slug}`} className={styles.link}>
    <article className={styles.card}>
      
      {/* Image et Temps */}
      <header className={styles.header}>
        <div className={styles.imagePlaceholder}>
          <Image 
            src={`/images-recettes/${recipe.image}`} 
            alt={recipe.name} 
            className={styles.image} 
            /*width={380} 
            height={200}*/
            fill /* REMPLACER WIDTH ET HEIGHT PAR FILL pour le responsive */
            /* L'attribut sizes aide Next.js à charger la bonne qualité d'image selon l'écran */
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </div>
        <span className={styles.timeBadge}>{recipe.time} min</span>
      </header>

      {/* Contenu */}
      <div className={styles.body}>
        <h2 className={styles.title}>{recipe.name}</h2>

        {/* La description de la recette */}
        <section className={styles.section}>
          <h3 className={styles.subtitle}>RECETTE</h3>
          <p className={styles.description}>{recipe.description}</p>
        </section>

        {/* La grille dynamique des ingrédients */}
        <section className={styles.section}>
          <h3 className={styles.subtitle}>INGRÉDIENTS</h3>
          
          <div className={styles.ingredientsGrid}>
            {recipe.ingredients.map((item, index) => (
              <div key={index} className={styles.ingredientItem}>
                <span className={styles.ingredientName}>{item.ingredient}</span>
                {/* On n'affiche la quantité que si elle existe */}
                {item.quantity && (
                  //<span className={styles.ingredientQuantity}>{`${item.quantity} ${item.unit}`}</span>
                  // On gère le cas où l'unité pourrait être absente (ex: "2 oeufs" sans "unit") :
                  <span className={styles.ingredientQuantity}>{item.quantity} {item.unit}</span>
                )}
              </div>
            ))}
          </div>
          
        </section>
      </div>
      
    </article>
  </Link> 
  ))}
  </>
  );
};



export default RecipeCard;