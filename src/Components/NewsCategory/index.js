import React from 'react'
import { Link } from 'react-router-dom';

function NewsCategory({ data }) {
   
  return (
    <div>
         <div className="cat-news">
            <div className="container">
                <div className="row mt-4">
                   {
                    data?.map((categories,index)=>(
                         <div className="text-left" key={index}>
                       <div className='text-left'>
                         <label><Link to={`/subcategory/${categories.slug}`}> {categories.name}</Link></label>
                       </div>
                    </div>
                    ))
                   }
                </div>
            </div>
        </div>
    </div>
  )
}

export default NewsCategory