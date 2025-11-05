import { useState } from 'react';
import '../styles/filters.css';

const ProductFilters = ({ onFilterChange, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    onFilterChange({ category, priceRange, sortBy });
  };

  const handlePriceChange = (range) => {
    setPriceRange(range);
    onFilterChange({ category: selectedCategory, priceRange: range, sortBy });
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    onFilterChange({ category: selectedCategory, priceRange, sortBy: sort });
  };

  const handleReset = () => {
    setSelectedCategory('all');
    setPriceRange('all');
    setSortBy('default');
    onFilterChange({ category: 'all', priceRange: 'all', sortBy: 'default' });
  };

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h3>Filtres</h3>
        <button onClick={handleReset} className="btn-reset-filters">
          Réinitialiser
        </button>
      </div>

      <div className="filter-section">
        <h4>Catégorie</h4>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="radio"
              name="category"
              value="all"
              checked={selectedCategory === 'all'}
              onChange={() => handleCategoryChange('all')}
            />
            <span>Tous les produits</span>
          </label>
          {categories.map((category) => (
            <label key={category} className="filter-option">
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={() => handleCategoryChange(category)}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Prix</h4>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="radio"
              name="price"
              value="all"
              checked={priceRange === 'all'}
              onChange={() => handlePriceChange('all')}
            />
            <span>Tous les prix</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="price"
              value="0-30"
              checked={priceRange === '0-30'}
              onChange={() => handlePriceChange('0-30')}
            />
            <span>Moins de 30€</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="price"
              value="30-60"
              checked={priceRange === '30-60'}
              onChange={() => handlePriceChange('30-60')}
            />
            <span>30€ - 60€</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="price"
              value="60-100"
              checked={priceRange === '60-100'}
              onChange={() => handlePriceChange('60-100')}
            />
            <span>60€ - 100€</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="price"
              value="100+"
              checked={priceRange === '100+'}
              onChange={() => handlePriceChange('100+')}
            />
            <span>Plus de 100€</span>
          </label>
        </div>
      </div>

      <div className="filter-section">
        <h4>Trier par</h4>
        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="filter-select"
        >
          <option value="default">Par défaut</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="name-asc">Nom A-Z</option>
          <option value="name-desc">Nom Z-A</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFilters;
