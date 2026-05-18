"use client"
import { useState, useRef, useEffect } from 'react';
import styles from './TagFilter.module.css';

// ─── Sous-composant : un dropdown pour une catégorie ─────────────────────────
function TagDropdown({ label, tags, selectedTags, onTagSelect, onTagRemove, category }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const ref = useRef(null);

  // Ferme le dropdown si on clique en dehors
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
        setSearchInput('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrage interne dans le dropdown
  const filtered = tags.filter((tag) =>
    tag.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className={styles.dropdownWrapper} ref={ref}>
      <button
        className={`${styles.dropdownButton} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen((v) => !v)}
        type="button"
      >
        <span>{label}</span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronUp : ''}`}
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdownPanel}>
          {/* Champ de recherche dans le dropdown */}
          <div className={styles.dropdownSearch}>
            <input
              type="text"
              placeholder={`Rechercher un ${label.toLowerCase()}...`}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={styles.dropdownInput}
              autoFocus
            />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#aaa" strokeWidth="2" className={styles.searchIcon}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          {/* Liste des tags disponibles */}
          <ul className={styles.tagList}>
            {filtered.length === 0 && (
              <li className={styles.noResult}>Aucun résultat</li>
            )}
            {filtered.map((tag) => (
              <li
                key={tag}
                className={styles.tagItem}
                onClick={() => {
                  onTagSelect(category, tag);
                  setIsOpen(false);
                  setSearchInput('');
                }}
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Composant principal TagFilter ────────────────────────────────────────────
export default function TagFilter({ availableTags, selectedTags, onTagSelect, onTagRemove, recipeCount }) {

  // Tous les tags sélectionnés (toutes catégories confondues) pour les chips
  const allSelected = [
    ...selectedTags.ingredients.map((t) => ({ tag: t, category: 'ingredients' })),
    ...selectedTags.appareils.map((t) => ({ tag: t, category: 'appareils' })),
    ...selectedTags.ustensiles.map((t) => ({ tag: t, category: 'ustensiles' })),
  ];

  return (
    <div className={styles.filterBar}>
      <div className={styles.topRow}>
        <div className={styles.dropdowns}>
          <TagDropdown
            label="Ingrédients"
            tags={availableTags.ingredients}
            selectedTags={selectedTags.ingredients}
            onTagSelect={onTagSelect}
            onTagRemove={onTagRemove}
            category="ingredients"
          />
          <TagDropdown
            label="Appareils"
            tags={availableTags.appareils}
            selectedTags={selectedTags.appareils}
            onTagSelect={onTagSelect}
            onTagRemove={onTagRemove}
            category="appareils"
          />
          <TagDropdown
            label="Ustensiles"
            tags={availableTags.ustensiles}
            selectedTags={selectedTags.ustensiles}
            onTagSelect={onTagSelect}
            onTagRemove={onTagRemove}
            category="ustensiles"
          />
        </div>

        {/* Compteur de recettes — même ligne que les dropdowns, aligné à droite */}
        <p className={styles.recipeCount}>
          {recipeCount} recette{recipeCount > 1 ? 's' : ''}
        </p>
      </div>

      {/* Chips des tags sélectionnés */}
      {allSelected.length > 0 && (
        <div className={styles.selectedTags}>
          {allSelected.map(({ tag, category }) => (
            <span key={`${category}-${tag}`} className={styles.chip}>
              {tag}
              <button
                className={styles.chipRemove}
                onClick={() => onTagRemove(category, tag)}
                type="button"
                aria-label={`Supprimer le filtre ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
