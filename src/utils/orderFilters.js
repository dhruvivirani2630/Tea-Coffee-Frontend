/**
 * Filter orders by date range
 * @param {Array} orders - Array of orders
 * @param {String} startDate - Start date (ISO format or date string)
 * @param {String} endDate - End date (ISO format or date string)
 * @returns {Array} - Filtered orders
 */
export const filterOrdersByDateRange = (orders, startDate, endDate) => {
  if (!orders || !Array.isArray(orders)) return [];
  if (!startDate || !endDate) return orders;

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  return orders.filter((order) => {
    // Get order date from multiple possible fields
    const orderDateStr = order.dateTime || order.date_time || order.createdAt || order.createdDate || order.date;
    
    if (!orderDateStr) {
      // If no date field exists, include the order
      return true;
    }

    const orderDate = new Date(orderDateStr);
    
    // If date is invalid, include the order anyway
    if (isNaN(orderDate.getTime())) {
      return true;
    }

    return orderDate >= start && orderDate <= end;
  });
};

/**
 * Get order counts by drink type
 * @param {Array} orders - Array of orders
 * @returns {Object} - Object with tea and coffee counts
 */
export const getOrderCountsByType = (orders) => {
  if (!orders || !Array.isArray(orders)) {
    return { tea: 0, coffee: 0, total: 0 };
  }

  const counts = {
    tea: 0,
    coffee: 0,
    total: orders.length,
  };

  orders.forEach((order) => {
    const drinkType = (order.drinkType || order.drink_type || "").toLowerCase().trim();
    
    if (!drinkType) {
      // If no drink type, don't count it
      return;
    }

    const quantity = order.quantity || 1;

    if (drinkType.includes("tea")) {
      counts.tea += quantity;
    } else if (drinkType.includes("coffee")) {
      counts.coffee += quantity;
    }
  });

  return counts;
};

/**
 * Get user's orders
 * @param {Array} orders - All orders
 * @param {Object} user - Current user object
 * @returns {Array} - Orders for the user
 */
export const getUserOrders = (orders, user) => {
  if (!orders || !Array.isArray(orders) || !user) return [];

  // Get all possible user identifiers
  const userId = String(user?.id || "");
  const userEmployeeId = String(user?.employeeId || "");
  const userEmail = String(user?.email || "");
  
  return orders.filter((order) => {
    // Get all possible order identifiers
    const orderUserId = String(order.userId || order.user_id || "");
    const orderEmployeeId = String(order.employeeId || order.employee_id || "");
    
    // Check if any user identifier matches any order identifier
    return (
      (userId && (orderUserId === userId || orderEmployeeId === userId)) ||
      (userEmployeeId && (orderUserId === userEmployeeId || orderEmployeeId === userEmployeeId)) ||
      (userEmail && (orderUserId === userEmail || orderEmployeeId === userEmail))
    );
  });
};
