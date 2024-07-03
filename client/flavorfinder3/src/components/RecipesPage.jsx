import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, ListGroup, Button, Form } from 'react-bootstrap';
import './RecipesPage.css';

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]); // State to store filtered recipes
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State to manage search term

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`/filter.php?c=Dessert`);
        if (response.data && response.data.meals) {
          const recipesWithIngredients = await Promise.all(
            response.data.meals.map(async (recipe) => {
              const details = await axios.get(`/lookup.php?i=${recipe.idMeal}`);
              return { ...recipe, ...details.data.meals[0], showDetails: false }; // Initialize showDetails
            })
          );
          setRecipes(recipesWithIngredients);
          setFilteredRecipes(recipesWithIngredients); // Initialize filtered recipes with all recipes
        } else {
          setError('No recipes found.');
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError('An error occurred while fetching recipes.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleFavoriteClick = async (recipeId) => {
    try {
      const isFavorite = favorites.some((fav) => fav.recipe_id === recipeId);

      if (isFavorite) {
        const favoriteIdToDelete = favorites.find((fav) => fav.recipe_id === recipeId).id;
        await axios.delete(`http://localhost:5555/favorites/${favoriteIdToDelete}`, { withCredentials: true });
        setFavorites(favorites.filter((fav) => fav.id !== favoriteIdToDelete));
        console.log('Removed from favorites');
      } else {
        const response = await axios.post(
          'http://localhost:5555/favorites',
          { recipe_id: recipeId },
          { withCredentials: true }
        );
        setFavorites([...favorites, response.data.favorite]);
        console.log('Added to favorites:', response.data);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setError(error.response?.data?.error || 'Error updating favorites');
    }
  };

  const handleToggleDetails = (recipeId) => {
    // Toggle showDetails state for the clicked recipe
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.idMeal === recipeId ? { ...recipe, showDetails: !recipe.showDetails } : recipe
      )
    );
  };

  // Function to handle search input change
  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase(); // Convert search term to lowercase
    setSearchTerm(searchTerm); // Update search term state

    // Filter recipes based on search term
    const filtered = recipes.filter((recipe) =>
      recipe.strMeal.toLowerCase().includes(searchTerm)
    );
    setFilteredRecipes(filtered); // Update filtered recipes state
  };

  // Render recipes based on filteredRecipes state
  const renderRecipes = () => {
    if (isLoading) return <p>Loading recipes...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
      <Row className="recipes-grid">
        {filteredRecipes.map((recipe) => (
          <Col key={recipe.idMeal} sm={6} md={4} lg={3}>
            <Card className="recipe-card">
              <Card.Img variant="top" src={recipe.strMealThumb} />
              <Card.Body>
                <Card.Title>{recipe.strMeal}</Card.Title>
                <Button
                  variant="link"
                  onClick={() => handleToggleDetails(recipe.idMeal)}
                >
                  {recipe.showDetails ? 'Hide Details' : 'Show Details'}
                </Button>
              </Card.Body>
              {recipe.showDetails && renderIngredients(recipe)}
              <Card.Footer>
                <Button
                  variant="primary"
                  onClick={() => handleFavoriteClick(recipe.idMeal)}
                >
                  {favorites.some((fav) => fav.recipe_id === recipe.idMeal)
                    ? 'Remove from Favorites'
                    : 'Add to Favorites'}
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  const renderIngredients = (recipe) => {
    return (
      <Card.Body>
        <Card.Subtitle className="mb-2 text-muted">Ingredients:</Card.Subtitle>
        <ListGroup variant="flush">
          {Object.keys(recipe)
            .filter((key) => key.startsWith('strIngredient') && recipe[key])
            .map((key, index) => (
              <ListGroup.Item key={index}>{recipe[key]}</ListGroup.Item>
            ))}
        </ListGroup>
      </Card.Body>
    );
  };

  return (
    <Container className="recipes-page">
      <h1 className="recipes-title">Recipes</h1>

      {/* Search Bar */}
      <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Form>

      {renderRecipes()}
    </Container>
  );
}

export default RecipesPage;
