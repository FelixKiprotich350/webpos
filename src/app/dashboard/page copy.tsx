'use client';

import React from "react";
import { Grid, Row, Column, Tile, Button, StructuredListWrapper, StructuredListHead, StructuredListBody, StructuredListRow, StructuredListCell } from "carbon-components-react";
import { ArrowRight, CheckmarkFilled, WarningFilled } from "@carbon/icons-react";

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard bx--grid bx--grid--full-width">
      {/* Header */}
      <Row className="dashboard-header bx--row">
        <Column sm={4} md={8} lg={16} className="bx--col">
          <Tile className="dashboard-header-tile">
            <h1 className="bx--tile__title">Welcome Back, User!</h1>
            <p>Here is a quick overview of your activities.</p>
          </Tile>
        </Column>
      </Row>

      {/* Main Dashboard Grid */}
      <Grid className="bx--grid">
        {/* Row 1: Key Metrics */}
        <Row className="bx--row">
          <Column sm={4} md={4} lg={4} className="bx--col">
            <Tile>
              <div className="tile-icon">
                <ArrowRight className="icon-color-blue" />
              </div>
              <h3>Total Revenue</h3>
              <p className="tile-stat">$25,000</p>
            </Tile>
          </Column>
          <Column sm={4} md={4} lg={4} className="bx--col">
            <Tile>
              <div className="tile-icon">
                <CheckmarkFilled className="icon-color-green" />
              </div>
              <h3>Projects Completed</h3>
              <p className="tile-stat">45</p>
            </Tile>
          </Column>
          <Column sm={4} md={4} lg={4} className="bx--col">
            <Tile>
              <div className="tile-icon">
                <WarningFilled className="icon-color-yellow" />
              </div>
              <h3>Pending Tasks</h3>
              <p className="tile-stat">12</p>
            </Tile>
          </Column>
          <Column sm={4} md={4} lg={4} className="bx--col">
            <Tile>
              <div className="tile-icon">
                <WarningFilled className="icon-color-red" />
              </div>
              <h3>Canceled Projects</h3>
              <p className="tile-stat">3</p>
            </Tile>
          </Column>
        </Row>

        {/* Row 2: Recent Activity and Notifications */}
        <Row className="bx--row">
          <Column sm={4} md={8} lg={8} className="bx--col">
            <Tile>
              <h3>Recent Activity</h3>
              <StructuredListWrapper>
                <StructuredListHead>
                  <StructuredListRow head>
                    <StructuredListCell head>Activity</StructuredListCell>
                    <StructuredListCell head>Time</StructuredListCell>
                  </StructuredListRow>
                </StructuredListHead>
                <StructuredListBody>
                  <StructuredListRow>
                    <StructuredListCell>Project A completed successfully</StructuredListCell>
                    <StructuredListCell>2 hrs ago</StructuredListCell>
                  </StructuredListRow>
                  <StructuredListRow>
                    <StructuredListCell>New task assigned to you</StructuredListCell>
                    <StructuredListCell>5 hrs ago</StructuredListCell>
                  </StructuredListRow>
                  <StructuredListRow>
                    <StructuredListCell>Team meeting scheduled</StructuredListCell>
                    <StructuredListCell>1 day ago</StructuredListCell>
                  </StructuredListRow>
                </StructuredListBody>
              </StructuredListWrapper>
            </Tile>
          </Column>
          <Column sm={4} md={8} lg={8} className="bx--col">
            <Tile>
              <h3>Notifications</h3>
              <ul className="notifications-list">
                <li>New message from Admin</li>
                <li>Task completed successfully</li>
                <li>Pending approval for Project B</li>
              </ul>
              <Button>View All</Button>
            </Tile>
          </Column>
        </Row>

        {/* Row 3: Quick Actions */}
        <Row className="bx--row">
          <Column sm={4} md={16} lg={16} className="bx--col">
            <Tile>
              <h3>Quick Actions</h3>
              <div className="quick-actions">
                <Button kind="primary">Create New Project</Button>
                <Button kind="secondary">View Reports</Button>
                <Button kind="tertiary">Manage Team</Button>
                <Button kind="danger">Settings</Button>
              </div>
            </Tile>
          </Column>
        </Row>
      </Grid>
    </div>
  );
};

export default Dashboard;
