'use client';

import React, { FC } from "react";
import { Grid, Row, Column, Tile } from "@carbon/react";
import { Fade } from '@carbon/icons-react';
import './page.css'; // Carbon's default styles are automatically applied.

export const Dashboard: FC = () => {
  const data = {
    totalSales: 5000,
    totalProducts: 120,
    totalCategories: 15,
    totalUsers: 10,
    pendingTickets: 8,
    totalTransactions: 120,
  };

  return (
    <div className="bx--grid bx--grid--full-width">
      <h3 className="bx--text-align--center bx--type--heading-3 bx--type--bold">Dashboard Summary</h3>
      <Grid className="bx--grid--full-width">
        {/* First Row */}
        <Row>
          <Column sm={12} md={6} lg={4}>
            <Tile className="bx--tile bx--tile--bordered bx--tile--interactive dashboard-tile">
              <div className="tile-icon">
                <Fade />
              </div>
              <h4>Total Sales</h4>
              <p className="bx--type--body-strong">${data.totalSales.toLocaleString()}</p>
            </Tile>
          </Column>
          <Column sm={12} md={6} lg={4}>
            <Tile className="bx--tile bx--tile--bordered bx--tile--interactive dashboard-tile">
              <div className="tile-icon">
                <Fade />
              </div>
              <h4>Total Products</h4>
              <p className="bx--type--body-strong">{data.totalProducts}</p>
            </Tile>
          </Column>
          <Column sm={12} md={6} lg={4}>
            <Tile className="bx--tile bx--tile--bordered bx--tile--interactive dashboard-tile">
              <div className="tile-icon">
                <Fade />
              </div>
              <h4>Total Categories</h4>
              <p className="bx--type--body-strong">{data.totalCategories}</p>
            </Tile>
          </Column>
        </Row>
        {/* Second Row */}
        <Row>
          <Column sm={12} md={6} lg={4}>
            <Tile className="bx--tile bx--tile--bordered bx--tile--interactive dashboard-tile">
              <div className="tile-icon">
                <Fade />
              </div>
              <h4>Total Users</h4>
              <p className="bx--type--body-strong">{data.totalUsers}</p>
            </Tile>
          </Column>
          <Column sm={12} md={6} lg={4}>
            <Tile className="bx--tile bx--tile--bordered bx--tile--interactive dashboard-tile">
              <div className="tile-icon">
                <Fade />
              </div>
              <h4>Pending Tickets</h4>
              <p className="bx--type--body-strong">{data.pendingTickets}</p>
            </Tile>
          </Column>
          <Column sm={12} md={6} lg={4}>
            <Tile className="bx--tile bx--tile--bordered bx--tile--interactive dashboard-tile">
              <div className="tile-icon">
                <Fade />
              </div>
              <h4>Total Transactions</h4>
              <p className="bx--type--body-strong">{data.totalTransactions}</p>
            </Tile>
          </Column>
        </Row>
      </Grid>
    </div>
  );
};

export default Dashboard;
