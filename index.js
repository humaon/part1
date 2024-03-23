const fs = require("fs");

// Function to load data from JSON file
function loadDataFromFile(filename) {
  try {
    const data = fs.readFileSync(filename, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename} data:`, error);
    return [];
  }
}

const products = loadDataFromFile("products.json");
const orders = loadDataFromFile("orders.json");
const discounts = loadDataFromFile("discounts.json");

// Function to calculate sales summary
function calculateSalesSummary(productsData, ordersData, discountsData) {
  // Calculate total sales before discount is applied
  let totalSalesBeforeDiscount = 0;
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const product = products.find((prod) => prod.sku === item.sku);
      if (product) {
        totalSalesBeforeDiscount += product.price * item.quantity;
      }
    });
  });

  // Calculate total sales after discount code is applied
  let totalSalesAfterDiscount = totalSalesBeforeDiscount;
  let totalAmountLost = 0;
  orders.forEach((order) => {
    const discount = order.discount
      ? discounts.find((d) => d.key === order.discount)
      : null;
    if (discount) {
      const discountValue = discount.value;
      const discountAmount = totalSalesBeforeDiscount * discountValue;
      totalSalesAfterDiscount -= discountAmount;
      totalAmountLost += discountAmount;
    }
  });

  // Calculate average discount per customer as a percentage
  const totalCustomers = orders.length;
  // Calculate average discount per customer as a percentage
  const averageDiscountPercentage =
    totalCustomers > 0 ? (totalAmountLost / totalSalesBeforeDiscount) * 100 : 0;

  return {
    totalSalesBeforeDiscount: totalSalesBeforeDiscount,
    totalSalesAfterDiscount: totalSalesAfterDiscount,
    totalAmountLost: totalAmountLost,
    averageDiscountPercentage: averageDiscountPercentage,
  };
}
const salesSummary = calculateSalesSummary(products, orders, discounts);
console.log(salesSummary);
