import prisma from "../utils/prisma.js";

// GET ACTIVE PROMOTIONS
const getPromotions = async (req, res) => {
  try {
    const now = new Date();

    const promotions = await prisma.promotion.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now }
      }
    });

    res.json(promotions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE (ADMIN)
const createPromotion = async (req, res) => {
  try {
    const data = req.body;

    const promotion = await prisma.promotion.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate)
      }
    });

    res.json(promotion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE (ADMIN)
const updatePromotion = async (req, res) => {
  try {
    const data = req.body;

    const promotion = await prisma.promotion.update({
      where: { id: Number(req.params.id) },
      data: {
        ...data,
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) })
      }
    });

    res.json(promotion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE (ADMIN)
const deletePromotion = async (req, res) => {
  try {
    await prisma.promotion.delete({
      where: { id: Number(req.params.id) }
    });

    res.json({ message: "Promotion deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion
};