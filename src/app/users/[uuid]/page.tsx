"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Use `useParams` in the app directory
import { Person, Role, TrtUser as User } from "@prisma/client";

interface TrtUser extends User {
  Person: Person;
  Role: Role;
}

export default function UserDetailsPage() {
  const { uuid } = useParams(); // Extract `uuid` from dynamic route parameters
  const [user, setUser] = useState<TrtUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uuid) return; // Prevent fetch if `uuid` is undefined

    const fetchUser = async () => {
      try {
        setIsLoading(true);
        setError(null); // Reset error before a new fetch

        const response = await fetch(`/api/users/${uuid}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user details: ${response.statusText}`);
        }

        const data = await response.json();
        setUser(data); // Assume the API returns a single user object
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [uuid]);

  return (
    <div>
      <h3>User Details</h3>

      {isLoading ? (
        <p>Loading user details...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : user ? (
        <div>
          <h4>
            {user.Person?.firstName} {user.Person?.lastName}
          </h4>
          <p>
            <strong>Gender:</strong> {user.Person?.gender}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.Role?.name}
          </p>
          <p>
            <strong>Login Status:</strong> {user.loginStatus}
          </p>

          <p>
            <strong>Approval Status:</strong> {user.approvalStatus}
          </p>
        </div>
      ) : (
        <p>User not found.</p>
      )}
    </div>
  );
}
