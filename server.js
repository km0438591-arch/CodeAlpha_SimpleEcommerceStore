const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static('public'));

let products = [
  {id:1, name:"Wireless Headphones", price:1999, image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", desc:"Premium bass, 40hr battery", stock:10},
  {id:2, name:"Smart Watch", price:2999, image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", desc:"Fitness tracking AMOLED", stock:15},
  {id:3, name:"Running Shoes", price:2499, image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", desc:"Lightweight breathable", stock:20},
  {id:4, name:"Backpack", price:1299, image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", desc:"Waterproof 30L", stock:12},
  {id:5, name:"Sunglasses", price:899, image:"https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400", desc:"UV protection", stock:25},
  {id:6, name:"Gaming Mouse", price:1499, image:"https://images.unsplash.com/photo-1527814050087-3793815479db?w=400", desc:"RGB 16000 DPI", stock:18}
];
let users=[]; let orders=[]; let carts={};

app.get('/api/products',(req,res)=>res.json(products));
app.post('/api/register',(req,res)=>{const {name,email,password}=req.body;if(users.find(u=>u.email===email)) return res.status(400).json({msg:"User exists"});const user={id:Date.now(),name,email,password};users.push(user);res.json({msg:"Registered",user:{id:user.id,name,email}});});
app.post('/api/login',(req,res)=>{const {email,password}=req.body;const user=users.find(u=>u.email===email&&u.password===password);if(!user) return res.status(400).json({msg:"Invalid"});res.json({msg:"Logged in",user:{id:user.id,name:user.name,email}});});
app.post('/api/cart/add',(req,res)=>{const {userId,productId,qty}=req.body;if(!carts[userId]) carts[userId]=[];const ex=carts[userId].find(i=>i.productId==productId);if(ex) ex.qty+=qty||1;else carts[userId].push({productId,qty:qty||1});res.json(carts[userId]);});
app.get('/api/cart/:userId',(req,res)=>{const cart=carts[req.params.userId]||[];const detailed=cart.map(c=>{const p=products.find(x=>x.id==c.productId);return {...p,qty:c.qty,total:p.price*c.qty}});res.json(detailed);});
app.delete('/api/cart/:userId/:productId',(req,res)=>{if(carts[req.params.userId]) carts[req.params.userId]=carts[req.params.userId].filter(i=>i.productId!=req.params.productId);res.json({msg:"Removed"});});
app.post('/api/order',(req,res)=>{const {userId,items,total,address}=req.body;const order={id:"ORD"+Date.now(),userId,items,total,address,date:new Date().toISOString(),status:"Confirmed"};orders.push(order);carts[userId]=[];res.json({msg:"Order placed",order});});
app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));
app.listen(PORT,()=>console.log(`Running http://localhost:${PORT}`));