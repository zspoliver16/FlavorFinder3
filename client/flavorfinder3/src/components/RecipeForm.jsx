import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./RecipeForm.css"

const RecipeForm = ({ show, onHide, onRecipeSaved, recipeToEdit }) => {
  const [serverError, setServerError] = useState(null);

  const initialValues = recipeToEdit || {
    name: "",
    ingredients: "",
    instructions: "",
    image_url: "",
    category: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Recipe name is required"),
    ingredients: Yup.string().required("Ingredients are required"),
    instructions: Yup.string().required("Instructions are required"),
    image_url: Yup.string()
      .url("Must be a valid image URL")
      .required("Image URL is required"),
    category: Yup.string(),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setServerError(null);

    try {
      const endpoint = recipeToEdit
        ? `http://localhost:5555/recipes/${recipeToEdit.id}`
        : "http://localhost:5555/recipes";
      const method = recipeToEdit ? "put" : "post";

      const response = await axios[method](endpoint, values, {
        withCredentials: true,
      });

      onRecipeSaved(response.data);
      setSubmitting(false);
      resetForm();
      onHide();
    } catch (error) {
      console.error("Error saving recipe:", error);
      setServerError("An error occurred while saving the recipe.");
    }
  };

  return (
    <Modal className="recipe-form" show={true} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{recipeToEdit ? "Edit Recipe" : "Create Recipe"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {serverError && <Alert variant="danger">{serverError}</Alert>}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, handleChange }) => (
            <Form>
              {/* Field for Recipe Name */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={values.name}
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-danger"
                />
              </div>

              {/* ...Other Fields (ingredients, instructions, image_url, category) ... */}
                <Form.Group controlId="formIngredients">
                  <Form.Label>Ingredients</Form.Label>
                  <Field
                    as="textarea"
                    rows={3}
                    name="ingredients"
                    className="form-control"
                    value={values.ingredients}
                    onChange={handleChange}
                  />
                  <ErrorMessage name="ingredients" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group controlId="formInstructions">
                  <Form.Label>Instructions</Form.Label>
                  <Field
                    as="textarea"
                    rows={3}
                    name="instructions"
                    className="form-control"
                    value={values.instructions}
                    onChange={handleChange}
                  />
                  <ErrorMessage name="instructions" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group controlId="formImageUrl">
                  <Form.Label>Image URL</Form.Label>
                  <Field
                    type="text"
                    name="image_url"
                    className="form-control"
                    value={values.image_url}
                    onChange={handleChange}
                  />
                  <ErrorMessage name="image_url" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group controlId="formCategory">
                  <Form.Label>Category</Form.Label>
                  <Field
                    type="text"
                    name="category"
                    className="form-control"
                    value={values.category}
                    onChange={handleChange}
                  />
                </Form.Group>

              {/* Submit Button */}
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {recipeToEdit ? "Save Changes" : "Create Recipe"}
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default RecipeForm;
