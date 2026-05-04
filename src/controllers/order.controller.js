  import prisma from "../utils/prisma.js";

  // GET ALL (ADMIN / USER)
 const getOrders = async (req, res) => {
  try {
    console.log("FETCHING FOR USER:", req.user);

    const isAdmin = req.user.role?.toLowerCase() === "admin";

    const orders = await prisma.order.findMany({
      where: isAdmin ? {} : { userId: Number(req.user.id) }, // ✅ FIX
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

  // GET SINGLE
  const getOrder = async (req, res) => {
    try {
      const order = await prisma.order.findUnique({
        where: { id: Number(req.params.id) },
        include: { items: true }
      });

      if (!order) return res.status(404).json({ message: "Order not found" });

      // user only own order
      if (req.user.role !== "admin" && order.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      res.json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // PLACE ORDER (FROM CART)
  const createOrder = async (req, res) => {
  try {
    const { items, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items" });
    }

    console.log("CREATING ORDER FOR USER:", req.user.id); // 🔥 DEBUG

    const order = await prisma.order.create({
      data: {
        userId: Number(req.user.id), // ✅ MUST FIX
        total: Number(total),
        status: "pending",

        items: {
          create: items.map((item) => ({
            productId: Number(item.productId),
            quantity: Number(item.quantity),
            price: Number(item.price),
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    res.json(order);
  } catch (err) {
    console.log("CREATE ORDER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

  // UPDATE STATUS (ADMIN)
  const updateOrderStatus = async (req, res) => {
    try {
      let { status } = req.body;

      // ✅ convert to uppercase
      status = status.toLowerCase();

      const order = await prisma.order.update({
        where: { id: Number(req.params.id) },
        data: { status }
      });

      res.json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // CANCEL ORDER (USER)
  const cancelOrder = async (req, res) => {
    try {
      const order = await prisma.order.findUnique({
        where: { id: Number(req.params.id) }
      });

      if (!order) return res.status(404).json({ message: "Not found" });

      if (order.userId !== req.user.id) {
        return res.status(403).json({ message: "Not allowed" });
      }

      if (order.status !== "pending") {
        return res.status(400).json({ message: "Cannot cancel" });
      }

      const updated = await prisma.order.update({
        where: { id: order.id },
        data: { status: "cancelled" }
      });

      res.json(updated);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
const downloadInvoice = async (req, res) => {
  try {
    const orderId = Number(req.params.id);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔐 security check
    if (
      req.user.role !== "admin" &&
      order.userId !== Number(req.user.id)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const doc = new jsPDF();

    // 🧾 HEADER
    doc.setFontSize(18);
    doc.text("INVOICE", 20, 20);

    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, 20, 30);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 20, 40);

    doc.text(`Customer: ${req.user.name || "User"}`, 20, 50);

    let y = 70;

    // 🛒 ITEMS
    doc.text("Items:", 20, y);
    y += 10;

    order.items.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.product?.name || "Product"} x ${
          item.quantity
        } = ₹${item.price * item.quantity}`,
        20,
        y
      );
      y += 10;
    });

    // 💰 TOTAL
    doc.text(`Total: ₹${order.total}`, 20, y + 10);

    // 📄 SEND PDF
    const pdf = doc.output("arraybuffer");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${order.id}.pdf`
    );

    res.send(Buffer.from(pdf));

  } catch (err) {
    console.log("INVOICE ERROR:", err);
    res.status(500).json({ message: "Invoice generation failed" });
  }
};
  export {
    getOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    cancelOrder,
     downloadInvoice,
  };