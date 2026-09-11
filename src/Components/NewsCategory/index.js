import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function NewsCategory({ data = [], selectedCategory, onSelectCategory }) {
  const [filterSearch, setFilterSearch] = useState('');
  const [showMore, setShowMore] = useState(false);
  const INITIAL_LIMIT = 6;

  const getCategoryIcon = (catName) => {
    if (!catName) return 'fa-tags';
    const name = catName.toLowerCase();
    if (name.includes('beauty')) return 'fa-wand-magic-sparkles';
    if (name.includes('fragrance')) return 'fa-spray-can-sparkles';
    if (name.includes('furniture')) return 'fa-couch';
    if (name.includes('grocer')) return 'fa-basket-shopping';
    if (name.includes('laptop')) return 'fa-laptop';
    if (name.includes('phone') || name.includes('mobile')) return 'fa-mobile-screen-button';
    if (name.includes('shirt') || name.includes('clothing') || name.includes('apparel') || name.includes('dress') || name.includes('wear')) return 'fa-shirt';
    if (name.includes('shoe') || name.includes('footwear')) return 'fa-shoe-prints';
    if (name.includes('watch')) return 'fa-stopwatch';
    if (name.includes('jewel')) return 'fa-gem';
    if (name.includes('car') || name.includes('vehicle') || name.includes('auto')) return 'fa-car-side';
    if (name.includes('motorcycle')) return 'fa-motorcycle';
    if (name.includes('bag') || name.includes('pack')) return 'fa-briefcase';
    if (name.includes('sunglasses') || name.includes('eyewear')) return 'fa-glasses';
    if (name.includes('kitchen') || name.includes('home')) return 'fa-house';
    if (name.includes('sports') || name.includes('fitness')) return 'fa-futbol';
    return 'fa-tag';
  };

  const formatCategoryLabel = (name) => {
    if (!name) return '';
    return name.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const filteredCategories = data?.filter((category) => {
    const name = typeof category === 'string' ? category : category.name || category.slug;
    return name.toLowerCase().includes(filterSearch.toLowerCase());
  }) || [];

  const visibleCategories = showMore || filterSearch
    ? filteredCategories
    : filteredCategories.slice(0, INITIAL_LIMIT);

  const hasMoreItems = filteredCategories.length > INITIAL_LIMIT && !filterSearch;

  return (
    <div className="cat-news-wrapper">
      <div className="cat-news">

        {/* Quick filter input if data length is large */}
        {data.length > 8 && onSelectCategory && (
          <div className="position-relative mb-3">
            <input
              type="text"
              placeholder="Search category..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="form-control form-control-sm rounded-pill ps-4 py-1.5 border-slate-200"
              style={{ fontSize: '0.85rem' }}
            />
            <i className="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-2.5 text-muted small ps-1"></i>
            {filterSearch && (
              <button
                type="button"
                className="btn btn-sm btn-link text-muted position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-decoration-none"
                onClick={() => setFilterSearch('')}
              >
                <i className="fa-solid fa-xmark small"></i>
              </button>
            )}
          </div>
        )}

        <div className="d-flex flex-wrap gap-2 align-items-center">
          {/* 'All Categories' option when used as a filter */}
          {onSelectCategory && (
            <button
              type="button"
              className={`btn btn-sm rounded-pill text-black px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-2 transition-all ${selectedCategory === 'all'
                ? 'btn-indigo text-white shadow-sm'
                : 'btn-light border text-secondary hover-indigo'
                }`}
              onClick={() => onSelectCategory('all')}
              style={{ fontSize: '0.85rem' }}
            >
              <i className="fa-solid fa-border-all text-indigo"></i>
              <span className='text-black'>All Categories</span>
            </button>
          )}

          {visibleCategories.map((category, index) => {
            const categoryName = typeof category === 'string' ? category : category.name || category.slug;
            const categorySlug = typeof category === 'string' ? category : category.slug || category.name;
            const isSelected = selectedCategory === categoryName || selectedCategory === categorySlug;
            const iconClass = getCategoryIcon(categoryName);
            const formattedLabel = formatCategoryLabel(categoryName);

            return (
              <React.Fragment key={index}>
                {onSelectCategory ? (
                  <button
                    type="button"
                    className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-2 transition-all ${isSelected
                      ? 'btn-indigo text-white shadow-sm'
                      : 'btn-light border text-dark hover-indigo'
                      }`}
                    onClick={() => onSelectCategory(categoryName)}
                    style={{ fontSize: '0.85rem' }}
                  >
                    <i className={`fa-solid ${iconClass} ${isSelected ? 'text-white' : 'text-indigo'}`}></i>
                    <span>{formattedLabel}</span>
                  </button>
                ) : (
                  <Link
                    to={`/subcategory/${categorySlug}`}
                    className="btn btn-sm btn-light border rounded-pill px-3 py-1.5 text-dark fw-semibold d-inline-flex align-items-center gap-2 text-decoration-none hover-shadow transition-all"
                    style={{ fontSize: '0.85rem' }}
                  >
                    <i className={`fa-solid ${iconClass} text-indigo`}></i>
                    <span>{formattedLabel}</span>
                    <i className="fa-solid fa-chevron-right text-muted fs-8 ms-1"></i>
                  </Link>
                )}
              </React.Fragment>
            );
          })}

          {/* Show More / Show Less Toggle Button */}
          {hasMoreItems && (
            <button
              type="button"
              onClick={() => setShowMore(!showMore)}
              className="btn btn-sm btn-outline-indigo rounded-pill px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5 transition-all"
              style={{ fontSize: '0.82rem' }}
            >
              <span>{showMore ? 'Show Less' : `Show More (+${filteredCategories.length - INITIAL_LIMIT})`}</span>
              <i className={`fa-solid ${showMore ? 'fa-chevron-up' : 'fa-chevron-down'} small`}></i>
            </button>
          )}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-muted small py-2">
            No categories matching "{filterSearch}"
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsCategory;
