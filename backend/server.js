const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const mongoose = require('mongoose');

const app = express();
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT'], credentials: true })); 
app.use(express.json());

// MongoDB Connect చెయ్యి
mongoose.connect('mongodb+srv://kotipalliammani_db_user:mini%402821@cluster0.jc0ynfz.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    console.log('MongoDB Connected!');
    seedMenu(); // డేటాబేస్ కనెక్ట్ అవ్వగానే మెనూ ఐటమ్స్ చెక్ చేసి సేవ్ చేస్తుంది
  })
  .catch(err => console.error(err));

// 1. ఆర్డర్ Schema ని డిఫైన్ చెయ్యి
const Order = mongoose.model('Order', new mongoose.Schema({
  razorpay_payment_id: String,
  amount: Number,
  status: { type: String, default: 'Success' }, 
  customerName: String,  
  phoneNumber: String,
  address: String,
  date: { type: Date, default: Date.now }
}));

// 2. [ఇక్కడ యాడ్ చేశాం బ్రో]: మెనూ ఐటమ్స్ కోసం కొత్త Schema & Model
const Menu = mongoose.model('Menu', new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  desc: String,
  img: String
}));

const razorpayInstance = new Razorpay({
  key_id: 'rzp_test_Svrv4mVtCwNH4X', 
  key_secret: '4v8BIN1MyY9DulIVIadkUFKO'
});

// ==========================================
// MENU API ROUTES (కొత్తగా యాడ్ చేసినవి)
// ==========================================

// [API 1]: ఫ్రంటెండ్‌కి డేటాబేస్ నుండి మెనూ ఐటమ్స్ పంపించే రూట్
app.get('/api/get-menu', async (req, res) => {
  try {
    const menuItems = await Menu.find({});
    res.json({ success: true, menu: menuItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// [సహాయక ఫంక్షన్]: మొదటిసారి నీ MongoDB లో మెనూ డేటా లేకపోతే ఆటోమేటిక్‌గా లోడ్ చేస్తుంది
async function seedMenu() {
  try {
    const count = await Menu.countDocuments();
    // ఒకవేళ ఆల్రెడీ డేటా ఉంటే మళ్ళీ ఇన్సర్ట్ చేయదు బ్రో
    if (count === 0) {
      const initialMenu = [
        { id: "mng-abc", name: "Premium ABC Detox", price: 120, desc: "Apple, Beetroot, Carrot. Rich in antioxidants, zero sugar.", img: "https://pharmeasy.in/blog/wp-content/uploads/2026/02/ABC-741x452.webp" },
        { id: "mng-amla", name: "Pure Amla Energy", price: 60, desc: "Pure organic Indian gooseberry extract for immunity booster.", img: "https://img.freepik.com/premium-photo/ayurvedic-amla-indian-gooseberry-juice_974629-135656.jpg" },
        { id: "mng-ashgourd", name: "Ash Gourd Detox Juice", price: 80, desc: "Highly alkaline juice, excellent for gut health & cooling.", img: "https://eastsidewriters.com/wp-content/uploads/2023/03/ash_gourd_juice_benefits_eastside_writers_11zon-1024x683.webp" },
        { id: "mng-green", name: "Organic Green Glow", price: 110, desc: "Spinach, Mint, Cucumber, Celery, and Lemon healthy mix.", img: "https://imgeng.jagran.com/images/2023/sep/green-juices1695616617661.jpg" },
        { id: "aft-watermelon", name: "Watermelon Juice", price: 70, desc: "Pure hydrating fresh watermelon juice. No added water.", img: "/watermelon-pineapple-juice.jpg" },
        { id: "frt-poha", name: "Fresh Sapota Juice", price: 140, desc: "Indulge in the velvety, caramel-like sweetness of freshly blended sapota juice", img: "/sapota-juice.jpg" },
        { id: "frt-pineapple", name: "Pineapple Mint Twist", price: 90, desc: "Fresh sweet pineapple juice with a touch of fresh mint.", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80" },
        { id: "frt-mosambi", name: "Sweet Lime (Mosambi)", price: 80, desc: "Freshly squeezed sweet lime juice full of Vitamin C.", img: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80" },
        { id: "aft-mango", name: "Grape Juice", price: 130, desc: "Alphonso mango thick pulp milk. Rich and delicious.", img: "/Grape-juice.jpg" },
        { id: "shk-banana", name: "Dry Fruit Banana Shake", price: 100, desc: "Blend of fresh bananas, dates, almonds, and skimmed milk.", img: "/dry_fruit_shake_jpg.png" },
        { id: "shk-avocado", name: "Mango Milkshake", price: 160, desc: "Creamy premium butter fruit blended with raw honey.", img: "/mango-milkshake-recipe.jpg" }
      ];
      await Menu.insertMany(initialMenu);
      console.log("🌱 All Menu items seeded successfully into MongoDB Atlas!");
    }
  } catch (error) {
    console.error("Error seeding menu:", error);
  }
}

// ==========================================
// ORDERS API ROUTES 
// ==========================================

// Create Order Route
app.post('/api/create-order', async (req, res) => {
  try {
    const options = { amount: Number(req.body.amount) * 100, currency: "INR", receipt: "order_" + Date.now() };
    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order_id: order.id, amount: order.amount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// పేమెంట్ తర్వాత డేటా సేవ్ చేయడానికి రూట్
app.post('/api/save-order', async (req, res) => {
  try {
    const { payment_id, amount, name, phone, address } = req.body;
    const newOrder = new Order({ 
      razorpay_payment_id: payment_id, 
      amount: amount, 
      status: 'Success', 
      customerName: name,    
      phoneNumber: phone,
      address: address
    });
    await newOrder.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// డేట్ వైస్ ఆర్డర్లను తెచ్చేలా అడ్మిన్ API
app.get('/api/get-orders', async (req, res) => {
  try {
    const { date } = req.query; 
    let query = {};

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const orders = await Order.find(query).sort({ date: -1 });
    res.json({ success: true, orders: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ఆర్డర్ స్టేటస్ ని 'Delivered' గా మార్చే రూట్
app.put('/api/update-status/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId, 
      { status: 'Delivered' }, 
      { new: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order marked as Delivered!', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// సర్వర్ ని స్టార్ట్ చేస్తున్నాం
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));