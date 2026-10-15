// Data Produk Awal dengan Kategori dan URL Foto Menu
let products = [
    { id: 1, name: "Nasi Goreng", category: "Makanan", price: 18000, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=300&q=80" },
    { id: 2, name: "Mie Ayam", category: "Makanan", price: 15000, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=300&q=80" },
    { id: 3, name: "Kopi Hitam", category: "Minuman", price: 10000, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80" },
    { id: 4, name: "Es Teh Manis", category: "Minuman", price: 5000, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=300&q=80" },
    { id: 5, name: "Jus Alpukat", category: "Minuman", price: 12000, image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=300&q=80" },
    { id: 6, name: "Roti Bakar", category: "Cemilan", price: 12000, image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=300&q=80" },
    { id: 7, name: "Kentang Goreng", category: "Cemilan", price: 10000, image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=300&q=80" },
    { id: 8, name: "Air Mineral", category: "Minuman", price: 4000, image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=300&q=80" }
];

let cart = [];
let orderHistory = [];
let currentCategory = "all"; // Default kategori awal "Semua"

// Elemen DOM
const productGrid = document.getElementById('productGrid');
const cartItemsContainer = document.getElementById('cartItems');
const customerNameInput = document.getElementById('customerName');
const subtotalPriceElement = document.getElementById('subtotalPrice');
const discountInput = document.getElementById('discountInput');
const totalPriceElement = document.getElementById('totalPrice');
const cashAmountInput = document.getElementById('cashAmount');
const changeAmountElement = document.getElementById('changeAmount');
const btnPay = document.getElementById('btnPay');
const btnClear = document.getElementById('btnClear');
const historyTableBody = document.getElementById('historyTableBody');
const btnClearHistory = document.getElementById('btnClearHistory');

// Statistik Elemen
const statTotalOrder = document.getElementById('statTotalOrder');
const statProses = document.getElementById('statProses');
const statSelesai = document.getElementById('statSelesai');

// Modal Produk (Tambah / Edit)
const productModal = document.getElementById('productModal');
const modalProductTitle = document.getElementById('modalProductTitle');
const btnAddProductModal = document.getElementById('btnAddProductModal');
const btnCloseProductModal = document.getElementById('btnCloseProductModal');
const btnSaveProduct = document.getElementById('btnSaveProduct');
const editProductIdInput = document.getElementById('editProductId');
const newProdName = document.getElementById('newProdName');
const newProdCategory = document.getElementById('newProdCategory');
const newProdPrice = document.getElementById('newProdPrice');
const newProdImage = document.getElementById('newProdImage');

// Modal Struk
const receiptModal = document.getElementById('receiptModal');
const receiptBody = document.getElementById('receiptBody');
const receiptDate = document.getElementById('receiptDate');
const receiptId = document.getElementById('receiptId');
const receiptCustomer = document.getElementById('receiptCustomer');
const rSubtotal = document.getElementById('rSubtotal');
const rDiscount = document.getElementById('rDiscount');
const rTotal = document.getElementById('rTotal');
const rCash = document.getElementById('rCash');
const rChange = document.getElementById('rChange');
const btnPrint = document.getElementById('btnPrint');
const btnCloseModal = document.getElementById('btnCloseModal');

// Format ke Rupiah
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
}

// Render Katalog Berdasarkan Kategori Terpilih
function renderProducts() {
    productGrid.innerHTML = '';
    const filteredProducts = currentCategory === "all" 
        ? products 
        : products.filter(p => p.category === currentCategory);

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#64748b; font-size:0.75rem; padding: 20px 0;">Belum ada produk di kategori ini.</p>`;
        return;
    }

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <div class="product-image-container" onclick="addToCart(${product.id})" title="Klik untuk tambah">
                <img src="${product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'}" alt="${product.name}">
            </div>
            <div class="product-info" onclick="addToCart(${product.id})" title="Klik untuk tambah ke keranjang">
                <h4>${product.name}</h4>
                <small>${product.category}</small>
                <p>${formatRupiah(product.price)}</p>
            </div>
            <div class="product-actions-card">
                <button class="btn-prod-action btn-edit" onclick="openEditProduct(${product.id})">✏️ Edit</button>
                <button class="btn-prod-action btn-del" onclick="deleteProduct(${product.id})">🗑️ Hapus</button>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// Tab Kategori Filter Event
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentCategory = e.target.getAttribute('data-category');
        renderProducts();
    });
});

// Buka Modal Tambah Produk
btnAddProductModal.addEventListener('click', () => {
    modalProductTitle.textContent = "✨ Tambah Menu Baru";
    editProductIdInput.value = "";
    newProdName.value = "";
    newProdCategory.value = currentCategory === "all" ? "Makanan" : currentCategory;
    newProdPrice.value = "";
    newProdImage.value = "";
    productModal.style.display = 'flex';
});

// Buka Modal Edit Produk
function openEditProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    modalProductTitle.textContent = "✏️ Edit Menu";
    editProductIdInput.value = product.id;
    newProdName.value = product.name;
    newProdCategory.value = product.category;
    newProdPrice.value = product.price;
    newProdImage.value = product.image || "";
    productModal.style.display = 'flex';
}

// Tutup Modal Produk
btnCloseProductModal.addEventListener('click', () => {
    productModal.style.display = 'none';
});

// Simpan Produk (Tambah Baru atau Update Edit)
btnSaveProduct.addEventListener('click', () => {
    const editId = editProductIdInput.value;
    const name = newProdName.value.trim();
    const category = newProdCategory.value;
    const price = parseFloat(newProdPrice.value);
    const image = newProdImage.value.trim();

    if (!name || isNaN(price) || price <= 0) {
        alert("Mohon masukkan nama dan harga produk yang valid!");
        return;
    }

    if (editId) {
        // Mode Edit
        const product = products.find(p => p.id == editId);
        if (product) {
            product.name = name;
            product.category = category;
            product.price = price;
            if (image) product.image = image;
        }
    } else {
        // Mode Tambah Baru
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const defaultImg = image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80";
        products.push({ id: newId, name, category, price, image: defaultImg });
    }

    renderProducts();
    productModal.style.display = 'none';
});

// Hapus Produk
function deleteProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (confirm(`Yakin ingin menghapus menu "${product.name}"?`)) {
        products = products.filter(p => p.id !== productId);
        renderProducts();
    }
}

// Tambah ke Keranjang
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
}

