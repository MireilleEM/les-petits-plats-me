"use client"
import { useState, useMemo, useCallback } from 'react';
import Header from '../src/components/Header/Header.jsx';
import './globals.css';
import styles from './page.module.css';
import RecipeCard from '../src/components/RecipeCard/RecipeCard.jsx';
import TagFilter from '../src/components/TagFilter/TagFilter.jsx';
import Footer from '../src/components/Footer/Footer.jsx';
import allRecipes from '../src/data/recipes.json'; //page.tsx est le seul à avoir accès au JSON brut

//page.tsx est le seul endroit qui sait tout : ce qui est tapé, quels tags sont actifs, quelles recettes afficher
//Les enfants reçoivent ce dont ils ont besoin via les props
//Les enfants remontent les actions de l'utilisateur via les callbacks
//React réaffiche automatiquement dès que le state change

// ─── Fonction de normalisation (accents + casse) ────────────────────────────────────────
function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// ─── Debounce hook : fonction "sans rebond :Sans debounce, si on tape "poulet" lettre par lettre, le filtrage se déclencherait 6 fois. Avec debounce, il attend qu'on ait arrêté de taper pendant 300ms avant de filtrer.──────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react';
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  // useEffect: exécute du code après un réaffichage, quand certaines valeurs changent
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function Home() {
  // ── State : retient une valeur et déclenche un réaffichage quand elle change ────────────────────────────────────────────────────────────────

  const [searchText, setSearchText] = useState('');
//searchText = la valeur actuelle que l'utilisateur a tapé dans la barre de recherche.
//setSearchText = la fonction pour le modifier 

//selectedTags = un objet qui contient les tags actifs pour chaque catégorie. Au départ tout est vide. Si on sélectionne "Blender" dans Appareils, ça change :
  const [selectedTags, setSelectedTags] = useState({
    ingredients: [],
    appareils: [],//appareils: ['Blender']
    ustensiles: [],
  });

  const debouncedSearch = useDebounce(searchText, 300);
//C'est la version "ralentie" de searchText. C'est cette valeur qu'on utilise pour filtrer, pas searchText directement
  
  // ── Filtrage des recettes ────────────────────────────────────────────────
  //useMemo dit à React : "recalcule ce résultat uniquement si debouncedSearch ou selectedTags ont changé". Sans ça, React recalculerait les recettes filtrées à chaque réaffichage même inutile, ce qui serait une perte de performance.
 
  const filteredRecipes = useMemo(() => {
    let results = allRecipes;

     //À l'intérieur, le filtrage se fait en deux étapes :
    //Étape 1 — recherche texte (si ≥ 3 caractères)
    if (debouncedSearch.trim().length >= 3) {
      const q = normalize(debouncedSearch.trim());
      results = results.filter((recipe) => {
        const inName        = normalize(recipe.name).includes(q);
        const inDescription = normalize(recipe.description).includes(q);
        const inIngredients = recipe.ingredients.some((i) =>
          normalize(i.ingredient).includes(q)
        );
        const inAppliance   = normalize(recipe.appliance).includes(q);
        const inUstensils   = recipe.ustensils.some((u) =>
          normalize(u).includes(q)
        );
        return inName || inDescription || inIngredients || inAppliance || inUstensils;
      });//On garde une recette si le mot recherché apparaît dans au moins un de ces champs. Le || signifie "ou".
    }

    // Étape 2 — filtrage par tags : on ne garde que les recettes qui contiennent tous les tags sélectionnés dans chaque catégorie. Le && signifie "et".
    const { ingredients, appareils, ustensiles } = selectedTags;
    //(every = la recette doit contenir tous les tags sélectionnés.
    //some = il suffit qu'un ingrédient de la recette corresponde au tag.)
    //some parcourt le tableau et pose la question : "est-ce qu'au moins un élément répond à cette condition ?". Il s'arrête dès qu'il trouve un true
    //filter — garde uniquement les éléments qui répondent à la condition :
    //map: transforme chaque élément 
  
    if (ingredients.length > 0) {
      results = results.filter((recipe) =>
        ingredients.every((tag) =>
          recipe.ingredients.some((i) =>
            normalize(i.ingredient) === normalize(tag)
          )
        )
      );
    }
    if (appareils.length > 0) {
      results = results.filter((recipe) =>
        appareils.every((tag) => normalize(recipe.appliance) === normalize(tag))
      );
    }
    if (ustensiles.length > 0) {
      results = results.filter((recipe) =>
        ustensiles.every((tag) =>
          recipe.ustensils.some((u) => normalize(u) === normalize(tag))
        )
      );
    }

    return results;
  }, [debouncedSearch, selectedTags]);

  // ── Tags disponibles (calculés depuis les recettes filtrées) ─────────────
  const availableTags = useMemo(() => {
    const ingredients = [
      ...new Set(
        filteredRecipes.flatMap((r) => r.ingredients.map((i) => i.ingredient))
      ),
    ].filter((t) => !selectedTags.ingredients.includes(t));

    const appareils = [
      ...new Set(filteredRecipes.map((r) => r.appliance)),
    ].filter((t) => !selectedTags.appareils.includes(t));

    const ustensiles = [
      ...new Set(filteredRecipes.flatMap((r) => r.ustensils)),
    ].filter((t) => !selectedTags.ustensiles.includes(t));

    return { ingredients, appareils, ustensiles };
  }, [filteredRecipes, selectedTags]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  //useCallback = comme useMemo, c'est une optimisation de performance  ça évite de recréer la fonction à chaque réaffichage.
  const handleTagSelect = useCallback((category, tag) => {
    setSelectedTags((prev) => ({
      ...prev, //...prev = on garde tout ce qu'il y avait avant et on ajoute juste le nouveau tag
      [category]: prev[category].includes(tag)
        ? prev[category]
        : [...prev[category], tag],
    }));
  }, []);

  //C'est la fonction qui s'exécute quand on clique sur le × d'un tag. Elle retire le tag de la catégorie concernée
  const handleTagRemove = useCallback((category, tag) => {
    setSelectedTags((prev) => ({
      ...prev,
      [category]: prev[category].filter((t) => t !== tag),
    }));
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <section className="home">
      <Header searchText={searchText} onSearchChange={setSearchText} />

      {/* Zone des filtres par tags, comptage recettes filtrées pour l'afficher dans TagFilter, afin que l'utilisateur sache combien de recettes correspondent à sa recherche et ses filtres*/}
      
      <TagFilter
        availableTags={availableTags}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
        onTagRemove={handleTagRemove}
        recipeCount={filteredRecipes.length} 
      />

      {/* Grille de recettes */}
      <div className={styles.recipeContainer}>
        <div className={styles.recipeGrid}>
          <RecipeCard recipes={filteredRecipes} />
          {/* On donne à RecipeCard uniquement les recettes déjà filtrées. Il ne sait pas qu'il en existe d'autres. */}
        </div>
      </div>

      <Footer />
    </section>
  );
}
