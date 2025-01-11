const functions = require("firebase-functions");
const stripe = require("stripe")(functions.config().stripe.secret_key); // Load Stripe key

exports.createCheckoutSession = functions.https.onRequest(async (req, res) => {
    try {
        const { amount } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Hosting Service",
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: "https://your-production-url.com/success",
            cancel_url: "https://your-production-url.com/cancel",
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).send("Internal Server Error");
    }
});