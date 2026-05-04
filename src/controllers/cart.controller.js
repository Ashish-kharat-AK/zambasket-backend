import prisma from "../utils/prisma.js";

// GET CART
const getCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD TO CART
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id }
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId
      }
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
      });
    }

    res.json({ message: "Item added to cart" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE QUANTITY
// const updateCartItem = async (req, res) => {
//   try {
//     const itemId = Number(req.params.id);
//     const { quantity } = req.body;

//     if (!itemId) {
//       return res.status(400).json({ error: "Invalid item ID" });
//     }

//     if (!quantity || quantity < 1) {
//       return res.status(400).json({ error: "Invalid quantity" });
//     }

//     // 🔥 FIRST CHECK ITEM EXISTS
//     const existing = await prisma.cartItem.findUnique({
//       where: { id: itemId },
//     });

//     if (!existing) {
//       return res.status(404).json({ error: "Cart item not found" });
//     }

//     // 🔥 UPDATE
//     const updated = await prisma.cartItem.update({
//       where: { id: itemId },
//       data: {
//         quantity: Number(quantity),
//       },
//     });

//     res.json(updated);
//   } catch (err) {
//     console.error("UPDATE ERROR:", err); // 🔥 IMPORTANT
//     res.status(500).json({ error: err.message });
//   }
// };

const updateCartItem = async (req, res) => {
  try {
    const itemId = Number(req.params.id);
    const { quantity } = req.body;

    if (!itemId || quantity < 1) {
      return res.status(400).json({ error: "Invalid data" });
    }

    // 🔥 get user's cart first
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // 🔥 ensure item belongs to THIS user
    const existing = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id, // 🔥 IMPORTANT
      },
    });

    if (!existing) {
      return res.status(404).json({ error: "Item not found in your cart" });
    }

    const updated = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: Number(quantity) },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
// REMOVE ITEM
// const removeCartItem = async (req, res) => {
//   try {
//     const itemId = Number(req.params.id);

//     const existing = await prisma.cartItem.findUnique({
//       where: { id: itemId },
//     });

//     if (!existing) {
//       return res.status(404).json({ error: "Item not found" });
//     }

//     await prisma.cartItem.delete({
//       where: { id: itemId },
//     });

//     res.json({ message: "Item removed" });
//   } catch (err) {
//     console.error("DELETE ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };
const removeCartItem = async (req, res) => {
  try {
    const itemId = Number(req.params.id);

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
    });

    const existing = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id, // 🔥 IMPORTANT
      },
    });

    if (!existing) {
      return res.status(404).json({ error: "Item not found in your cart" });
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    res.json({ message: "Item removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// CLEAR CART
const clearCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id }
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    }

    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};