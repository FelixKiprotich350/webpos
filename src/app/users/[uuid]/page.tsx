"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Person, Role, TrtUser as User } from "@prisma/client";
import { Grid, Column, Tile, Button, InlineLoading } from "@carbon/react";

interface TrtUser extends User {
  Person: Person;
  Role: Role;
}

export default function UserDetailsPage() {
  const { uuid } = useParams();
  const [user, setUser] = useState<TrtUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uuid) return;

    const fetchUser = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/users/${uuid}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user details: ${response.statusText}`);
        }

        const data = await response.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [uuid]);

  const updateUserStatus = async (action: "approve" | "disable") => {
    if (!user) return;
    try {
      const response = await fetch(`/api/users/${uuid}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`Failed to ${action} user: ${response.statusText}`);
      }
      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <Grid fullWidth>
      <Column sm={4} md={8} lg={8}>
        <Tile>
          <h3>User Details</h3>
          {isLoading ? (
            <InlineLoading description="Loading user details..." />
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : user ? (
            <>
              <h4>{user.Person?.firstName} {user.Person?.lastName}</h4>
              <p><strong>Gender:</strong> {user.Person?.gender}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.Role?.name}</p>
              <p><strong>Login Status:</strong> {user.loginStatus}</p>
              <p><strong>Approval Status:</strong> {user.approvalStatus}</p>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                {user.approvalStatus === "PENDING" && (
                  <Button kind="primary" onClick={() => updateUserStatus("approve")}>
                    Approve User
                  </Button>
                )}
                {user.loginStatus === "ENABLED" && (
                  <Button kind="danger" onClick={() => updateUserStatus("disable")}>
                    Disable Login
                  </Button>
                )}
              </div>
            </>
          ) : (
            <p>User not found.</p>
          )}
        </Tile>
      </Column>
    </Grid>
  );
}
