import React from 'react'
import { Link } from 'react-router-dom';

function NewsCategory({ data, selectedCategory, onSelectCategory }) {
  return (
    <div>
      <div className="cat-news">
        <div className="container">
          <div className="row mt-4">
            {data?.map((category, index) => {
              const categoryName = typeof category === 'string' ? category : category.name;
              const categorySlug = typeof category === 'string' ? category : category.slug;
              const isSelected = selectedCategory === categoryName;

              return (
                <div className="text-left" key={index}>
                  <div className='text-left'>
                    {onSelectCategory ? (
                      <button
                        type="button"
                        className={`btn btn-sm ${isSelected ? 'btn-primary text-white' : 'btn-outline-secondary text-dark'} mb-2 me-2`}
                        onClick={() => onSelectCategory(categoryName)}
                      >
                        {categoryName}
                      </button>
                    ) : (
                      <label>
                        <Link to={`/subcategory/${categorySlug}`}>{categoryName}</Link>
                      </label>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsCategory