"use client";

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

// User Management Component
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export const UserManagement: FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Fetch users (mocked here for simplicity)
    setUsers([
      {
        id: "U001",
        name: "User 1",
        email: "user1@example.com",
        role: "Admin",
        status: "Active",
      },
      {
        id: "U002",
        name: "User 2",
        email: "user2@example.com",
        role: "Cashier",
        status: "Inactive",
      },
    ]);
  }, []);

  return (
    <div>
      <h3>User Management</h3>
      <TableContainer title="User List">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>ID</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Role</TableHeader>
              <TableHeader>Status</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
