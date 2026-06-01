import './style.css'

// TypeScript కి విండోలో Razorpay ఉందనే విషయం తెలియజేస్తున్నాం
declare global {
  interface Window {
    Razorpay: any;
  }
}

// 💡 ప్రస్తుతానికి లోకల్‌హోస్ట్ ఉంచు బ్రో. బ్యాకెండ్ లైవ్ URL వచ్చాక దాన్ని ఇక్కడ ఒక్క చోట మారుస్తే చాలు!
const API_BASE_URL = 'https://srisri-foods-backend.onrender.com';

// 1. DATA: ఖాళీ అరే డిక్లేర్ చేస్తున్నాం - డేటాబేస్ నుండి ఐటమ్స్ ఇందులో లోడ్ అవుతాయి
let menuData: any[] = [];

// 2. DATA: Subscription Packages 
const packagesData = [
  { id: "pkg-weight", name: "Weight Loss Package (Weekly)", price: 799, desc: "7 Days of morning detox juices delivered daily to your doorstep.", color: "#065f46", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80" },
  { id: "pkg-glow", name: "Skin Glow Package (Monthly)", price: 2999, desc: "30 Days mix of premium ABC juice and organic greens extract.", color: "#9a3412", img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80" },
  { id: "pkg-family", name: "Family Health Box (Weekly)", price: 1999, desc: "Daily morning immunity shots and cold-pressed juices for 4 members.", color: "#1e3a8a", img: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80" }
];

let cart: any[] = [];
const ADMIN_PASSWORD = "admin"; 

// 3. RENDER: Layout Setup
const appElement = document.querySelector<HTMLDivElement>('#app')!;
appElement.innerHTML = `
  <div style="font-family: sans-serif; min-height: 100vh; background-color: #f9fafb; color: #333; scroll-behavior: smooth;">
    
    <header style="background: #1e4620; color: white; padding: 15px 40px; position: sticky; top: 0; z-index: 100; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <h1 style="margin: 0; font-size: 22px; letter-spacing: 1px; cursor: pointer;" id="nav-logo">SRI SRI HEALTHY FOODS</h1>
      <nav style="display: flex; gap: 20px; align-items: center;">
        <a href="#home" style="color: white; text-decoration: none; font-weight: 500;">Home</a>
        <a href="#menu" style="color: white; text-decoration: none; font-weight: 500;">Menu</a>
        <a href="#packages" style="color: white; text-decoration: none; font-weight: 500;">Packages</a>
        <a href="#about" style="color: white; text-decoration: none; font-weight: 500;">About Us</a>
        <a href="#contact" style="color: white; text-decoration: none; font-weight: 500;">Contact</a>
        <button id="admin-btn" style="background: #374151; border: none; color: white; padding: 6px 14px; font-weight: bold; border-radius: 6px; cursor: pointer;">Admin Panel</button>
        <button id="cart-btn" style="background: #f97316; border: none; color: white; padding: 8px 16px; font-weight: bold; border-radius: 20px; cursor: pointer;">
          Cart (<span id="cart-count">0</span>)
        </button>
      </nav>
    </header>

    <div id="success-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 1000; justify-content: center; align-items: center;">
      <div style="background: white; padding: 40px; border-radius: 16px; text-align: center; max-width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
        <div style="font-size: 60px; color: #1e4620; margin-bottom: 15px;">✅</div>
        <h3 style="margin: 0 0 10px 0; color: #1e4620; font-size: 24px;">Order Placed!</h3>
        <p style="color: #666; margin-bottom: 25px; line-height: 1.5;">Thank you! Your healthy order has been received successfully and saved to the database.</p>
        <button id="close-modal-btn" style="background: #1e4620; color: white; border: none; padding: 10px 30px; font-weight: bold; border-radius: 6px; cursor: pointer;">Awesome</button>
      </div>
    </div>

    <div id="admin-login-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 1000; justify-content: center; align-items: center;">
      <div style="background: white; padding: 30px; border-radius: 12px; width: 100%; max-width: 350px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); position: relative;">
        <span id="close-login-btn" style="position: absolute; top: 15px; right: 20px; font-size: 20px; cursor: pointer; color: #666; font-weight: bold;">✕</span>
        <h3 style="margin: 0 0 15px 0; color: #1e4620; text-align: center; font-size: 20px;">Admin Verification</h3>
        <p style="margin: 0 0 15px 0; color: #666; font-size: 13px; text-align: center;">Enter security password to view sensitive customer orders database.</p>
        <input type="password" id="admin-password-input" placeholder="Enter Admin Password" style="width: 93%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; text-align: center;" />
        <button id="login-submit-btn" style="width: 100%; background: #1e4620; color: white; border: none; padding: 12px; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 15px;">Access Dashboard</button>
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
            <p>📍 SAL Residency,Infornt Of Annavaram Temple,Annavaram</p>
            <p>📞 +91 85220 44662</p>
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
        <div id="cart-items-list" style="margin-bottom: 20px; max-height: 200px; overflow-y: auto; padding-right: 5px;"></div>
        
        <input type="text" id="cust-name" placeholder="Your Full Name" style="width: 92%; padding: 10px; margin-bottom: 12px; border: 1px solid #ccc; border-radius: 6px;" />
        <input type="tel" id="cust-phone" placeholder="Phone Number" style="width: 92%; padding: 10px; margin-bottom: 12px; border: 1px solid #ccc; border-radius: 6px;" />
        <textarea id="cust-address" placeholder="Complete Delivery Address..." rows="3" style="width: 92%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 6px; font-family: sans-serif; resize: none;"></textarea>
        
        <div style="font-size: 20px; font-weight: bold; margin-bottom: 20px; display:flex; justify-content:space-between;"><span>Total:</span><span style="color:#f97316;">₹<span id="cart-total">0</span></span></div>
        <button id="pay-btn" style="width: 100%; background: #f97316; color: white; border: none; padding: 14px; font-weight: bold; font-size:16px; border-radius: 8px; cursor: pointer;">Proceed to Pay</button>
      </div>
    </div>

    <div id="admin-layout" style="max-width: 1200px; margin: 0 auto; padding: 20px; display: none;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
        <h2 style="color: #1e4620; margin: 0;">Sri Sri Foods - Orders Management Panel</h2>
        
        <div style="display: flex; gap: 10px; align-items: center; background: #e5e7eb; padding: 8px 15px; border-radius: 8px;">
          <label for="order-date-filter" style="font-weight: bold; font-size: 14px; color: #374151;">Filter by Date:</label>
          <input type="date" id="order-date-filter" style="padding: 6px; border: 1px solid #ccc; border-radius: 4px; font-weight: bold;" />
          <button id="clear-filter-btn" style="background: #ef4444; color: white; border: none; padding: 6px 12px; font-size: 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">Show All</button>
        </div>

        <button id="back-to-store-btn" style="background: #1e4620; color: white; border: none; padding: 10px 20px; font-weight: bold; border-radius: 6px; cursor: pointer;">Back to Store</button>
      </div>
      
      <div style="background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); padding: 20px; overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
          <thead>
            <tr style="background: #f3f4f6; color: #374151; border-bottom: 2px solid #e5e7eb;">
              <th style="padding: 12px;">Customer Name</th>
              <th style="padding: 12px;">Phone</th>
              <th style="padding: 12px;">Delivery Address</th>
              <th style="padding: 12px;">Amount Paid</th>
              <th style="padding: 12px;">Order Date</th> <th style="padding: 12px;">Status</th>
              <th style="padding: 12px; text-align: center;">Action</th> </tr>
          </thead>
          <tbody id="admin-orders-rows">
            </tbody>
        </table>
      </div>
    </div>

  </div>
`;

// 4. MongoDB నుండి మెనూ ఐటమ్స్ తెచ్చే లాజిక్
async function fetchMenuFromDatabase() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/get-menu`);
    const data = await res.json();
    
    if (data.success) {
      menuData = data.menu; // డేటాబేస్ లోని మెనూని మన అరేకి అసైన్ చేస్తున్నాం
      renderMenuUI();       // డేటా లోడ్ అయ్యాక UI ని బిల్డ్ చేసే ఫంక్షన్
    }
  } catch (err) {
    console.error("Failed to load menu from DB", err);
    const menuGrid = document.getElementById('menu-grid');
    if (menuGrid) {
      menuGrid.innerHTML = `<p style="color:red; text-align:center; font-weight:bold; grid-column: 1/-1;">Failed to load Menu from database!</p>`;
    }
  }
}

// 5. మెనూ ఐటమ్స్ ని డైనమిక్‌గా స్క్రీన్ మీద డిస్‌ప్లే చేసే లాజిక్
function renderMenuUI() {
  const menuGrid = document.getElementById('menu-grid')!;
  menuGrid.innerHTML = ''; // పాత కార్డ్స్ డూప్లికేట్ అవ్వకుండా క్లియర్ చేయడానికి
  
  menuData.forEach(item => {
    const card = document.createElement('div');
    card.style.background = "white";
    card.style.borderRadius = "12px";
    card.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
    card.style.overflow = "hidden";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.justifyContent = "space-between";
    card.style.paddingBottom = "15px";

    card.innerHTML = `
      <img src="${item.img}" style="width:100%; height:180px; object-fit:cover;" alt="${item.name}">
      <div style="padding: 15px 15px 5px 15px; text-align: center;">
        <h4 style="margin: 0 0 8px 0; color:#1e4620; font-size:18px;">${item.name}</h4>
        <p style="margin: 0 0 10px 0; font-size: 13px; color: #666; min-height: 34px;">${item.desc}</p>
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">₹${item.price}</div>
      </div>
    `;
    
    const btn = document.createElement('button');
    btn.innerText = "Add to Cart";
    btn.style.cssText = "background: #1e4620; color: white; border: none; padding: 8px 16px; font-weight: bold; border-radius: 6px; cursor: pointer; margin: 0 auto; display: block;";
    btn.onclick = () => addToCart(item);
    
    card.appendChild(btn);
    menuGrid.appendChild(card);
  });
}

// 6. LOGIC: Render Subscription Packages Dynamically
const packagesGrid = document.getElementById('packages-grid')!;
packagesData.forEach(pkg => {
  const card = document.createElement('div');
  card.style.background = "white";
  card.style.borderRadius = "12px";
  card.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
  card.style.overflow = "hidden";
  card.style.display = "flex";
  card.style.flexDirection = "column";
  card.style.justifyContent = "space-between";
  card.style.paddingBottom = "15px";
  card.style.borderTop = `5px solid ${pkg.color}`;

  card.innerHTML = `
    <div style="padding: 15px; text-align: center;">
      <span style="font-size:11px; background:#f3f4f6; padding:3px 8px; border-radius:10px; font-weight:bold; color:${pkg.color}; text-transform:uppercase;">Subscription</span>
      <h4 style="margin: 8px 0; color:#333; font-size:16px;">${pkg.name}</h4>
      <p style="margin: 0 0 12px 0; font-size: 13px; color: #666; min-height: 34px;">${pkg.desc}</p>
      <div style="font-size: 20px; font-weight: bold; margin-bottom: 10px; color:${pkg.color}">₹${pkg.price}</div>
    </div>
  `;

  const btn = document.createElement('button');
  btn.innerText = "Subscribe";
  btn.style.cssText = `background: ${pkg.color}; color: white; border: none; padding: 8px 20px; font-weight: bold; border-radius: 6px; cursor: pointer; margin: 0 auto; display: block;`;
  btn.onclick = () => addToCart(pkg);

  card.appendChild(btn);
  packagesGrid.appendChild(card);
});

// 7. CART MANAGEMENT LOGIC
function addToCart(item: any) {
  cart.push(item);
  updateCartUI();
  document.getElementById('main-layout')!.style.gridTemplateColumns = "2fr 1fr";
  document.getElementById('checkout-section')!.style.display = 'block';
}

function updateCartUI() {
  document.getElementById('cart-count')!.innerText = cart.length.toString();
  const listContainer = document.getElementById('cart-items-list')!;
  listContainer.innerHTML = '';
  
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const itemRow = document.createElement('div');
    itemRow.style.cssText = "display:flex; justify-content:space-between; font-size:14px; margin-bottom:10px; background:#f9fafb; padding:8px; border-radius:6px;";
    itemRow.innerHTML = `
      <span>${item.name}</span>
      <div>
        <span style="font-weight:bold; margin-right:10px;">₹${item.price}</span>
        <span class="remove-item" style="color:red; cursor:pointer; font-weight:bold;">✕</span>
      </div>
    `;
    
    itemRow.querySelector('.remove-item')!.addEventListener('click', () => {
      cart.splice(index, 1);
      updateCartUI();
      if(cart.length === 0) {
        document.getElementById('main-layout')!.style.gridTemplateColumns = "1fr";
        document.getElementById('checkout-section')!.style.display = 'none';
      }
    });
    listContainer.appendChild(itemRow);
  });
  document.getElementById('cart-total')!.innerText = total.toString();
}

document.getElementById('close-modal-btn')!.onclick = () => {
  document.getElementById('success-modal')!.style.display = 'none';
};

// 8. NAVIGATION WITH PASSWORD SECURITY LOGIC
document.getElementById('admin-btn')!.onclick = () => {
  document.getElementById('admin-login-modal')!.style.display = 'flex';
  (document.getElementById('admin-password-input') as HTMLInputElement).value = '';
  document.getElementById('admin-password-input')!.focus();
};

document.getElementById('close-login-btn')!.onclick = () => {
  document.getElementById('admin-login-modal')!.style.display = 'none';
};

document.getElementById('login-submit-btn')!.onclick = async () => {
  const enteredPassword = (document.getElementById('admin-password-input') as HTMLInputElement).value;
  
  if (enteredPassword === ADMIN_PASSWORD) {
    document.getElementById('admin-login-modal')!.style.display = 'none';
    document.getElementById('main-layout')!.style.display = 'none';
    document.getElementById('admin-layout')!.style.display = 'block';
    
    const todayStr = new Date().toISOString().split('T')[0];
    (document.getElementById('order-date-filter') as HTMLInputElement).value = todayStr;
    
    await loadAdminOrders(todayStr); 
  } else {
    alert("❌ Wrong Password! Access Denied.");
  }
};

document.getElementById('admin-password-input')!.addEventListener('keypress', async (e: any) => {
  if (e.key === 'Enter') {
    document.getElementById('login-submit-btn')!.click();
  }
});

document.getElementById('back-to-store-btn')!.onclick = () => {
  document.getElementById('admin-layout')!.style.display = 'none';
  document.getElementById('main-layout')!.style.display = 'grid';
};
document.getElementById('nav-logo')!.onclick = () => {
  document.getElementById('admin-layout')!.style.display = 'none';
  document.getElementById('main-layout')!.style.display = 'grid';
};

document.getElementById('order-date-filter')!.addEventListener('change', async (e: any) => {
  const selectedDate = e.target.value;
  await loadAdminOrders(selectedDate);
});

document.getElementById('clear-filter-btn')!.onclick = async () => {
  (document.getElementById('order-date-filter') as HTMLInputElement).value = '';
  await loadAdminOrders('');
};

// 9. FETCH ORDERS FROM BACKEND
async function loadAdminOrders(selectedDate: string = '') {
  const rowsContainer = document.getElementById('admin-orders-rows')!;
  rowsContainer.innerHTML = '<tr><td colspan="7" style="padding:20px; text-align:center;">Loading Orders from Database...</td></tr>';
  
  try {
    let url = `${API_BASE_URL}/api/get-orders`;
    if (selectedDate) {
      url += `?date=${selectedDate}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    
    if (data.success && data.orders.length > 0) {
      rowsContainer.innerHTML = '';
      data.orders.forEach((order: any) => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = "1px solid #e5e7eb";
        
        const orderDate = new Date(order.date).toLocaleDateString('en-IN');

        const statusBg = order.status === 'Delivered' ? '#d1fae5' : '#fef3c7';
        const statusColor = order.status === 'Delivered' ? '#065f46' : '#d97706';

        tr.innerHTML = `
          <td style="padding: 12px; font-weight:500;">${order.customerName || 'N/A'}</td>
          <td style="padding: 12px;">${order.phoneNumber || 'N/A'}</td>
          <td style="padding: 12px; max-width:250px; word-break:break-word;">${order.address || 'N/A'}</td>
          <td style="padding: 12px; font-weight:bold; color:#1e4620;">₹${order.amount}</td>
          <td style="padding: 12px; font-weight:500; color:#4b5563;">${orderDate}</td>
          <td style="padding: 12px;"><span id="status-badge-${order._id}" style="background:${statusBg}; color:${statusColor}; padding:4px 8px; border-radius:12px; font-size:12px; font-weight:bold;">${order.status}</span></td>
          <td style="padding: 12px; text-align: center;" id="action-cell-${order._id}"></td>
        `;

        const actionCell = tr.querySelector(`#action-cell-${order._id}`)!;
        if (order.status !== 'Delivered') {
          const deliverBtn = document.createElement('button');
          deliverBtn.innerText = "Mark Delivered";
          deliverBtn.style.cssText = "background: #2563eb; color: white; border: none; padding: 6px 12px; font-size: 11px; font-weight: bold; border-radius: 4px; cursor: pointer;";
          
          deliverBtn.onclick = async () => {
            if (confirm(`Are you sure this order for ${order.customerName} is delivered?`)) {
              await updateOrderStatus(order._id);
            }
          };
          actionCell.appendChild(deliverBtn);
        } else {
          actionCell.innerHTML = `<span style="color:#10b981; font-weight:bold; font-size:12px;">Completed</span>`;
        }

        rowsContainer.appendChild(tr);
      });
    } else {
      rowsContainer.innerHTML = '<tr><td colspan="7" style="padding:20px; text-align:center; color:#666;">No orders found for this selected date.</td></tr>';
    }
  } catch (err) {
    rowsContainer.innerHTML = '<tr><td colspan="7" style="padding:20px; text-align:center; color:red; font-weight:bold;">Failed to connect server API!</td></tr>';
  }
}

