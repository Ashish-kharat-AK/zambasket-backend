    // import express from "express";
    // import axios from "axios";
    // import dotenv from "dotenv";

    // dotenv.config();

    // const router = express.Router();

    // // ✅ FIRST declare, THEN use

    // router.get("/", (req, res) => {
    //     res.send("Payment route working ✅");
    // });

    // // 👉 Create Payment
    // router.post("/pay", async (req, res) => {
    //     try {
    //         const { amount, email, phone, name } = req.body;

    //     const payload = {
    //     tx_ref: "tx-" + Date.now(),
    //     amount: amount || 100,
    //     currency: "ZMW",
    //     redirect_url: "http://localhost:5173/success",

    //     // 🔥 ONLY CARD (OTP avoid karaycha asel tar)
    //     payment_options: "card",

    //     customer: {
    //         email: email || "test@gmail.com",
    //         phonenumber: phone || "254712345678",
    //         name: name || "Test User"
    //     },
    //     customizations: {
    //         title: "Zambasket Payment"
    //     }
    // };

    //         const response = await axios.post(
    //             "https://api.flutterwave.com/v3/payments",
    //             payload,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
    //                     "Content-Type": "application/json"
    //                 }
    //             }
    //         );

    //         return res.json({
    //             success: true,
    //             link: response.data.data.link
    //         });

    //     } catch (error) {
    //         console.log(error.response?.data || error.message);

    //         return res.status(500).json({
    //             success: false,
    //             message: "Payment failed"
    //         });
    //     }
    // });

    // export default router;
    import express from "express";
import { createPayment, verifyPayment } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/pay", createPayment);
router.get("/verify/:id", verifyPayment);

export default router;