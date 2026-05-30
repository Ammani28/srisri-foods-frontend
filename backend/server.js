app.post('/api/create-order', async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // అమౌంట్ పైసాలో ఉండాలి
      currency: "INR",
      receipt: "order_rcptid_11"
    };
    
    const order = await razorpayInstance.orders.create(options);
    res.json(order);
  } catch (error) {
    console.log("Razorpay Error:", error);
    res.status(500).json({ error: error.message });
  }
});