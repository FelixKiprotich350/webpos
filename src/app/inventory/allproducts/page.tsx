"use client";

// This file will contain code for all the listed functionalities in your POS system
// Structure: Each functionality is defined as a component or function, ready for integration

// Imports for all components
import React, { FC, useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer, 
} from "@carbon/react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

// Inventory Items Component
 const InventoryItems: FC = () => {
  const [inventory, setInventory] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch inventory items (mocked here for simplicity)
    setInventory([
      {
        id: "P001",
        name: "Product 1",
        category: "Category 1",
        price: 100,
        stock: 10,
      },
      {
        id: "P002",
        name: "Product 2",
        category: "Category 2",
        price: 150,
        stock: 5,
      },
    ]);
  }, []);

  return (
    <div>
      <h3>Inventory Items</h3>
      <TableContainer title="Inventory List">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>ID</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>Category</TableHeader>
              <TableHeader>Price</TableHeader>
              <TableHeader>Stock</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>{item.stock}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};


export default InventoryItems;