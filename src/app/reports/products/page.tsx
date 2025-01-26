"use client";

import React, { FC, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  Select,
  SelectItem,
  Button,
} from "@carbon/react";

interface Report {
  id: string;
  date: string;
  type: string;
  details: any[];
}

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function Reports() {
  const [reportType, setReportType] = useState("sales");
  const [reports, setReports] = useState<Report[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const handleReportTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReportType(e.target.value);
    if (e.target.value === "categories") {
      fetchCategories();
    } else {
      fetchReports(e.target.value);
    }
  };

  const fetchReports = (type: string) => {
    const mockReports = [
      {
        id: "R001",
        date: "2025-01-21",
        type: "sales",
        details: [
          { name: "Product 1", quantity: 5, total: 500 },
          { name: "Product 2", quantity: 3, total: 450 },
        ],
      },
      {
        id: "R002",
        date: "2025-01-20",
        type: "products",
        details: [
          { name: "Product 1", stock: 10, price: 100 },
          { name: "Product 2", stock: 5, price: 150 },
        ],
      },
      {
        id: "R003",
        date: "2025-01-19",
        type: "users",
        details: [
          { name: "User 1", role: "Admin", status: "Active" },
          { name: "User 2", role: "Cashier", status: "Inactive" },
        ],
      },
    ];

    setReports(mockReports.filter((report) => report.type === type));
  };

  const fetchCategories = () => {
    const mockCategories = [
      { id: "C001", name: "Electronics", description: "Devices and gadgets." },
      {
        id: "C002",
        name: "Groceries",
        description: "Daily needs and food items.",
      },
      {
        id: "C003",
        name: "Clothing",
        description: "Apparel and fashion wear.",
      },
    ];

    setCategories(mockCategories);
  };

  return (
    <div>
      <h3>Reports</h3>
      {reports.map((report) => (
        <TableContainer key={report.id} title={`Report: ${report.date}`}>
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(report.details[0]).map((key) => (
                  <TableHeader key={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {report.details.map((detail, idx) => (
                <TableRow key={idx}>
                  {Object.values(detail).map((value, index) => (
                    <TableCell key={index}>{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ))}
    </div>
  );
}