// Edit Jumlah Pesanan
function updateQuantity(productId, amount) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += amount;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }
    updateCart();
}

// Hapus Item
function removeItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Kalkulasi Total
function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountPercent = parseFloat(discountInput.value) || 0;
    
    const discountAmount = (subtotal * discountPercent) / 100;
    const finalTotal = subtotal - discountAmount;
    
    const cash = parseFloat(cashAmountInput.value) || 0;
    const change = cash - finalTotal;

    subtotalPriceElement.textContent = formatRupiah(subtotal);
    totalPriceElement.textContent = formatRupiah(finalTotal);

    if (cash >= finalTotal && finalTotal > 0 && cart.length > 0) {
        changeAmountElement.textContent = formatRupiah(change);
        btnPay.disabled = false;
    } else {
        changeAmountElement.textContent = formatRupiah(0);
        btnPay.disabled = true;
    }

    return { subtotal, discountPercent, discountAmount, finalTotal, cash, change };
}

// Update Tampilan Keranjang
function updateCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-state">
                <span>🛒</span>
                <p>Keranjang masih kosong nih,<br>yuk pilih menu dulu!</p>
            </div>
        `;
        calculateTotals();
        return;
    }

    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
        const row = document.createElement('div');
        row.classList.add('cart-item-row');
        row.innerHTML = `
            <div class="cart-item-info">
                <strong>${item.name}</strong>
                <small>${formatRupiah(item.price)} x ${item.quantity}</small>
            </div>
            <div class="cart-item-controls">
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="btn-remove-item" onclick="removeItem(${item.id})">×</button>
            </div>
        `;
        cartItemsContainer.appendChild(row);
    });

    calculateTotals();
}

discountInput.addEventListener('input', calculateTotals);
cashAmountInput.addEventListener('input', calculateTotals);

// Reset Keranjang
btnClear.addEventListener('click', () => {
    if (confirm("Reset pesanan saat ini?")) {
        resetCartForm();
    }
});

function resetCartForm() {
    cart = [];
    customerNameInput.value = '';
    discountInput.value = 0;
    cashAmountInput.value = '';
    updateCart();
}

// Proses Pesanan & Masuk Tabel Riwayat
btnPay.addEventListener('click', () => {
    const totals = calculateTotals();
    const custName = customerNameInput.value.trim() || "Tamu / Tanpa Nama";
    const orderId = '#' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const dateStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const newOrder = {
        id: orderId,
        customer: custName,
        time: dateStr,
        items: [...cart],
        ...totals,
        status: "Sedang Diproses"
    };

    orderHistory.unshift(newOrder);
    renderHistoryTable();
    updateOrderStats();
    showReceipt(newOrder);
    resetCartForm();
});

// Hitung & Update Statistik Orang Pemesan, Proses, dan Selesai
function updateOrderStats() {
    const totalOrders = orderHistory.length;
    const countProses = orderHistory.filter(o => o.status === "Sedang Diproses").length;
    const countSelesai = orderHistory.filter(o => o.status === "Selesai").length;

    statTotalOrder.textContent = totalOrders;
    statProses.textContent = countProses;
    statSelesai.textContent = countSelesai;
}

// Render Tabel Riwayat Pesanan
function renderHistoryTable() {
    if (orderHistory.length === 0) {
        historyTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-table">Belum ada pesanan masuk bestie~</td>
            </tr>
        `;
        return;
    }

    historyTableBody.innerHTML = '';
    orderHistory.forEach((order, index) => {
        const itemNames = order.items.map(i => `${i.name} (${i.quantity}x)`).join(', ');
        const badgeClass = order.status === "Selesai" ? "selesai" : "proses";

        let priceHtml = '';
        if (order.discountPercent > 0) {
            priceHtml = `
                <div class="price-box-shopee">
                    <div class="shopee-row">
                        <span class="shopee-badge">${order.discountPercent}% OFF</span>
                        <span class="shopee-strike">${formatRupiah(order.subtotal)}</span>
                    </div>
                    <span class="shopee-final">${formatRupiah(order.finalTotal)}</span>
                </div>
            `;
        } else {
            priceHtml = `<span class="shopee-normal">${formatRupiah(order.finalTotal)}</span>`;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <strong>${order.id}</strong><br>
                <small style="color:#94a3b8;">👤 ${order.customer}</small>
            </td>
            <td><small style="color:#cbd5e1;">${itemNames}</small></td>
            <td>${priceHtml}</td>
            <td><span class="status-badge ${badgeClass}">${order.status}</span></td>
            <td>
                <button class="btn-mini btn-mini-status" onclick="toggleStatus(${index})">🔄 Status</button>
                <button class="btn-mini btn-mini-print" onclick="showReceipt(orderHistory[${index}])">🖨️ Struk</button>
                <button class="btn-mini btn-mini-delete" onclick="deleteOrder(${index})">🗑️ Hapus</button>
            </td>
        `;
        historyTableBody.appendChild(tr);
    });
}

// Toggle Status di Tabel
function toggleStatus(index) {
    orderHistory[index].status = orderHistory[index].status === "Sedang Diproses" ? "Selesai" : "Sedang Diproses";
    renderHistoryTable();
    updateOrderStats();
}

// Hapus Satuan Pesanan di Riwayat
function deleteOrder(index) {
    if (confirm(`Yakin ingin menghapus pesanan ${orderHistory[index].id} (${orderHistory[index].customer})?`)) {
        orderHistory.splice(index, 1);
        renderHistoryTable();
        updateOrderStats();
    }
}

// Hapus Semua Riwayat Pesanan
btnClearHistory.addEventListener('click', () => {
    if (orderHistory.length === 0) {
        alert("Riwayat pesanan sudah kosong!");
        return;
    }
    if (confirm("Yakin ingin menghapus SEMUA riwayat pesanan?")) {
        orderHistory = [];
        renderHistoryTable();
        updateOrderStats();
    }
});

// Tampilkan Struk
function showReceipt(order) {
    receiptDate.textContent = order.time + " WIB";
    receiptId.textContent = order.id;
    receiptCustomer.textContent = order.customer;

    receiptBody.innerHTML = '';
    order.items.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('r-item');
        div.innerHTML = `
            <span>${item.name} (${item.quantity}x)</span>
            <span>${formatRupiah(item.price * item.quantity)}</span>
        `;
        receiptBody.appendChild(div);
    });

    rSubtotal.textContent = formatRupiah(order.subtotal);
    rDiscount.textContent = formatRupiah(order.discountAmount);
    rTotal.textContent = formatRupiah(order.finalTotal);
    rCash.textContent = formatRupiah(order.cash);
    rChange.textContent = formatRupiah(order.change);

    receiptModal.style.display = 'flex';
}

btnCloseModal.addEventListener('click', () => {
    receiptModal.style.display = 'none';
});

btnPrint.addEventListener('click', () => {
    window.print();
});

// Inisialisasi awal
renderProducts();
renderHistoryTable();
updateOrderStats();