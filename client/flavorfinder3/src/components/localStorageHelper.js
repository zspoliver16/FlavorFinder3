export const getFavoriteRecipes = () => {
    const favorites = localStorage.getItem('favoriteRecipes');
    return favorites ? JSON.parse(favorites) : [];
  };
  
  // Function to add a recipe to favorites in localStorage
  export const addFavoriteRecipe = (recipeId) => {
    let favorites = getFavoriteRecipes();
    if (!favorites.includes(recipeId)) {
      favorites.push(recipeId);
      localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
    }
  };
  
  // Function to remove a recipe from favorites in localStorage
  export const removeFavoriteRecipe = (recipeId) => {
    let favorites = getFavoriteRecipes();
    favorites = favorites.filter(id => id !== recipeId);
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
  };