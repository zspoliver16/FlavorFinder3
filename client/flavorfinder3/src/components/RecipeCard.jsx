import React, { useState } from 'react';
import { Card, ListGroup, Button } from 'react-bootstrap';

function RecipeCard({ recipe }) {
    const [showIngredients, setShowIngredients] = useState(false);

    const [showInstructions, setShowInstructions] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const toggleIngredients = () => setShowIngredients(!showIngredients);
    const toggleInstructions = () => setShowInstructions(!showInstructions);
    const toggleDetails = () => setShowDetails(!showDetails);

    const getIngredientsList = () => {
        const ingredientsList = [];
        for (let i = 1; i <= 20; i++) {
            const ingredientKey = `strIngredient${i}`;
            const measureKey = `strMeasure${i}`;

            if (recipe[ingredientKey]) {
                ingredientsList.push(
                    <ListGroup.Item key={i}>
                        {recipe[ingredientKey]} - {recipe[measureKey]}
                    </ListGroup.Item>
                );
            } else {
                break;
            }
        }
        return ingredientsList;
    };
    

    const getDetails = () => {
        return (
            <div>
                <p>Category: {recipe.strCategory}</p>
                <p>Area: {recipe.strArea}</p>
                {/* Add other details as needed */}
            </div>
        );
    }

    const getInstructions = () => {
        return(
            <p>{recipe.strInstructions}</p>
        )
    }

    return (
        <Card className="recipe-card" onClick={toggleDetails}> {/* Add onClick to the card */}
            <Card.Img variant="top" src={recipe.strMealThumb} />
            <Card.Body>
                <Card.Title>{recipe.strMeal}</Card.Title>
                
                {/* Conditional rendering for details */}
                {showDetails && (
                    <div>
                        {/* Button to Toggle Ingredients */}
                        <Button variant="link" onClick={toggleIngredients}>
                            {showIngredients ? 'Hide' : 'Show'} Ingredients
                        </Button>
                        {/* Button to Toggle Instructions */}
                        <Button variant="link" onClick={toggleInstructions}>
                            {showInstructions ? 'Hide' : 'Show'} Instructions
                        </Button>

                        {/* Render details and ingredients conditionally */}
                        {showIngredients && (
                            <ListGroup variant="flush">
                                {getIngredientsList()}
                            </ListGroup>
                        )}
                        {showInstructions && (
                            getInstructions()
                        )}
                        {getDetails()}
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}

export default RecipeCard;