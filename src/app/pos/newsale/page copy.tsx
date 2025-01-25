"use client";

import { FC, useEffect, useState } from "react";
import {
  Search,
  Button,
  TextInput,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  ClickableTile,
} from "@carbon/react";
import { Product } from "@prisma/client";
import styles from "./page.scss";

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
  const [stockItemsList, setStockItemsList] = useState<any>([]);
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/inventory/products"); // Replace with your actual API endpoint
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        setStockItemsList(data);
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
  const handleOnSearchResultClick = (stockItem: any) => {
    const itemId = stockItem?.uuid ?? "";
    setSearchTerm("");
    handleAddItem({
      uuid: itemId,
      name: stockItem?.name,
      sellingPrice: stockItem?.sellingPrice,
      basicUnitUuid: stockItem?.basicUnitUuid,
      categoryUuid: stockItem?.categoryUuid,
      id: stockItem?.id,
      updatedAt: stockItem?.updatedAt,
      createdAt: stockItem?.createdAt,
      description: stockItem?.description,
    });
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
                total: (item.quantity + 1) * item.sellingPrice + item.tax,
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
          tax: product.sellingPrice * 0.1, // Assuming 10% tax
          total: product.sellingPrice * 1.1,
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
          <div className={styles.stockItemSearchContainer}>
            <div style={{ display: "flex" }}>
              <Search
                size="lg"
                placeholder="Find your items"
                labelText="Search"
                closeButtonLabelText="Clear search input"
                value={searchTerm}
                id="search-1"
                onChange={(e: any) => setSearchTerm(e.target.value)}
              />
            </div>
            {searchTerm && stockItemsList?.length > 0 && (
              <div className={styles.searchResults}>
                {stockItemsList?.slice(0, 5).map((stockItem: any) => (
                  <ClickableTile
                    onClick={() => handleOnSearchResultClick(stockItem)}
                    key={stockItem?.uuid}
                  >
                    {stockItem?.name}
                  </ClickableTile>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table Container with fixed height */}
        <TableContainer
          title="Selected Items"
          style={{
            height: "calc(100vh - 150px)", // Adjust height based on your design
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
                  <TableCell>{item.sellingPrice?.toFixed(2)}</TableCell>
                  <TableCell>{item.basicUnitUuid}</TableCell>
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            marginTop: "1rem",
          }}
        >
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
