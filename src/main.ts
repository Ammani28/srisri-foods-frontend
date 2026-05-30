import './style.css'

// TypeScript కి విండోలో Razorpay ఉందనే విషయం తెలియజేస్తున్నాం
declare global {
  interface Window {
    Razorpay: any;
  }
}

// 1. DATA: Menu with Correct & Real Fruit Images
const menuData = [
  { 
    id: "mng-abc", 
    name: "Premium ABC Detox", 
    price: 120, 
    desc: "Apple, Beetroot, Carrot. Rich in antioxidants, zero sugar.", 
    color: "#991b1b",
    img: "https://pharmeasy.in/blog/wp-content/uploads/2026/02/ABC-741x452.webp" 
  },
  { 
    id: "mng-amla", 
    name: "Pure Amla Energy", 
    price: 60, 
    desc: "Pure organic Indian gooseberry extract for immunity booster.", 
    color: "#65a30d",
    img: "https://img.freepik.com/premium-photo/ayurvedic-amla-indian-gooseberry-juice_974629-135656.jpg" 
  },
  { 
    id: "mng-ashgourd", 
    name: "Ash Gourd Detox Juice", 
    price: 80, 
    desc: "Highly alkaline juice, excellent for gut health & cooling.", 
    color: "#ecfccb",
    img: "https://eastsidewriters.com/wp-content/uploads/2023/03/ash_gourd_juice_benefits_eastside_writers_11zon-1024x683.webp" 
  },
  { 
    id: "mng-green", 
    name: "Organic Green Glow", 
    price: 110, 
    desc: "Spinach, Mint, Cucumber, Celery, and Lemon healthy mix.", 
    color: "#166534",
    img: "https://imgeng.jagran.com/images/2023/sep/green-juices1695616617661.jpg" 
  },
  { 
    id: "aft-watermelon", 
    name: "Watermelon Juice", 
    price: 70, 
    desc: "Pure hydrating fresh watermelon juice. No added water.", 
    color: "#ef4444",
    img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80" 
  },
  { 
    id: "frt-poha", 
    name: "Fresh Pomegranate Juice", 
    price: 140, 
    desc: "100% pure ruby red pomegranate pearls cold-pressed.", 
    color: "#b91c1c",
    img: "https://images.unsplash.com/photo-1541344999736-83eca272f6fc?auto=format&fit=crop&w=600&q=80" 
  },
  { 
    id: "frt-pineapple", 
    name: "Pineapple Mint Twist", 
    price: 90, 
    desc: "Fresh sweet pineapple juice with a touch of fresh mint.", 
    color: "#eab308", 
    img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80" 
  },
  { 
    id: "frt-mosambi", 
    name: "Sweet Lime (Mosambi)", 
    price: 80, 
    desc: "Freshly squeezed sweet lime juice full of Vitamin C.", 
    color: "#facc15", 
    img: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80" 
  },
  { 
    id: "aft-mango", 
    name: "Royal Mango Shake", 
    price: 130, 
    desc: "Alphonso mango thick pulp milk. Rich and delicious.", 
    color: "#f97316",
    img: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80" 
  },
  { 
    id: "shk-banana", 
    name: "Dry Fruit Banana Shake", 
    price: 100, 
    desc: "Blend of fresh bananas, dates, almonds, and skimmed milk.", 
    color: "#fef08a",
    img: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80" 
  },
  { 
    id: "shk-avocado", 
    name: "Avocado Honey Smoothie", 
    price: 160, 
    desc: "Creamy premium butter fruit blended with raw honey.", 
    color: "#a3e635",
    img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80" 
  }
];

// 2. DATA: Subscription Packages 
const packagesData = [
  { 
    id: "pkg-weight", 
    name: "Weight Loss Package (Weekly)", 
    price: 799, 
    desc: "7 Days of morning detox juices delivered daily to your doorstep.",
    color: "#065f46",
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80"
  },
  { 
    id: "pkg-glow", 
    name: "Skin Glow Package (Monthly)", 
    price: 2999, 
    desc: "30 Days mix of premium ABC juice and organic greens extract.",
    color: "#9a3412",
    img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80"
  },
  { 
    id: "pkg-family", 
    name: "Family Health Box (Weekly)", 
    price: 1999, 
    desc: "Daily morning immunity shots and cold-pressed juices for 4 members.",
    color: "#1e3a8a",
    img: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80"
  }
];

