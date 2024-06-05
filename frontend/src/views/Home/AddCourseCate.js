import React, { useState, useEffect } from "react";
function AddCourseCate() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ title: "", imageCategory: null });
  const [editingCategory, setEditingCategory] = useState({ id: "", title: "", imageCategory: "" });

  useEffect(() => {
    fetch("http://localhost:5000/all-coursecate")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.categories);
        } else {
          console.error("Failed to fetch categories:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleAddCategory = () => {
    const formData = new FormData();
    formData.append("title", newCategory.title);
    formData.append("imageCategory", newCategory.imageCategory);

    fetch("http://localhost:5000/add-coursecate", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setCategories([...categories, data.model]);
          setNewCategory({ title: "", imageCategory: null });
        } else {
          console.error("Failed to add category:", data.message);
        }
      })
      .catch((error) => console.error("Error adding category:", error));
  };

  const handleEditCategory = (id) => {
    const formData = new FormData();
    formData.append("title", editingCategory.title);
    formData.append("imageCategory", editingCategory.imageCategory);

    fetch(`http://localhost:5000/edit-coursecate/${id}`, {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Assuming you're using JWT for authentication
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const updatedCategories = categories.map((category) => {
            if (category._id === id) {
              return data.category;
            } else {
              return category;
            }
          });
          setCategories(updatedCategories);
          setEditingCategory({ id: "", title: "", imageCategory: "" });
        } else {
          console.error("Failed to edit category:", data.message);
        }
      })
      .catch((error) => console.error("Error editing category:", error));
  };

  const handleDeleteCategory = (id) => {
    fetch(`http://localhost:5000/delete-coursecate/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const updatedCategories = categories.filter((category) => category._id !== id);
          setCategories(updatedCategories);
        } else {
          console.error("Failed to delete category:", data.message);
        }
      })
      .catch((error) => console.error("Error deleting category:", error));
  };

  return (
    <div>
      <h2>All Categories Couse</h2>
      <ul>
        {categories.map((category) => (
          <li key={category._id}>
            {category.title} -{" "}
            <button onClick={() => setEditingCategory({ id: category._id, title: category.title, imageCategory: category.imageCategory })}>
              Edit
            </button>{" "}
            <button onClick={() => handleDeleteCategory(category._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h2>Add New Category</h2>
      <input
        type="text"
        placeholder="Title"
        value={newCategory.title}
        onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })}
      />
      <input type="file" onChange={(e) => setNewCategory({ ...newCategory, imageCategory: e.target.files[0] })} />
      <button onClick={handleAddCategory}>Add</button>

      {editingCategory.id && (
        <>
          <h2>Edit Category</h2>
          <input
            type="text"
            placeholder="Title"
            value={editingCategory.title}
            onChange={(e) => setEditingCategory({ ...editingCategory, title: e.target.value })}
          />
          <input
            type="file"
            onChange={(e) => setEditingCategory({ ...editingCategory, imageCategory: e.target.files[0] })}
          />
          <button onClick={() => handleEditCategory(editingCategory.id)}>Save</button>
        </>
      )}
    </div>
  );
}

export default AddCourseCate;
