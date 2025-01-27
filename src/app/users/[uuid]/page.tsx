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
} from "@carbon/react";
import { Person, Role, TrtUser as user } from "@prisma/client";
interface TrtUser extends user {
  Person: Person;
  Role: Role;
}
export default function UserDetailsPage(uuid: string) {
  const [user, setUser] = useState<TrtUser>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        setError(null); // Reset error before a new fetch

        const response = await fetch(`/api/users/${uuid}`); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(
            `Failed to fetch user Details: ${response.statusText}`
          );
        }

        const data = await response.json();
        setUser(data); // Assume the API returns a list of users
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h3>User Management</h3>

      {isLoading ? (
        <p>Loading user Details</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          <p> {JSON.stringify(user)}</p>
        </div>
      )}
    </div>
  );
}
