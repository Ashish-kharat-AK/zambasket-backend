import prisma from "../utils/prisma.js";

// GET reviews by product
const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: Number(req.params.productId) },
      include: { user: true }
    });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE review
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const review = await prisma.review.create({
      data: {
        productId,
        rating,
        comment,
        userId: req.user.id
      }
    });

    res.json(review);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE own review
const updateReview = async (req, res) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: Number(req.params.id) }
    });

    if (!review) return res.status(404).json({ message: "Not found" });

    if (review.userId !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const updated = await prisma.review.update({
      where: { id: review.id },
      data: req.body
    });

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE review
const deleteReview = async (req, res) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: Number(req.params.id) }
    });

    if (!review) return res.status(404).json({ message: "Not found" });

    if (review.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    await prisma.review.delete({
      where: { id: review.id }
    });

    res.json({ message: "Review deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  getReviewsByProduct,
  createReview,
  updateReview,
  deleteReview
};