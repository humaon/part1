const fs = require("fs");

function loadDataFromFile(filename) {
  try {
    const data = fs.readFileSync(filename, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename} data:`, error);
    return [];
  }
}

const productsData = loadDataFromFile("products.json");
const ordersData = loadDataFromFile("orders.json");
const discountsData = loadDataFromFile("discounts.json");

function calculateSalesSummary(products, orders, discounts) {
  let totalSalesBeforeDiscount = 0;
  let totalDiscountAmount = 0;
  let totalAppliedDiscountsPercentage = 0;

  orders.forEach((order) => {
    const appliedDiscount = discounts.find(
      (discount) => discount.key === order.discount
    );
    totalAppliedDiscountsPercentage += appliedDiscount?.value ?? 0;
    order.items.forEach((item) => {
      const product = products.find((prod) => prod.sku === item.sku);
      if (product) {
        totalSalesBeforeDiscount += product.price * item.quantity;
        if (appliedDiscount) {
          totalDiscountAmount +=
            product.price * item.quantity * appliedDiscount.value;
        }
      }
    });
  });

  const totalCustomers = orders.length;

  const averageDiscountPercentage =
    totalCustomers > 0
      ? (totalAppliedDiscountsPercentage * 100) / totalCustomers
      : 0;

  const totalSalesAfterDiscount =
    totalSalesBeforeDiscount - totalDiscountAmount;

  return {
    totalSalesBeforeDiscount,
    totalSalesAfterDiscount,
    totalDiscountAmount,
    averageDiscountPercentage,
  };
}

const salesSummary = calculateSalesSummary(
  productsData,
  ordersData,
  discountsData
);
console.log(salesSummary);
