"use client";

import { FC, useState } from "react";
import { Button, TextInput, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TableContainer } from "@carbon/react";

interface Item {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  tax: number;
  total: number;
}

interface NewSalePageProps {}

const NewSalePage: FC<NewSalePageProps> = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<Item[]>([
   
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
        {/* Search bar */}
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