let cart: any[] = [];

// 3. RENDER: Layout Setup
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div style="font-family: sans-serif; min-height: 100vh; background-color: #f9fafb; color: #333; scroll-behavior: smooth;">
    
    <header style="background: #1e4620; color: white; padding: 15px 40px; position: sticky; top: 0; z-index: 100; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <h1 style="margin: 0; font-size: 22px; tracking-spacing: 1px;">SRI SRI HEALTHY FOODS</h1>
      <nav style="display: flex; gap: 20px; align-items: center;">
        <a href="#home" style="color: white; text-decoration: none; font-weight: 500;">Home</a>
        <a href="#menu" style="color: white; text-decoration: none; font-weight: 500;">Menu</a>
        <a href="#packages" style="color: white; text-decoration: none; font-weight: 500;">Packages</a>
        <a href="#about" style="color: white; text-decoration: none; font-weight: 500;">About Us</a>
        <a href="#contact" style="color: white; text-decoration: none; font-weight: 500;">Contact</a>
        <button id="cart-btn" style="background: #f97316; border: none; color: white; padding: 8px 16px; font-weight: bold; border-radius: 20px; cursor: pointer; margin-left: 10px;">
          Cart (<span id="cart-count">0</span>)
        </button>
      </nav>
    </header>

    <div id="success-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 1000; justify-content: center; align-items: center;">
      <div style="background: white; padding: 40px; border-radius: 16px; text-align: center; max-width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
        <div style="font-size: 60px; color: #1e4620; margin-bottom: 15px;">✅</div>
        <h3 style="margin: 0 0 10px 0; color: #1e4620; font-size: 24px;">Order Placed!</h3>
        <p style="color: #666; margin-bottom: 25px; line-height: 1.5;">Thank you! Your healthy order has been received successfully.</p>
        <button id="close-modal-btn" style="background: #1e4620; color: white; border: none; padding: 10px 30px; font-weight: bold; border-radius: 6px; cursor: pointer;">Awesome</button>
      </div>
    </div>

    <div style="max-width: 1200px; margin: 0 auto; padding: 20px; display: grid; grid-template-columns: 1fr; gap: 20px;" id="main-layout">
      
      <div id="content-area">
        <section id="home" style="padding: 80px 40px; background: linear-gradient(rgba(30,70,32,0.8), rgba(30,70,32,0.9)), url('https://images.unsplash.com/photo-1610970881699-44a55b4cfd87?auto=format&fit=crop&w=1200&q=80'); background-size: cover; color: white; text-align: center; border-radius: 16px; margin-bottom: 40px;">
          <h2 style="font-size: 42px; margin-bottom: 15px;">100% Pure, Organic & Cold-Pressed Juices</h2>
          <p style="font-size: 18px; max-width: 600px; margin: 0 auto 25px auto; opacity: 0.9;">No added sugars, no preservatives. Direct health delivered raw to your doorstep every morning.</p>
          <a href="#menu" style="background: #f97316; color: white; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 30px; display: inline-block;">Explore Menu</a>
        </section>

        <section id="menu" style="margin-bottom: 60px; padding-top: 20px;">
          <h2 style="color: #1e4620; border-bottom: 3px solid #1e4620; padding-bottom: 10px; margin-bottom: 25px;">Fresh Juice & Shake Menu</h2>
          <div id="menu-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px;"></div>
        </section>

        <section id="packages" style="margin-bottom: 60px; padding-top: 20px;">
          <h2 style="color: #1e4620; border-bottom: 3px solid #1e4620; padding-bottom: 10px; margin-bottom: 25px;">Healthy Subscription Packages</h2>
          <div id="packages-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px;"></div>
        </section>

        <section id="about" style="background: white; padding: 40px; border-radius: 16px; margin-bottom: 60px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
          <h2 style="color: #1e4620; margin-top: 0;">About Sri Sri Healthy Foods</h2>
          <p style="line-height: 1.6; color: #555; font-size: 16px;">We are dedicated to bringing premium wellness directly to your routine. Our juices are extracted using advanced cold-press technology that keeps all vital enzymes, vitamins, and minerals perfectly alive. Founded on ayurvedic principles and clean eating, we promise raw transparency in every bottle.</p>
        </section>

        <section id="contact" style="background: #1e4620; color: white; padding: 40px; border-radius: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
          <div>
            <h2 style="margin-top: 0;">Get In Touch</h2>
            <p style="opacity: 0.9;">Have questions about our monthly diet packages or delivery locations? Drop us a message!</p>
            <p>📍 Main Road, Healthy Food Street, City</p>
            <p>📞 +91 98765 43210</p>
            <p>✉️ support@srisrihealthyfoods.com</p>
          </div>
          <div style="background: white; padding: 25px; border-radius: 12px; color: #333;">
            <h4 style="margin-top: 0; margin-bottom: 15px; font-size: 18px;">Send a Message</h4>
            <input type="text" id="msg-name" placeholder="Your Name" style="width:92%; padding:10px; margin-bottom:12px; border:1px solid #ccc; border-radius:6px;" />
            <input type="email" id="msg-email" placeholder="Email Address" style="width:92%; padding:10px; margin-bottom:15px; border:1px solid #ccc; border-radius:6px;" />
            <button id="msg-submit-btn" style="background:#1e4620; color:white; border:none; width:100%; padding:10px; font-weight:bold; border-radius:6px; cursor:pointer;">Submit</button>
          </div>
        </section>
      </div>

      <div id="checkout-section" style="background: white; padding: 25px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); display: none; height: fit-content; position: sticky; top: 90px;">
        <h3 style="margin-top:0; color:#1e4620; font-size:22px; border-bottom:1px solid #eee; padding-bottom:10px;">Review Cart</h3>
        <div id="cart-items-list" style="margin-bottom: 20px; max-height: 150px; overflow-y: auto;"></div>
        
        <input type="text" id="cust-name" placeholder="Your Full Name" style="width: 92%; padding: 10px; margin-bottom: 12px; border: 1px solid #ccc; border-radius: 6px;" />
        <input type="tel" id="cust-phone" placeholder="Phone Number" style="width: 92%; padding: 10px; margin-bottom: 12px; border: 1px solid #ccc; border-radius: 6px;" />
        <textarea id="cust-address" placeholder="Complete Delivery Address..." rows="3" style="width: 92%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 6px; font-family: sans-serif; resize: none;"></textarea>
        
        <div style="font-size: 20px; font-weight: bold; margin-bottom: 20px; display:flex; justify-content:space-between;"><span>Total:</span><span style="color:#f97316;">₹<span id="cart-total">0</span></span></div>
        <button id="pay-btn" style="width: 100%; background: #f97316; color: white; border: none; padding: 14px; font-weight: bold; font-size:16px; border-radius: 8px; cursor: pointer;">Proceed to Pay</button>
      </div>

    </div>
  </div>
