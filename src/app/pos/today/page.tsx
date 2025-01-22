"use client";

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
  Button,
  TextInput,
  Select,
  SelectItem,
  Modal,
  FormGroup,
} from "@carbon/react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

// Todays Sales Component
const TodaysSales: FC = () => {
  const [sales, setSales] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch today's sales (mocked here for simplicity)
    setSales([
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

  const totalSales = sales.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <h3>Today's Sales</h3>
      <p>
        <strong>Total Sales:</strong> ${totalSales.toFixed(2)}
      </p>
      <TableContainer title="Sales Details">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>ID</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>Category</TableHeader>
              <TableHeader>Price</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.id}</TableCell>
                <TableCell>{sale.name}</TableCell>
                <TableCell>{sale.category}</TableCell>
                <TableCell>${sale.price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TodaysSales;
