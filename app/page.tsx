"use client"
import { useState, useMemo, useCallback } from 'react';
import Header from '../src/components/Header/Header.jsx';
import './globals.css';
import styles from './page.module.css';
import RecipeCard from '../src/components/RecipeCard/RecipeCard.jsx';
import TagFilter from '../src/components/TagFilter/TagFilter.jsx';
import Footer from '../src/components/Footer/Footer.jsx';
import allRecipes from '../src/data/recipes.json';

// ─── Normalisation (accents + casse) ────────────────────────────────────────
function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// ─── Debounce hook ──────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react';
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function Home() {
  // ── State ────────────────────────────────────────────────────────────────
  const [searchText, setSearchText] = useState('');
  const [selectedTags, setSelectedTags] = useState({
    ingredients: [],
    appareils: [],
    ustensiles: [],
  });

  const debouncedSearch = useDebounce(searchText, 300);

  // ── Filtrage des recettes ────────────────────────────────────────────────
  const filteredRecipes = useMemo(() => {
    let results = allRecipes;

    // 1. Recherche principale (≥ 3 caractères)
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
      });
    }

    // 2. Filtres par tags
    const { ingredients, appareils, ustensiles } = selectedTags;

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
  const handleTagSelect = useCallback((category, tag) => {
    setSelectedTags((prev) => ({
      ...prev,
      [category]: prev[category].includes(tag)
        ? prev[category]
        : [...prev[category], tag],
    }));
  }, []);

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
        </div>
      </div>

      <Footer />
    </section>
  );
}
