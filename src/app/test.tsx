"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { Fade, Logout } from "@carbon/icons-react";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { Button } from "@carbon/react";
import { SideNav, SideNavItems, SideNavMenu, SideNavMenuItem, SideNavLink } from "carbon-components-react";

interface TestProps {}
const Test: FC<any> = ({}) => {
  const router = useRouter();

  return (
    <div>
 <SideNav
              isFixedNav={true}
              // defaultExpanded={false}
              expanded={false}
              // isChildOfHeader={true}
              aria-label="Side navigation"
            >
              <SideNavItems>
                <SideNavMenu title="Large menu" large>
                  <SideNavMenuItem href="/repos">Menu 1</SideNavMenuItem>
                  <SideNavMenuItem href="/signing">Menu 2</SideNavMenuItem>
                  <SideNavMenuItem href="https://www.carbondesignsystem.com/">
                    Menu 3
                  </SideNavMenuItem>
                </SideNavMenu>
                <SideNavLink href="https://www.carbondesignsystem.com/" large>
                  Large link
                </SideNavLink>
                <SideNavMenu renderIcon={Fade} title="Large menu w/icon" large>
                  <SideNavMenuItem href="https://www.carbondesignsystem.com/">
                    Menu 1
                  </SideNavMenuItem>
                  <SideNavMenuItem href="https://www.carbondesignsystem.com/">
                    Menu 2
                  </SideNavMenuItem>
                  <SideNavMenuItem href="https://www.carbondesignsystem.com/">
                    Menu 3
                  </SideNavMenuItem>
                </SideNavMenu>
                <SideNavLink
                  renderIcon={Fade}
                  href="https://www.carbondesignsystem.com/"
                  large
                >
                  Large link w/icon
                </SideNavLink>
              </SideNavItems>
            </SideNav>    </div>
  );
};

export default Test;
