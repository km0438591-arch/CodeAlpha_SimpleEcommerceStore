let currentUser = JSON.parse(localStorage.getItem('user')||'null');
let products=[];
async function loadProducts(){
 const r = await fetch('/api/products');
 products = await r.json();
 document.getElementById('products').innerHTML = products.map(p=>`
 <div class="card">
 <img src="${p.image}" onclick="showDetail(${p.id})">
 <h4>${p.name}</h4><p>₹${p.price}</p>
 <button onclick="addToCart(${p.id})">Add to Cart</button>
 </div>`).join('');
 updateAuth(); updateCartCount();
}
function showDetail(id){
 const p = products.find(x=>x.id==id);
 document.getElementById('detailBox').innerHTML = `<img src="${p.image}" style="width:100%;border-radius:8px"><h3>${p.name}</h3><p>${p.desc}</p><p><b>₹${p.price}</b></p><button onclick="addToCart(${p.id});closeDetail()">Add to Cart</button><button class="close" onclick="closeDetail()">X</button>`;
 document.getElementById('productDetail').classList.remove('hidden');
}
function closeDetail(){document.getElementById('productDetail').classList.add('hidden')}
async function addToCart(pid){if(!currentUser){openAuth();return}await fetch('/api/cart/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId:currentUser.id,productId:pid,qty:1})});updateCartCount();alert('Added to Cart!')}
async function updateCartCount(){if(!currentUser){document.getElementById('cartCount').innerText=0;return}const r=await fetch(`/api/cart/${currentUser.id}`);const data=await r.json();document.getElementById('cartCount').innerText=data.reduce((s,i)=>s+i.qty,0)}
async function showCart(){if(!currentUser){openAuth();return}const r=await fetch(`/api/cart/${currentUser.id}`);const data=await r.json();let total=0;document.getElementById('cartItems').innerHTML=data.map(i=>{total+=i.total;return `<div style="margin:6px 0">${i.name} x ${i.qty} = ₹${i.total} <button onclick="removeItem(${i.id})">Remove</button></div>`}).join('')||'Empty';document.getElementById('cartTotal').innerText='Total: ₹'+total;document.getElementById('cartModal').classList.remove('hidden');window._cartTotal=total;window._cartItems=data}
function closeCart(){document.getElementById('cartModal').classList.add('hidden')}
async function removeItem(pid){await fetch(`/api/cart/${currentUser.id}/${pid}`,{method:'DELETE'});showCart();updateCartCount()}
async function placeOrder(){const addr=document.getElementById('address').value;if(!addr)return alert('Enter Address');const res=await fetch('/api/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId:currentUser.id,items:window._cartItems,total:window._cartTotal,address:addr})});const d=await res.json();document.getElementById('orderMsg').innerText='Order Success! ID: '+d.order.id;updateCartCount()}
function openAuth(){document.getElementById('authModal').classList.remove('hidden')}
function closeAuth(){document.getElementById('authModal').classList.add('hidden')}
async function register(){const name=document.getElementById('name').value,email=document.getElementById('email').value,password=document.getElementById('pass').value;const r=await fetch('/api/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,password})});const d=await r.json();document.getElementById('authMsg').innerText=d.msg;if(d.user){localStorage.setItem('user',JSON.stringify(d.user));currentUser=d.user;closeAuth();updateAuth();updateCartCount()}}
async function login(){const email=document.getElementById('email').value,password=document.getElementById('pass').value;const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});const d=await r.json();document.getElementById('authMsg').innerText=d.msg;if(d.user){localStorage.setItem('user',JSON.stringify(d.user));currentUser=d.user;closeAuth();updateAuth();updateCartCount()}}
function updateAuth(){if(currentUser)document.getElementById('authBtn').innerText='Hi, '+currentUser.name}
loadProducts();