import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
// import { Link } from "react-router-dom";
import './HomePage.css'

function HomePage() {
    const [flavors, setFlavors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [flavorToEdit, setFlavorToEdit] = useState(null);

    // Form data state
    const [newFlavor, setNewFlavor] = useState({ name: '', description: '', image_url: '' });
    const [editedFlavor, setEditedFlavor] = useState({ name: '', description: '', image_url: '' });
    

    useEffect(() => {
        fetchFlavors();
    }, []);

    // Fetch Flavors
    const fetchFlavors = async () => {
        try {
            const response = await axios.get('http://localhost:5555/flavors', {
                withCredentials: true
            });
            setFlavors(response.data);
        } catch (error) {
            console.error('Error fetching flavors:', error);
            setError("Error loading flavors");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle create flavor form submission
    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5555/flavors', newFlavor, { withCredentials: true });
            setFlavors([...flavors, response.data]);
            setNewFlavor({ name: '', description: '', image_url: '' }); // Clear the form
            setShowCreateModal(false); 
        } catch (error) {
            console.error('Error creating flavor:', error);
            // Handle the error, e.g., show an error message in the UI
        }
    };

    // Handle edit flavor form submission
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5555/flavors/${flavorToEdit.id}`, editedFlavor, { withCredentials: true });
            setFlavors(flavors.map(f => (f.id === flavorToEdit.id ? response.data : f)));
            setFlavorToEdit(null);
            setShowEditModal(false); 
        } catch (error) {
            console.error('Error editing flavor:', error);
            // Handle the error
        }
    };
    
    //Handle delete flavor
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5555/flavors/${id}`, { withCredentials: true });
            setFlavors(flavors.filter(flavor => flavor.id !== id));
        } catch (error) {
            console.error('Error deleting flavor:', error);
        }
    };

    const renderFlavors = () => {
        if (isLoading) {
            return <p>Loading flavors...</p>;
        } else if (error) {
            return <p className="text-danger">Error: {error}</p>;
        } else {
            return (
                <Row xs={4} md={8} className="g-4"> {/* Adjust md={3} to control number of columns */}
                    {flavors.map((flavor) => (
                        <Col key={flavor.id}>
                            <Card className="h-100">
                                {flavor.image_url && <Card.Img variant="top" src={flavor.image_url} />}
                                <Card.Body>
                                    <Card.Title>{flavor.name}</Card.Title>
                                    <Card.Text>{flavor.description}</Card.Text>
                                    <Button variant="warning" onClick={() => {setFlavorToEdit(flavor); setShowEditModal(true);}}>Edit</Button>
                                    <Button variant="danger" onClick={() => handleDelete(flavor.id)}>Delete</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            );
        }
    };

    return (
        <div className="home-page"> 
            <Container className="flavors-page">
                <h1 className="flavors-title">Explore Flavors</h1>
                <Button variant="primary" onClick={() => setShowCreateModal(true)} className="mb-3">
                    Create New Flavor
                </Button>
                {renderFlavors()}
                
                {/* Create Flavor Modal */}
                <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create New Flavor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleCreateSubmit}>
                            <Form.Group controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" value={newFlavor.name} onChange={(e) => setNewFlavor({...newFlavor, name: e.target.value})} required />
                            </Form.Group>
                            <Form.Group controlId="formDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control type="text" value={newFlavor.description} onChange={(e) => setNewFlavor({...newFlavor, description: e.target.value})} required />
                            </Form.Group>
                            <Form.Group controlId="formImageUrl">
                                <Form.Label>Image URL</Form.Label>
                                <Form.Control type="text" value={newFlavor.image_url} onChange={(e) => setNewFlavor({...newFlavor, image_url: e.target.value})} required />
                            </Form.Group>
                            <Button variant="primary" type="submit">Create</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
    
                {/* Edit Flavor Modal */}
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Flavor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {flavorToEdit && (
                            <Form onSubmit={handleEditSubmit}>
                                <Form.Group className="flavor-card" controlId="formEditName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" value={editedFlavor.name} onChange={(e) => setEditedFlavor({...editedFlavor, name: e.target.value})} required />
                                </Form.Group>
                                <Form.Group controlId="formEditDescription">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" rows={3} value={editedFlavor.description} onChange={(e) => setEditedFlavor({ ...editedFlavor, description: e.target.value })} required />
                                </Form.Group>
                                <Form.Group controlId="formEditImageUrl">
                                    <Form.Label>Image URL</Form.Label>
                                    <Form.Control type="text" value={editedFlavor.image_url} onChange={(e) => setEditedFlavor({ ...editedFlavor, image_url: e.target.value })} required />
                                </Form.Group>
                                <Button variant="primary" type="submit">Save Changes</Button>
                            </Form>
                        )}
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
}

export default HomePage;