async function updateOrderStatus(orderId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/update-status/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    
    if (data.success) {
      alert("🎉 Order successfully marked as Delivered!");
      const currentFilterDate = (document.getElementById('order-date-filter') as HTMLInputElement).value;
      await loadAdminOrders(currentFilterDate);
    } else {
      alert("Error: " + data.message);
    }
  } catch (err) {
    alert("Failed to update status on server!");
  }
}

// 10. PAYMENT & SAVE TRANSACTION
document.getElementById('pay-btn')!.addEventListener('click', async () => {
  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
  
  const nameInput = (document.getElementById('cust-name') as HTMLInputElement).value.trim();
  const phoneInput = (document.getElementById('cust-phone') as HTMLInputElement).value.trim();
  const addressInput = (document.getElementById('cust-address') as HTMLTextAreaElement).value.trim();

  if (!nameInput || !phoneInput || !addressInput) {
    alert("Please fill Name, Phone and Address details to deliver your order!");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: totalAmount })
    });

    const data = await response.json();
    if (data.success) {
        const options = {
          key: "rzp_test_Svrv4mVtCwNH4X", 
          amount: data.amount,
          currency: "INR",
          name: "Sri Sri Healthy Foods",
          order_id: data.order_id, 
          handler: async function (response: any) {
            try {
                const saveResponse = await fetch(`${API_BASE_URL}/api/save-order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        payment_id: response.razorpay_payment_id,
                        amount: totalAmount,
                        name: nameInput,
                        phone: phoneInput,
                        address: addressInput
                    })
                });

                const saveData = await saveResponse.json();
                if (saveData.success) {
                    document.getElementById('success-modal')!.style.display = 'flex';
                    cart = [];
                    updateCartUI();
                    document.getElementById('main-layout')!.style.gridTemplateColumns = "1fr";
                    document.getElementById('checkout-section')!.style.display = 'none';
                    (document.getElementById('cust-name') as HTMLInputElement).value = '';
                    (document.getElementById('cust-phone') as HTMLInputElement).value = '';
                    (document.getElementById('cust-address') as HTMLTextAreaElement).value = '';
                }
            } catch (err) {
                console.error("Database Save Error:", err);
                alert("Payment Success, but failed to save order!");
            }
          },
          theme: { color: "#1e4620" }
        };
        new window.Razorpay(options).open();
    } else {
      alert("Backend error creating order: " + data.message);
    }
  } catch (err) { 
    alert("Error connecting to backend server!"); 
  }
});

// [యాప్ స్టార్ట్ అవ్వగానే రన్ అవుతుంది]: మొదటిసారి డేటాబేస్ నుండి మెనూని లాక్కుంటుంది బ్రో
fetchMenuFromDatabase();