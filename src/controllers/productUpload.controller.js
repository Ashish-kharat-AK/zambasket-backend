export const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const image = req.file.filename;

    res.json({
      message: "Image uploaded successfully",
      image,
      url: `http://localhost:5000/uploads/${image}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};