import axios from "axios";
import { sendEmail } from "../utils/sendEmail.js";

export const createPayment = async (req, res) => {
    try {

        // 🧪 TEST MODE (NO OTP)
        if (process.env.NODE_ENV === "development") {
            return res.json({
                success: true,
                link: "http://localhost:5173/success?status=successful&transaction_id=TEST123"
            });
        }

        // 🔴 PRODUCTION FLOW (Flutterwave)
        const { amount, email, phone, name } = req.body;

        const payload = {
            tx_ref: "tx-" + Date.now(),
            amount: amount || 100,
            currency: "ZMW",
            redirect_url: "http://localhost:5173/success",
            payment_options: "card",

            customer: {
                email: email || "test@gmail.com",
                phonenumber: phone || "254712345678",
                name: name || "Test User"
            },
            customizations: {
                title: "Zambasket Payment"
            }
        };

        const response = await axios.post(
            "https://api.flutterwave.com/v3/payments",
            payload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return res.json({
            success: true,
            link: response.data.data.link
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Payment failed"
        });
    }
};

// 🔥 VERIFY FUNCTION (IMPORTANT)
export const verifyPayment = async (req, res) => {
    try {
        const { id } = req.params;

        const response = await axios.get(
            `https://api.flutterwave.com/v3/transactions/${id}/verify`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`
                }
            }
        );

        const data = response.data.data;

        // ✅ MAIL SEND
        if (data.status === "successful") {
            await sendEmail(
                data.customer.email,
                "Payment Successful",
                `Your payment of ${data.amount} was successful`
            );
        }

        res.json({
            success: true,
            data
        });

    } catch (error) {
        res.status(500).json({
            success: false
        });
    }
};