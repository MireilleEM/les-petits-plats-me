
// 1. On remonte de 3 dossiers (../../../) puis on descend dans src/components/...
import Footer from '../../../src/components/Footer/Footer.jsx'; 
import RecetteHeader from '../../../src/components/RecetteHeader/RecetteHeader.jsx';

// 2. Le fichier page.module.css est dans app/, donc on remonte juste de 2 dossiers (../../)
import styles from '../../page.module.css';


// 3. Le dossier data est à la racine, donc on remonte de 3 dossiers (../../../)
import recipes from '../../../src/data/recipes.json';

// 4. Pareil que pour le Footer, on remonte de 3 dossiers pour trouver src/components/...
import RecipeDetails from '../../../src/components/RecipeDetails/RecipeDetails.jsx';
import Notfound from '../../../src/components/Notfound/Notfound.jsx';



export default async function RecipePage({ params }) {
  // On extrait le 'slug' de l'URL 
    const {slug} = await params;
    const choosedRecipe = recipes.find((recipe) => recipe.slug === slug); 


if (!choosedRecipe) {
    return (
      <>
        <main>
          <Notfound /> {/* On affiche le composant d'erreur */}
        </main>
        <Footer />
      </>
    );
  }

      return (
        <>
        <main>
          <RecetteHeader />
          <RecipeDetails recipe={choosedRecipe} />
                 
        </main>
        <Footer />
        </>
      );
    }




// Next.js nous donne automatiquement accès aux "params" de l'URL
//export default function RecipeDetails({ params }) {
  
  // 1. On récupère le bout de l'URL (le slug ou l'id)
  //const identifiant = params.slug;

  // 2. On cherche dans le JSON la recette qui correspond
  // (Adapte .slug par .id si ton JSON utilise des IDs dans l'URL)
  //const recipeToShow = recipes.find((r) => r.slug === identifiant || r.id.toString() === identifiant);

  // 3. Sécurité : si la recette n'existe pas
  //if (!recipeToShow) {
  //  return <h1 style={{ textAlign: 'center', marginTop: '50px' }}>Recette introuvable 😢</h1>;
  /*}*/

  // 4. Si on l'a trouvée, on affiche notre composant en lui passant les données !
  //return (
  //  <main>
   //   <RecipeDetails recipe={recipeToShow} />
   // </main>
 // );
//}


