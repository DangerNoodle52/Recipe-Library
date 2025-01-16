import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
function Dashboard() {
  // need to create state for search
  const [searchValue, setSearchValue] = useState('');

  // need to create search result state
  const [searchResult, setSearchResult] = useState([]);

  // handle state for drop (changes query type depending on drop down)
  const [queryType, setQueryType] = useState('name');

  // using library to navigate through routes
  const navigate = useNavigate();

  // need to create handlers for input change
  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  // create handler for submit
  const handleOnSubmit = (event) => {
    // need to use event prevent default so the page doesn't reload when we submit
    event.preventDefault();
    // here we need to call function that helps us fetch the data from API
    getRecipe();
  };

  // handler that sets query type
  const handleQueryTypeChange = (event) => {
    setQueryType(event.target.value);
  };

  const handleRedirect = (idMeal) => {
    navigate(`/recipe/${idMeal}`);
  };
  // need to create fetch function
  const getRecipe = async () => {
    let url = '';

    if (queryType === 'name') {
      url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
        searchValue
      )}`;
    } else if (queryType === 'region') {
      url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(
        searchValue
      )}`;
    }

    try {
      // need to make specific query type depending on drop down box
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`error: ${res.status}`);
      }
      const data = await res.json();
      setSearchResult(data.meals || []);
    } catch (error) {
      console.error('Error fetching recipe:', error);
    }
  };

  useEffect(() => {
    if (searchValue.trim() === '') {
      setSearchResult([]); // Clear search results if search value is empty
    }
  }, [searchValue]);

  return (
    <div>
      <div className='search-title'></div>

      <div className='search-container'>
        <form onSubmit={handleOnSubmit}>
          <select onChange={handleQueryTypeChange} value={queryType}>
            <option value='name'>Name</option>
            <option value='region'>Region</option>
          </select>

          <input
            type='text'
            value={searchValue}
            onChange={handleInputChange}
            placeholder={queryType === 'name' ? `Recipe name...` : `Region...`}
          />
          <button type='submit'>Search</button>
        </form>
      </div>

      <div className='result-container'>
        <ul>
          {searchResult.map((meal) => (
            <li key={meal.idMeal}>
              <h3
                style={{ cursor: 'pointer' }}
                onClick={() => handleRedirect(meal.idMeal)}
              >
                {meal.strMeal}
              </h3>
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                style={{ cursor: 'pointer' }}
                onClick={() => handleRedirect(meal.idMeal)}
              />
              <p>
                {meal.strArea} - {meal.strCategory}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;

//Next, add placeholders to login.jsx