`;

// 4. UI INJECTION WITH SIZE-FIXED IMAGE WRAPPER
const menuGrid = document.getElementById('menu-grid')!;
const packagesGrid = document.getElementById('packages-grid')!;
const cartCount = document.getElementById('cart-count')!;
const checkoutSection = document.getElementById('checkout-section')!;
const mainLayout = document.getElementById('main-layout')!;
const cartTotal = document.getElementById('cart-total')!;
const cartItemsList = document.getElementById('cart-items-list')!;
const successModal = document.getElementById('success-modal')!;

function createJuiceCard(item: any, isPackage = false) {
  const card = document.createElement('div');
  const primaryColor = isPackage ? "#c2410c" : "#1e4620";
  const bgColor = isPackage ? "#fdfaf6" : "white";
  const borderColor = isPackage ? "#fbd5b3" : "#eee";

  card.style.cssText = `background: ${bgColor}; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); display: flex; flex-direction: column; overflow: hidden; border: 1px solid ${borderColor};`;
  
  card.innerHTML = `
    <div style="position: relative; width: 100%; height: 180px; background: ${item.color}; display: flex; justify-content: center; align-items: center; overflow: hidden;">
      <div style="position: absolute; color: rgba(255,255,255,0.7); font-size: 48px; font-weight: bold; text-transform: uppercase;">
        ${item.name.charAt(0)}🥤
      </div>
      <img src="${item.img}" alt="${item.name}" style="position: absolute; top:0; left:0; width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s ease;" onerror="this.style.opacity='0';" />
      ${isPackage ? `<span style="position: absolute; top: 10px; left: 10px; background: #fbe5d3; color: #c2410c; font-size: 10px; font-weight: bold; padding: 4px 8px; border-radius: 12px; z-index: 1;">SUBSCRIPTION</span>` : ''}
    </div>

    <div style="padding: 15px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="margin: 0 0 5px 0; color: ${primaryColor}; font-size:17px; font-weight: bold;">${item.name}</h3>
        <p style="margin: 0 0 15px 0; color: #666; font-size: 13px; line-height: 1.4; min-height: 36px;">${item.desc}</p>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 5px;">
        <span style="font-size: 19px; font-weight: bold; color:#222;">₹${item.price}</span>
        <button class="add-btn" data-id="${item.id}" data-type="${isPackage ? 'pkg' : 'menu'}" style="background: ${primaryColor}; color: white; border: none; padding: 8px 14px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 13px;">
          ${isPackage ? 'Subscribe' : 'Add to Cart'}
        </button>
      </div>
    </div>
  `;
  return card;
}

// Load arrays
menuData.forEach(item => menuGrid.appendChild(createJuiceCard(item, false)));
packagesData.forEach(pkg => packagesGrid.appendChild(createJuiceCard(pkg, true)));

// 5. EVENT LISTENERS
function updateCartUI() {
  cartCount.innerText = cart.length.toString();
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.innerText = total.toString();
  
  cartItemsList.innerHTML = '';
  cart.forEach(item => {
    const d = document.createElement('div');
    d.style.cssText = "display:flex; justify-content:space-between; font-size:14px; margin-bottom:8px; border-bottom:1px dashed #eee; padding-bottom:4px;";
    d.innerHTML = `<span>${item.name}</span><span style="font-weight:bold;">₹${item.price}</span>`;
    cartItemsList.appendChild(d);
  });

  if (cart.length > 0) {
    mainLayout.style.gridTemplateColumns = "2.5fr 1.2fr";
    checkoutSection.style.display = 'block';
  } else {
    mainLayout.style.gridTemplateColumns = "1fr";
    checkoutSection.style.display = 'none';
  }
}

function setupClickHandlers() {
  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', (e: any) => {
      const id = e.target.getAttribute('data-id');
      const type = e.target.getAttribute('data-type');
      const targetList = type === 'menu' ? menuData : packagesData;
      const item = targetList.find(p => p.id === id);
      
      if (item) {
        cart.push(item);
        updateCartUI();
      }
    });
  });
}

setupClickHandlers();

// Modal close button logic
document.getElementById('close-modal-btn')!.addEventListener('click', () => {
  successModal.style.display = 'none';
});

// ... మిగిలిన కోడ్ అంతా అలాగే ఉంచండి ...

document.getElementById('pay-btn')!.addEventListener('click', async () => {
  const name = (document.getElementById('cust-name') as HTMLInputElement).value;
  const phone = (document.getElementById('cust-phone') as HTMLInputElement).value;
  const address = (document.getElementById('cust-address') as HTMLInputElement).value;

  if(!name || !phone || !address) {
    return alert("Please fill Name, Phone and Address!");
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  try {
    // బ్యాకెండ్ కి రిక్వెస్ట్ పంపిస్తున్నాం
    const response = await fetch('https://srisri-healthy-foods-1.onrender.com/api/create-order', {
  method: 'POST',
  mode: 'cors',
  headers: { 
    'Content-Type': 'application/json' 
  },
  body: JSON.stringify({ amount: totalAmount })
});
    const data = await response.json();

    if (!data.success) {
      return alert("Backend Server Error: " + (data.message || "Failed to create order"));
    }

    // Razorpay ఆప్షన్స్
    const options = {
      key: "rzp_test_rS9xJp4E1G9vO8", // మీ Key ID
      amount: data.amount,
      currency: "INR",
      name: "Sri Sri Healthy Foods",
      description: "Healthy Juice Order",
      order_id: data.order_id, 
      handler: function (response: any) {
        alert("Payment Successful! ID: " + response.razorpay_payment_id);
        cart = []; // కార్ట్ క్లియర్
        updateCartUI();
        successModal.style.display = 'flex';
      },
      prefill: {
        name: name,
        contact: phone
      },
      theme: { color: "#1e4620" }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

} catch (err: any) {
  console.error("Full Error Details:", err); // ఇది కన్సోల్‌లో అసలు ఎర్రర్ ఏంటో చూపిస్తుంది
  alert("Error: " + err.message); 
}
});