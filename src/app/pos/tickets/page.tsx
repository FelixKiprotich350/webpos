"use client";
import { FC, useState, useEffect } from "react";
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
} from "@carbon/react";

interface Ticket {
  id: string;
  createdAt: string;
  total: number;
  status: string;
}

// Pending Tickets Component
const PendingTickets: FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch tickets (mocked here for simplicity)
    setTickets([
      {
        id: "T001",
        createdAt: "2025-01-21T10:00:00Z",
        total: 200,
        status: "Pending",
      },
      {
        id: "T002",
        createdAt: "2025-01-21T11:00:00Z",
        total: 300,
        status: "Pending",
      },
    ]);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.id.includes(searchTerm) || ticket.status.includes(searchTerm)
  );

  return (
    <div>
      <TextInput
        id="search-tickets"
        labelText="Search Tickets"
        placeholder="Search by ID or Status"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: "1rem", width: "100%" }}
      />
      <TableContainer title="Pending Tickets">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>ID</TableHeader>
              <TableHeader>Created At</TableHeader>
              <TableHeader>Total</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>
                  {new Date(ticket.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>${ticket.total.toFixed(2)}</TableCell>
                <TableCell>{ticket.status}</TableCell>
                <TableCell>
                  <Button
                    kind="tertiary"
                    onClick={() => console.log("Viewing", ticket.id)}
                  >
                    View
                  </Button>
                  <Button
                    kind="danger"
                    onClick={() => console.log("Deleting", ticket.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PendingTickets;