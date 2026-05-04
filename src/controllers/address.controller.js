import prisma from "../utils/prisma.js";

// GET ALL
const getAddresses = async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id }
    });

    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
const createAddress = async (req, res) => {
  try {
    const data = req.body;

    const address = await prisma.address.create({
      data: {
        ...data,
        userId: req.user.id
      }
    });

    res.json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
const updateAddress = async (req, res) => {
  try {
    const address = await prisma.address.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });

    res.json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
const deleteAddress = async (req, res) => {
  try {
    await prisma.address.delete({
      where: { id: Number(req.params.id) }
    });

    res.json({ message: "Address deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SET DEFAULT
const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false }
    });

    const address = await prisma.address.update({
      where: { id: Number(req.params.id) },
      data: { isDefault: true }
    });

    res.json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
};