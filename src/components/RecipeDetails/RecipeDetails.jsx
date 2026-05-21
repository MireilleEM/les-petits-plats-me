import styles from './RecipeDetails.module.css';
import recipes from '../../data/recipes.json';


const RecipeDetails = ({ recipe }) => {

  return (
      
    <article key={recipe.id} className={styles.recipeCard}>
      
      {/* COLONNE GAUCHE : L'image */}
      <div className={styles.imageColumn}>
        <img 
          src={`/images-recettes/${recipe.image}`} 
          alt={recipe.name} 
          className={styles.mainImage}
        />
      </div>

      {/* COLONNE DROITE : Les informations */}
      <div className={styles.infoColumn}>
        
        <h1 className={styles.mainTitle}>{recipe.name}</h1>

        {/* Bloc Temps */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>TEMPS DE PRÉPARATION</h2>
          <span className={styles.timeBadge}>{recipe.time} min</span>
        </section>

        {/* Bloc Ingrédients (Grille de 3) */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>INGRÉDIENTS</h2>
          <div className={styles.grid}>
          

{recipe.ingredients.map((item, index) => (
              <div key={index} className={styles.ingredientItem}> 
              
              <span className={styles.itemName}>{item.ingredient} </span>
              <div>
              <span className={styles.itemQuantity}>{item.quantity} </span>
              <span className={styles.itemUnit}>{item.unit}</span>
              </div>
            </div>
        
          ))}
 
        </div>
        </section>
       

        {/* Bloc Ustensiles */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>USTENSILES NÉCESSAIRES</h2>
          <div className={styles.grid}>
            {recipe.ustensils.map((ustensil, index) => (
              <span key={index} className={styles.itemName}>
                {ustensil}
              </span>
            ))}
          </div>
        </section>

                {/* Bloc Appliance */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>APPAREILS NÉCESSAIRES</h2>
          <div className={styles.grid}>
           {/* {recipe.appliance.map((appliance, index) => (*/}
              <span className={styles.itemName}>
                {recipe.appliance}
              </span>
            {/*)
            )}*/}
          </div>
        </section>

            {/* Bloc de la recette */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>RECETTE</h2>
          <div >
              <span className={styles.itemName}>
                {recipe.description}
              </span>
            
          </div>
        </section>


      </div>
    </article>
    
)};  


export default RecipeDetails;