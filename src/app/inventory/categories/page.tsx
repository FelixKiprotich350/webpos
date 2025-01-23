'use client';

import React, { FC, useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  Button,
  TextInput,
  Modal,
} from "@carbon/react";

interface Category {
  id: string;
  name: string;
  description: string;
}

export const ProductCategories: FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({ id: "", name: "", description: "" });

  useEffect(() => {
    // Mock data for categories
    setCategories([
      { id: "C001", name: "Electronics", description: "Devices and gadgets." },
      { id: "C002", name: "Groceries", description: "Daily essentials." },
      { id: "C003", name: "Clothing", description: "Apparel and fashion." },
    ]);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.description) {
      setCategories([...categories, { ...newCategory, id: `C${categories.length + 1}` }]);
      setNewCategory({ id: "", name: "", description: "" });
      setIsModalOpen(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
    setNewCategory(category);
  };

  const handleSaveCategory = () => {
    setCategories(
      categories.map((cat) => (cat.id === editingCategory?.id ? newCategory : cat))
    );
    setEditingCategory(null);
    setNewCategory({ id: "", name: "", description: "" });
    setIsModalOpen(false);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  return (
    <div>
      <h3>Product Categories</h3>
      <TextInput
        id="search-categories"
        labelText="Search Categories"
        placeholder="Search by Name or Description"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: "1rem", width: "100%" }}
      />
      <Button kind="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: "1rem" }}>
        Add Category
      </Button>

      <TableContainer title="Product Categories">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>ID</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>Description</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    kind="secondary"
                    onClick={() => handleEditCategory(category)}
                    style={{ marginRight: "0.5rem" }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    kind="danger"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {isModalOpen && (
        <Modal
          open={isModalOpen}
          modalHeading={editingCategory ? "Edit Category" : "Add Category"}
          primaryButtonText={editingCategory ? "Save" : "Add"}
          secondaryButtonText="Cancel"
          onRequestClose={() => setIsModalOpen(false)}
          onRequestSubmit={editingCategory ? handleSaveCategory : handleAddCategory}
        >
          <TextInput
            id="category-name"
            labelText="Category Name"
            value={newCategory.name}
            onChange={(e:any) => setNewCategory({ ...newCategory, name: e.target.value })}
            style={{ marginBottom: "1rem" }}
          />
          <TextInput
            id="category-description"
            labelText="Category Description"
            value={newCategory.description}
            onChange={(e:any) => setNewCategory({ ...newCategory, description: e.target.value })}
          />
        </Modal>
      )}
    </div>
  );
};

export default ProductCategories;
