import React from 'react';
import { getFavoriteRecipes, removeFavoriteRecipe } from './localStorageHelper';

const Favorites = ({ recipes, onToggleFavorite }) => {
  const favoriteRecipeIds = getFavoriteRecipes();

  // Filter recipes that are favorited
  const favoriteRecipes = recipes.filter(recipe => favoriteRecipeIds.includes(recipe.id));

  const handleRemoveFavorite = (recipeId) => {
    removeFavoriteRecipe(recipeId);
    // Optionally, update state or perform any additional actions
  };

  return (
    <div>
      <h2>Favorite Recipes</h2>
      {favoriteRecipes.length === 0 ? (
        <p>No favorite recipes yet!</p>
      ) : (
        <ul>
          {favoriteRecipes.map(recipe => (
            <li key={recipe.id}>
              <button onClick={() => handleRemoveFavorite(recipe.id)}>Remove from Favorites</button>
              <div>
                <h3>{recipe.title}</h3>
                <p>{recipe.description}</p>
                <img src={recipe.image} alt={recipe.title} style={{ maxWidth: '100px' }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favorites;