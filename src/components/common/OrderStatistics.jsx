import { useState, useMemo } from "react";
import { filterOrdersByDateRange, getOrderCountsByType } from "../../utils/orderFilters";

const OrderStatistics = ({ orders = [], title = "Order Statistics" }) => {
  // Set initial dates to last week and today to show recent data
  const today = new Date().toISOString().split("T")[0];
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [startDate, setStartDate] = useState(oneWeekAgo);
  const [endDate, setEndDate] = useState(today);

  const filteredOrders = useMemo(() => {
    return filterOrdersByDateRange(orders, startDate, endDate);
  }, [orders, startDate, endDate]);

  const counts = useMemo(() => {
    return getOrderCountsByType(filteredOrders);
  }, [filteredOrders]);

  return (
    <div className="order-statistics">
      <h2>{title}</h2>
      
      <div className="date-filter">
        <div className="filter-group">
          <label htmlFor="start-date">From Date:</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={endDate}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="end-date">To Date:</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
          />
        </div>
      </div>

      <div className="stats-grid">
        <article className="stat">
          <span>Tea Orders</span>
          <strong>{counts.tea}</strong>
        </article>
        <article className="stat">
          <span>Coffee Orders</span>
          <strong>{counts.coffee}</strong>
        </article>
        <article className="stat">
          <span>Total Orders</span>
          <strong>{counts.total}</strong>
        </article>
      </div>
    </div>
  );
};

export default OrderStatistics;
