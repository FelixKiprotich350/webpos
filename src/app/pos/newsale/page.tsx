"use client";

import { FC, useEffect, useState } from "react";
import {
  Search,
  Button,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  ClickableTile,
  IconButton,
  Tile,
  Modal,
} from "@carbon/react";
import { Product } from "@prisma/client";
import styles from "./page.scss";
import { Money } from "@carbon/icons-react";
import {} from "@carbon/react";
import { Edit } from "@carbon/icons-react";
import { NumberInput, Select, SelectItem } from "carbon-components-react";
import { useNotification } from "app/layoutComponents/notificationProvider";

interface SellingItem extends Product {
  quantity: number;
  tax: number;
  total: number;
}

interface NewSalePageProps {}

const NewSalePage: FC<NewSalePageProps> = (props) => {
  const { addNotification } = useNotification();

  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<SellingItem[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<SellingItem>>();

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/inventory/products"); // Replace with your actual API endpoint
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        addNotification({
          title: "Error",
          subtitle: "Failed to fetch products",
          kind: "error",
        });
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
  const handleEditItem = (item: any) => {
    setFormData(item);
    setShowModal(true);
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
      <div
        style={{
          flex: 3,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Search and filter */}
        <div
          style={{
            padding: "1rem",
            borderBottom: "1px solid #e0e0e0",
            zIndex: 1, // Ensure the search bar is above other content
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
          </div>
        </div>

        {/* Search Results - Positioned absolutely */}
        {searchTerm && filteredProducts?.length > 0 && (
          <div
            className={styles.searchResults}
            style={{
              position: "absolute",
              top: "60px", // Adjust based on your design
              left: "1rem",
              right: "1rem",
              backgroundColor: "white",
              zIndex: 1000, // Ensure the search results overlay other content
              maxHeight: "300px", // Adjust height as needed
              overflowY: "auto",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            {filteredProducts?.slice(0, 5).map((stockItem: any) => (
              <ClickableTile
                onClick={() => handleOnSearchResultClick(stockItem)}
                key={stockItem?.uuid}
              >
                {stockItem?.name}
              </ClickableTile>
            ))}
          </div>
        )}

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
                <TableHeader>Price</TableHeader>
                <TableHeader>Unit</TableHeader>
                <TableHeader>Quantity</TableHeader>
                <TableHeader>Total</TableHeader>
                <TableHeader></TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.sellingPrice?.toFixed(2)}</TableCell>
                  <TableCell>{item.basicUnitUuid}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton
                      kind="ghost"
                      size="small"
                      onClick={() => handleEditItem(item)}
                      renderIcon={Edit}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {showModal && (
          <Modal
            open={showModal}
            modalHeading={"Edit Item"}
            primaryButtonText={"Accept Changes"}
            secondaryButtonText="Cancel"
            onRequestClose={() => setShowModal(false)}
            onRequestSubmit={() => {
              // Update item in the list with the new quantity
              const updatedItems = items.map((item) =>
                item.uuid === formData?.uuid
                  ? {
                      ...item,
                      quantity: formData?.quantity ?? 1,
                      total: formData?.quantity ?? 1 * item.sellingPrice,
                    }
                  : item
              );
              setItems(updatedItems); // Update the state with the modified array
              setShowModal(false); // Close the modal
            }}
          >
            <div>
              <NumberInput
                helperText="Optional helper text."
                name="quantity"
                id="quantity"
                invalidText="Number is not valid"
                label="Selling Quantity"
                max={100}
                min={1}
                onChange={() => {}}
                size="md"
                step={1}
                value={formData?.quantity || 1}
                warnText="This is the quantity to sell."
              />
            </div>
          </Modal>
        )}
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
          <Tile>
            <h3 style={{ textAlign: "left" }}>
              <u>Summary</u>
            </h3>
          </Tile>
          <Tile>
            <p style={{ fontSize: "1.5rem" }}>
              <strong>Subtotal:</strong>
            </p>
            <p style={{ fontSize: "1.5rem" }}> Ksh {subtotal.toFixed(2)}</p>
          </Tile>
          <Tile className="tileContent">
            <p style={{ fontSize: "1.5rem" }}>
              <strong>Total Tax:</strong>
            </p>
            <p style={{ fontSize: "1.5rem" }}>Ksh {totalTax.toFixed(2)}</p>
          </Tile>
          <Tile className="tileContent">
            <p style={{ fontSize: "1.5rem" }}>
              <strong>Grand Total:</strong>
            </p>
            <p style={{ fontSize: "1.5rem" }}>Ksh {grandTotal.toFixed(2)}</p>
          </Tile>
        </div>

        {/* Fixed buttons */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            marginTop: "1rem",
            padding: "0.5rem 0",
          }}
        >
          <Button
            kind="secondary"
            style={{ flex: 1, minWidth: "22%" }}
            onClick={() => console.log("Hold action...")}
          >
            Hold
          </Button>
          <Button
            kind="secondary"
            style={{ flex: 1, minWidth: "22%" }}
            onClick={() => console.log("Retrieve action...")}
          >
            Retrieve
          </Button>
          <Button
            kind="primary"
            style={{ flex: 1, minWidth: "22%" }}
            onClick={() => console.log("Printing...")}
          >
            Print
          </Button>
          <Button
            kind="primary"
            style={{ flex: 1, minWidth: "22%" }}
            onClick={() => console.log("Completing...")}
          >
            Complete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewSalePage;
