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
import { Product, ProductSale } from "@prisma/client";
import styles from "./page.scss";
import { Money } from "@carbon/icons-react";
import { TrashCan, Edit } from "@carbon/icons-react";
import {
  Dropdown,
  NumberInput,
  Select,
  SelectItem,
  TextInput,
} from "carbon-components-react";
import { useNotification } from "app/layoutComponents/notificationProvider";
import { set } from "lodash";

interface SellingItem extends Product {
  quantity: number;
  tax: number;
  total: number;
}

interface NewSalePageProps {}
interface paymentItem {
  paymentMode: string;
  amount: number;
  reference: string;
}

const NewSalePage: FC<NewSalePageProps> = (props) => {
  const { addNotification } = useNotification();

  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<SellingItem[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<SellingItem>>();
  const [payments, setTicketPayments] = useState<paymentItem[]>([]);
  const [paymentMode, setPaymentMode] = useState("");
  const [amount, setAmount] = useState(0);
  const [reference, setReference] = useState("");

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
                total:
                  (item.quantity + 1) * Number(item.sellingPrice) + item.tax,
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
          tax: Number(product.sellingPrice) * 0.16, // Assuming 10% tax
          total: Number(product.sellingPrice),
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
  const totalPaid = payments.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const handleCompleteCheckout = async () => {
    try {
      if (totalPaid < grandTotal) {
        addNotification({
          title: "Operation Failed",
          subtitle: "Amount Paid is Insufficient",
          kind: "info",
          timeout: 5000,
        });
      }
      //save the sales
      const method = "POST";
      const url = "/api/pos/newsale";
      let payload = { payments: payments, products: items, isfullypaid: true };
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        addNotification({
          kind: "error",
          title: "Operation Failed",
          subtitle: "Failed to save the sales!",
          timeout: 5000,
        });
      }

      const saleItem: ProductSale = await response.json();
      addNotification({
        kind: "success",
        title: "Operation Completed",
        subtitle: "Items Sold Successfully.",
        timeout: 5000,
      });
      setShowCheckoutModal(false);
      window.location.reload();
    } catch (error) {
      addNotification({
        title: "Error Occurred",
        subtitle: error as string,
        kind: "error",
        timeout: 5000,
      });
      setShowCheckoutModal(false);
    }
  };
  const handleAddPaymentModal = () => {
    try {
      setTicketPayments((prevPayments) => {
        // Check if a payment with the same mode already exists
        const exists = prevPayments.some(
          (payment) => payment.paymentMode === paymentMode
        );

        if (exists) {
          // Optionally, you can notify the user about the duplicate
          addNotification({
            title: "Operation Failed",
            kind: "warning",
            subtitle: "Payment mode already exists in the list!",
          });
          return prevPayments; // Return the existing array without changes
        }

        // Add the new payment item if it doesn't exist
        return [
          ...prevPayments,
          { paymentMode: paymentMode, amount: amount, reference: reference },
        ];
      });
    } catch (error) {
      console.error("Error adding payment:", error);
    } finally {
      setPaymentMode("");
      setAmount(0);
      setReference("");
    }
  };

  const handleRemoveItem = (pitem: paymentItem) => {
    // Filter out the item with the matching reference
    const updatedPayments = payments.filter(
      (item) => item.paymentMode != pitem.paymentMode
    );
    setTicketPayments(updatedPayments);
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
                      total:
                        formData?.quantity ?? 1 * Number(item.sellingPrice),
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
        {showCheckoutModal && (
          <Modal
            open={showCheckoutModal}
            modalHeading={"Checking Out Sales"}
            primaryButtonText={"Complete Sales"}
            secondaryButtonText="Cancel"
            onRequestClose={() => setShowCheckoutModal(false)}
            onRequestSubmit={() => handleCompleteCheckout()}
            primaryButtonDisabled={
              totalPaid < grandTotal || totalPaid <= 0 || grandTotal <= 0
            }
          >
            <div>
              <Tile>
                <p style={{ fontSize: "1.5rem" }}>
                  <strong>Total Charged:</strong> Ksh {grandTotal.toFixed(2)}
                </p>
              </Tile>
              <Tile>
                <p style={{ fontSize: "1.5rem" }}>
                  <strong>Total Paid:</strong> Ksh {totalPaid}
                </p>
              </Tile>
              <Tile>
                <p style={{ fontSize: "1.5rem" }}>
                  <strong>Balance:</strong> Ksh{" "}
                  {(totalPaid - grandTotal).toFixed(2)}
                </p>
              </Tile>
            </div>
          </Modal>
        )}

        {showPaymentModal && (
          <Modal
            open={showPaymentModal}
            modalHeading={"Add Payment"}
            primaryButtonText={"Add Payment"}
            secondaryButtonText="Cancel"
            onRequestClose={() => setShowPaymentModal(false)}
            primaryButtonDisabled={
              amount <= 0 || paymentMode == "" || paymentMode == null
            }
            onRequestSubmit={() => {
              handleAddPaymentModal();
              setShowPaymentModal(false);
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {/* Payment Mode Selection */}
              <div>
                <Dropdown
                  label="Select Payment Mode"
                  id="paymentMode"
                  titleText="Select Payment Mode"
                  items={["Cash", "Card", "Mpesa", "Bank Transfer"]}
                  itemToString={(item) => (item ? item : "")}
                  onChange={({ selectedItem }) => {
                    // Update payment mode when an option is selected
                    setPaymentMode(selectedItem || "");
                  }}
                />
              </div>

              {/* Amount Input */}
              <div>
                <label
                  htmlFor="amount"
                  style={{ display: "block", marginBottom: "0.5rem" }}
                >
                  Amount
                </label>
                <NumberInput
                  id="amount"
                  min={0}
                  step={0.01}
                  value={amount}
                  onChange={(event: any) => {
                    // Update amount based on user input
                    setAmount(event.target.value);
                  }}
                  invalidText="Invalid amount"
                  placeholder="Enter amount"
                />
              </div>

              {/* Reference Input */}
              <div>
                <TextInput
                  id="reference"
                  labelText="Reference"
                  placeholder="Enter reference (optional)"
                  value={reference}
                  onChange={(event) => setReference(event.target.value)}
                />
              </div>
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
            <p style={{ fontSize: "1.5rem" }}>
              <strong>Subtotal:</strong>Ksh {subtotal.toFixed(2)}
            </p>
            <p style={{ fontSize: "1.5rem" }}>
              <strong>Total Tax:</strong>Ksh {totalTax.toFixed(2)}
            </p>
            <p style={{ fontSize: "1.5rem" }}>
              <strong>Grand Total:</strong>Ksh {grandTotal.toFixed(2)}
            </p>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Mode</TableHeader>
                  <TableHeader>Amount</TableHeader>
                  <TableHeader>Reference</TableHeader>
                  <TableHeader></TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((item) => (
                  <TableRow key={item.paymentMode}>
                    <TableCell>{item.paymentMode}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>{item.reference}</TableCell>
                    <TableCell>
                      <IconButton
                        kind="ghost"
                        size="small"
                        onClick={() => handleRemoveItem(item)}
                        renderIcon={TrashCan}
                        iconDescription="Remove item"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Tile>
        </div>
        {/* Fixed buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginTop: "1rem",
            padding: "0.5rem 0",
          }}
        >
          {/* First Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <Button
              kind="secondary"
              style={{ flex: 1, minWidth: "48%" }}
              onClick={() => console.log("Hold action...")}
            >
              Hold
            </Button>
            <Button
              kind="secondary"
              style={{ flex: 1, minWidth: "48%" }}
              onClick={() => console.log("Retrieve action...")}
            >
              Retrieve
            </Button>
          </div>

          {/* Second Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <Button
              kind="secondary"
              style={{ flex: 1, minWidth: "48%" }}
              onClick={() => console.log("Printing...")}
            >
              Print
            </Button>
            <Button
              kind="secondary"
              style={{ flex: 1, minWidth: "48%" }}
              onClick={() => setShowPaymentModal(true)}
            >
              Pay
            </Button>
          </div>

          {/* Third Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              kind="primary"
              style={{ flex: 1, minWidth: "100%" }}
              onClick={() => setShowCheckoutModal(true)}
              disabled={Number(grandTotal) <= 0}
            >
              Complete & Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSalePage;
