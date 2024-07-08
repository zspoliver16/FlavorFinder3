import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
import { Modal, Button } from 'react-bootstrap';

const RecipeForm = ({ initialValues, validationSchema, onSubmit, onHide }) => {
  return (
    <Modal show={true} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{initialValues.id ? "Edit Recipe" : "Create Recipe"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <Field type="text" id="title" name="title" className="form-control" />
                <ErrorMessage name="title" component="div" className="text-danger" />
              </div>
              <div className="mb-3">
                <label htmlFor="ingredients" className="form-label">Ingredients</label>
                <Field as="textarea" id="ingredients" name="ingredients" className="form-control" />
                <ErrorMessage name="ingredients" component="div" className="text-danger" />
              </div>
              <div className="mb-3">
                <label htmlFor="instructions" className="form-label">Instructions</label>
                <Field as="textarea" id="instructions" name="instructions" className="form-control" />
                <ErrorMessage name="instructions" component="div" className="text-danger" />
              </div>
              <div className="mb-3">
                <label htmlFor="image_url" className="form-label">Image URL</label>
                <Field type="text" id="image_url" name="image_url" className="form-control" />
                <ErrorMessage name="image_url" component="div" className="text-danger" />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {initialValues.id ? "Update Recipe" : "Create Recipe"}
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default RecipeForm;


