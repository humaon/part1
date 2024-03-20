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

// store the loaded files

const productsData = loadDataFromFile("products.json");
const ordersData = loadDataFromFile("orders.json");
const discountsData = loadDataFromFile("discounts.json");

function calculateSalesSummary(products, orders, discounts) {
  // Step 1: Calculate Total Sales Before Discount

  let totalSalesBeforeDiscount = 0;
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const product = products.find((prod) => prod.sku === item.sku);
      if (product) {
        totalSalesBeforeDiscount += product.price * item.quantity;
      }
    });
  });

  // Step 2: Calculate Total Sales After Discount Code is Applied

  let totalSalesAfterDiscount = totalSalesBeforeDiscount;
  let totalDiscountAmount = 0;
  orders.forEach((order) => {
    const discount = order.discount
      ? discounts.find((discount) => discount.key === order.discount)
      : null;
    let discountPercentage = 0;
    if (discount) {
      discountPercentage = discount.value;
      const discountAmount = totalSalesBeforeDiscount * discount.value;
      totalSalesAfterDiscount -= discountAmount;
      totalDiscountAmount += discountAmount;
    }
  });

  // Step 3: Calculate Total Amount of Money Lost via Customer Using Discount Codes

  const totalMoneyLost = totalDiscountAmount;

  // Step 4: Calculate Average Discount per Customer as a Percentage

  const totalCustomers = orders.length;
  const averageDiscountPercentage =
    totalCustomers > 0
      ? (totalDiscountAmount / totalCustomers / totalSalesBeforeDiscount) * 100
      : 0;

  // Return the results

  return {
    totalSalesBeforeDiscount: totalSalesBeforeDiscount,
    totalSalesAfterDiscount: totalSalesAfterDiscount,
    totalMoneyLost: totalMoneyLost,
    averageDiscountPercentage: averageDiscountPercentage,
  };
}

const salesSummary = calculateSalesSummary(
  productsData,
  ordersData,
  discountsData
);
console.log(salesSummary);
