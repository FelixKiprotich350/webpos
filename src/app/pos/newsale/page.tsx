"use client";

import { FC, useEffect, useState } from "react";
import { Button, TextInput, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TableContainer, Dropdown, DropdownItem } from "@carbon/react";

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
}

interface Item extends Product {
  quantity: number;
  tax: number;
  total: number;
}

interface NewSalePageProps {}

const NewSalePage: FC<NewSalePageProps> = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/inventory/products"); // Replace with your actual API endpoint
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Update filtered products based on search term
  useEffect(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(lowercasedTerm)
      )
    );
  }, [searchTerm, products]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddItem = (product: Product) => {
    const existingItem = items.find((item) => item.id === product.id);

    if (existingItem) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.price + item.tax,
              }
            : item
        )
      );
    } else {
      setItems((prevItems) => [
        ...prevItems,
        {
          ...product,
          quantity: 1,
          tax: product.price * 0.1, // Assuming 10% tax
          total: product.price * 1.1,
        },
      ]);
    }
  };

  const calculateSummary = () => {
    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const totalTax = items.reduce((acc, item) => acc + item.tax, 0);
    const grandTotal = subtotal + totalTax;
    return { subtotal, totalTax, grandTotal };
  };

  const { subtotal, totalTax, grandTotal } = calculateSummary();

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 48px)",
        overflow: "hidden", // Prevent scrolling of the entire page
      }}
    >
      {/* Main content area */}
      <div style={{ flex: 3, display: "flex", flexDirection: "column" }}>
        {/* Search and filter */}
        <div
          style={{
            padding: "1rem",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <TextInput
            id="search-bar"
            labelText="Search for items"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ width: "100%" }}
          />
          <div style={{ marginTop: "1rem" }}>
            {filteredProducts.map((product) => (
              <Button
                key={product.id}
                onClick={() => handleAddItem(product)}
                kind="secondary"
                style={{ margin: "0.5rem" }}
              >
                {product.name} - ${product.price.toFixed(2)}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <TableContainer
          title="Selected Items"
          style={{
            flex: 1,
            overflowY: "auto", // Enable scrolling within the table
            padding: "1rem",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>ID</TableHeader>
                <TableHeader>Price</TableHeader>
                <TableHeader>Unit</TableHeader>
                <TableHeader>Quantity</TableHeader>
                <TableHeader>Tax</TableHeader>
                <TableHeader>Total</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.tax.toFixed(2)}</TableCell>
                  <TableCell>{item.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Right panel */}
      <div
        style={{
          flex: 1,
          borderLeft: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
          padding: "1rem",
        }}
      >
        {/* Scrollable content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto", // Enable scrolling for the right panel content
          }}
        >
          <h3>Summary</h3>
          <p>
            <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
          </p>
          <p>
            <strong>Total Tax:</strong> ${totalTax.toFixed(2)}
          </p>
          <p>
            <strong>Grand Total:</strong> ${grandTotal.toFixed(2)}
          </p>
        </div>

        {/* Fixed buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
          <Button kind="primary" onClick={() => console.log("Printing...")}>
            Print
          </Button>
          <Button kind="primary" onClick={() => console.log("Checking out...")}>
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewSalePage;
