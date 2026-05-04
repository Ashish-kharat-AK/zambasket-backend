// import prisma from "../utils/prisma.js";

// // GET ALL PRODUCTS
// const getProducts = async (req, res) => {
//   try {
//     const { category, search, sort } = req.query;

//     const products = await prisma.product.findMany({
//       where: {
//         category: category || undefined,
//         name: search
//           ? { contains: search, mode: "insensitive" }
//           : undefined
//       },
//       orderBy:
//         sort === "price_asc"
//           ? { price: "asc" }
//           : sort === "price_desc"
//           ? { price: "desc" }
//           : { createdAt: "desc" }
//     });

//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // GET FEATURED
// const getFeaturedProducts = async (req, res) => {
//   try {
//     const products = await prisma.product.findMany({
//       where: { isFeatured: true }
//     });

//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // GET SINGLE PRODUCT
// const getProduct = async (req, res) => {
//   try {
//     const product = await prisma.product.findUnique({
//       where: { id: Number(req.params.id) }
//     });

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // CREATE PRODUCT (ADMIN)
// const createProduct = async (req, res) => {
//   try {
//     const product = await prisma.product.create({
//       data: req.body
//     });

//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // UPDATE PRODUCT
// const updateProduct = async (req, res) => {
//   try {
//     const product = await prisma.product.update({
//       where: { id: Number(req.params.id) },
//       data: req.body
//     });

//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // DELETE PRODUCT
// const deleteProduct = async (req, res) => {
//   try {
//     await prisma.product.delete({
//       where: { id: Number(req.params.id) }
//     });

//     res.json({ message: "Product deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export {
//   getProducts,
//   getFeaturedProducts,
//   getProduct,
//   createProduct,
//   updateProduct,
//   deleteProduct
// };
import prisma from "../utils/prisma.js";


// ✅ GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const { category, search, sort } = req.query;

    const products = await prisma.product.findMany({
      where: {
        // 🔥 category filter (correct way)
        category: category
          ? { name: category }
          : undefined,

        // 🔍 search
        name: search
          ? { contains: search, mode: "insensitive" }
          : undefined
      },

      // 🔥 IMPORTANT (category show karayla)
      include: {
        category: true
      },

      // 🔃 sorting
      orderBy:
        sort === "price_asc"
          ? { price: "asc" }
          : sort === "price_desc"
          ? { price: "desc" }
          : { createdAt: "desc" }
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ GET FEATURED PRODUCTS
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true },

      include: {
        category: true // 🔥 add
      }
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ GET SINGLE PRODUCT
const getProduct = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },

      include: {
        category: true // 🔥 add
      }
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// const createProduct = async (req, res) => {
//   try {
//     const { name, description, price, image, categoryId, isFeatured } = req.body;

//     if (!name || !price || !categoryId) {
//       return res.status(400).json({ message: "Required fields missing" });
//     }

//     const product = await prisma.product.create({
//       data: {
//         name,
//         description,
//         price: parseFloat(price),
//         image,
//         categoryId: parseInt(categoryId),
//         isFeatured: isFeatured || false
//       }
//     });

//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, categoryId, isFeatured } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        image,
        isFeatured: isFeatured || false,

        // 🔥 IMPORTANT FIX
        category: {
          connect: { id: Number(categoryId) }
        }
      }
    });

    res.json({ message: "Product created successfully", product });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: Number(req.params.id) }
    });

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export {
  getProducts,
  getFeaturedProducts,
  getProduct, 
  createProduct,
  updateProduct,
  deleteProduct
};