require("dotenv").config();
const express = require("express"),
	cros = require("cors"),
	bodyParser = require("body-parser"),
	app = express(),
	PORT = process.env.PORT || 8000;

app.use(cros());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.post("/payment", async (req, res) => {
	const { amount, id } = req.body;
	console.log("Amount and ID", amount, id);
	try {
		const payment = await stripe.paymentIntents.create({
			amount: amount,
			currency: "EUR",
			description: "Car Rent Payment",
			payment_method: id,
			confirm: true,
			return_url: "http://localhost:3000/success",
		});
		console.log("Payment", payment);
		res.json({
			message: "Payment Successful",
			success: true,
		});
	} catch (error) {
		console.log("Error", error);
		res.json({
			message: "Payment Failed",
			success: false,
		});
	}
});

app.listen(PORT, () => {
	console.log("Server is running on port 8000...");
	console.log((URL = `http://localhost:${PORT}`));
});
