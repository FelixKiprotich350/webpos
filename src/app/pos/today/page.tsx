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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/pos/todaysales"); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch sales data.");
        }
        const data: Product[] = await response.json();
        setSales(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSales();
  }, []);

  const totalSales = sales.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <h3>Today's Sales</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {isLoading ? (
        <p>Loading sales data...</p>
      ) : (
        <>
          <p>
            <strong>Total Sales:</strong> ${Number(totalSales).toFixed(2)}
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
                    <TableCell>${Number(sale.price).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default TodaysSales;
