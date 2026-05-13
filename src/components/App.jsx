import React, { useState, useEffect } from "react";
import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

function App() {
  const [toys, setToys] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Fetch all toys on page load (GET)
  useEffect(() => {
    fetch("http://localhost:3001/toys")
      .then((response) => response.json())
      .then((data) => setToys(data));
  }, []);

  // Add a new toy (POST)
  const handleAddToy = (newToy) => {
    fetch("http://localhost:3001/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((response) => response.json())
      .then((addedToy) => {
        setToys([...toys, addedToy]);
      });
  };

  // Delete a toy (DELETE)
  const handleDeleteToy = (id) => {
    fetch(`http://localhost:3001/toys/${id}`, {
      method: "DELETE",
    }).then(() => {
      setToys(toys.filter((toy) => toy.id !== id));
    });
  };

  // Increase likes (PATCH)
  const handleLikeToy = (id) => {
    const toy = toys.find((t) => t.id === id);
    const updatedLikes = toy.likes + 1;

    fetch(`http://localhost:3001/toys/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ likes: updatedLikes }),
    })
      .then((response) => response.json())
      .then((updatedToy) => {
        setToys(toys.map((t) => (t.id === id ? updatedToy : t)));
      });
  };

  return (
    <>
      <Header />
      <div className="container">
        {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}
      </div>
      <div className="buttonContainer">
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Hide Form" : "Add a Toy"}
        </button>
      </div>
      <ToyContainer
        toys={toys}
        onDeleteToy={handleDeleteToy}
        onLikeToy={handleLikeToy}
      />
    </>
  );
}

export default App;
