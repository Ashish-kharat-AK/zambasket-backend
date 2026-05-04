import prisma from "../utils/prisma.js";

//  STATS
const getStats = async (req, res) => {
  try {
    const users = await prisma.user.count();
    const products = await prisma.product.count();
    const orders = await prisma.order.count();

    const revenueData = await prisma.order.aggregate({
      _sum: { total: true }
    });

    res.json({
      users,
      products,
      orders,
      revenue: revenueData._sum.total || 0
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RECENT ORDERS
const getRecentOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        items: true
      }
    });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOW STOCK PRODUCTS
const getLowStockProducts = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5;

    const products = await prisma.product.findMany({
      where: {
        stock: { lt: threshold }
      }
    });

    res.json(products);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  getStats,
  getRecentOrders,
  getLowStockProducts
};