"use client";

import React, { ReactNode, useEffect, useState } from "react";
import {
  Switcher,
  UserAvatar,
  Notification,
  Logout,
} from "@carbon/icons-react";
import {
  Theme,
  Content,
  Header,
  SkipToContent,
  HeaderName,
  SideNav,
  SideNavItems,
  SideNavMenu,
  SideNavMenuItem,
  SideNavLink,
  HeaderMenuButton,
  HeaderGlobalBar,
  HeaderGlobalAction,
  OverflowMenu,
  OverflowMenuItem,
} from "@carbon/react";
import { useRouter } from "next/navigation";

interface ProvidersProps {
  children: ReactNode; // Defines that the `children` prop can accept any valid React node
}

const ContentProviders: React.FC<ProvidersProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const toggleSideNav = () => {
    setIsSideNavExpanded((prev) => !prev);
  };

  // Fetch user details if the user is authenticated
  const fetchUserDetails = async () => {
    try {
      const response = await fetch("/api/token"); // API endpoint to get user details
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setUser(data); // Store user details in state
      } else {
        setUser(null); // Reset user state if not authenticated
      }
    } catch (error) {
      setError("Failed to fetch user details");
    }
  };

  //logout function
  const logOutUser = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = "/"; // Refresh the page to ensure every state is reset
      } else {
        setError(data.error || "Logout Failed.");
      }
    } catch (error) {
      // In case of network or unexpected errors
      setError("An error occurred during logout.");
    }
  };

  //login function
  const logInPage = () => {
    router.push("/signing");
  };

  // Fetch user details when the component mounts (or when logged-in state changes)
  useEffect(() => {
    fetchUserDetails(); // Fetch user details
  }, []);
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
  };
  return (
    <div>
      <Theme theme="g100">
        <Header aria-label="Tagile Softwares">
          <SkipToContent />
          {user && (
            <HeaderMenuButton
              isActive={isSideNavExpanded}
              aria-expanded={isSideNavExpanded}
              aria-label={isSideNavExpanded ? "Close menu" : "Open menu"}
              onClick={toggleSideNav}
              isCollapsible={true}
            />
          )}
          <HeaderName href="/" prefix="" size="lg">
            Tagile - POS
          </HeaderName>

          {user != null && (
            <HeaderGlobalBar>
              <HeaderGlobalAction
                aria-label="Notifications"
                tooltipAlignment="center"
                className="action-icons"
              >
                <Notification size={20} />
              </HeaderGlobalAction>

              <HeaderGlobalAction
                aria-label="Logout"
                tooltipAlignment="center"
                className="action-icons"
                onClick={() => logOutUser()}
              >
                <Logout size={20} aria-label="Logout" />
              </HeaderGlobalAction>

              <HeaderGlobalAction
                aria-label="App Switcher"
                tooltipAlignment="end"
                onClick={handleMenuToggle}
              >
                <UserAvatar size={20} initials="JD" />
              </HeaderGlobalAction>
            </HeaderGlobalBar>
          )}

          {user == null && (
            <HeaderGlobalBar>
              <HeaderGlobalAction
                aria-label="Login"
                tooltipAlignment="center"
                className="action-icons"
                onClick={() => logInPage()}
              >
                Login
              </HeaderGlobalAction>
            </HeaderGlobalBar>
          )}
        </Header>
      </Theme>

      <Theme theme="g10">
        {user && (
          <SideNav
            isFixedNav={true}
            // defaultExpanded={false}
            expanded={isSideNavExpanded}
            // isChildOfHeader={true}
            aria-label="Side navigation"
          >
            <SideNavItems>
             
              <SideNavLink href="/dashboard">Dashboard</SideNavLink>
              <SideNavMenu title="Point of Sale">
                <SideNavMenuItem href="/pos/newsale">New Sale</SideNavMenuItem>
                <SideNavMenuItem href="/pos/tickets">
                  Pending Tickets
                </SideNavMenuItem>
                <SideNavMenuItem href="/pos/todaysales">
                  Today's Sales
                </SideNavMenuItem>
              </SideNavMenu>
              <SideNavMenu title="Inventory">
                <SideNavMenuItem href="/inventory/allproducts">
                  Products List
                </SideNavMenuItem>
                <SideNavMenuItem href="/inventory/prices">
                  Products Prices
                </SideNavMenuItem>
                <SideNavMenuItem href="/inventory/balances">
                  Products Balances
                </SideNavMenuItem>
                <SideNavMenuItem href="/inventory/categories">
                  Categories
                </SideNavMenuItem>
              </SideNavMenu>
              <SideNavMenu title="User Management">
                <SideNavMenuItem href="/sources/dataentry">
                  Users List
                </SideNavMenuItem>
                <SideNavMenuItem href="/sources/csv">
                  Manage User
                </SideNavMenuItem>
                <SideNavMenuItem href="/sources/database">
                  User Roles
                </SideNavMenuItem>
                <SideNavMenuItem href="/sources/api">
                  User Permissions
                </SideNavMenuItem>
              </SideNavMenu>
              <SideNavMenu title="Reports">
                <SideNavMenuItem href="/reports">Sales Reports</SideNavMenuItem>
                <SideNavMenuItem href="/reports/products">
                  Product Reports
                </SideNavMenuItem>
                {/* <SideNavMenuItem href="/reports/users">
                  User Reports
                </SideNavMenuItem> */}
                <SideNavMenuItem href="/reports/system">
                  System Reports
                </SideNavMenuItem>
              </SideNavMenu>
              <SideNavMenu title="Settings">
                <SideNavMenuItem href="/sources/dataentry"></SideNavMenuItem>
                <SideNavMenuItem href="/sources/csv">CSV</SideNavMenuItem>
                <SideNavMenuItem href="/sources/database">
                  Database
                </SideNavMenuItem>
                <SideNavMenuItem href="/sources/api">
                  API Endpoint
                </SideNavMenuItem>
              </SideNavMenu>
              <SideNavMenu title="Administration">
                <SideNavMenuItem href="/sources/dataentry">
                  System Setup
                </SideNavMenuItem>
                <SideNavMenuItem href="/administration/database">
                  Database Manager
                </SideNavMenuItem>
              </SideNavMenu>
              {/* <SideNavLink href="/datafetch"></SideNavLink> */}
            </SideNavItems>
          </SideNav>
        )}
        <Content>
          <Theme theme="white">{children}</Theme>
        </Content>
      </Theme>
    </div>
  );
};

export default ContentProviders;
