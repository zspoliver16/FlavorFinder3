import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import "./RecipesPage.css"

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`/filter.php?c=Dessert`);
        if (response.data && response.data.meals) {
          setRecipes(response.data.meals);
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

  const renderRecipes = () => {
    if (isLoading) return <p>Loading recipes...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <Row className="recipes-grid">  {/* Apply 'recipes-grid' class to the Row */}
            {recipes.map((recipe) => (
                <Col key={recipe.idMeal} sm={6} md={4} lg={3}> {/* Responsive columns */}
                    <Card className="recipe-card">
                        <Card.Img variant="top" src={recipe.strMealThumb} />
                        <Card.Body>
                            <Card.Title>{recipe.strMeal}</Card.Title>
                            {/* Add other recipe details here (e.g., category, area) */}
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
  };

  return (
    <Container className="recipes-page">
      <h1 className="recipes-title">Recipes</h1>
      {renderRecipes()} 
    </Container>
  );
}

export default RecipesPage;