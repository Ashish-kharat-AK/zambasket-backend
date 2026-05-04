import prisma from "../utils/prisma.js";

// GET ALL
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET SINGLE + PRODUCTS
const getCategory = async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(req.params.id) },
      include: { products: true }
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
const createCategory = async (req, res) => {
  try {
    const category = await prisma.category.create({
      data: req.body
    });

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
const updateCategory = async (req, res) => {
  try {
    const category = await prisma.category.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
// const deleteCategory = async (req, res) => {
//   try {
//     await prisma.category.delete({
//       where: { id: Number(req.params.id) }
//     });

//     res.json({ message: "Category deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
const deleteCategory = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);

    // 🔥 first delete products
    await prisma.product.deleteMany({
      where: { categoryId }
    });

    // 🔥 then delete category
    await prisma.category.delete({
      where: { id: categoryId }
    });

    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};