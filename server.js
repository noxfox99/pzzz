const express = require('express');
const path = require('path');
const fs = require('fs');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Загружаем товары
const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json')));

app.get('/', (req, res) => {
  res.render('index', { title: 'Каталог', products });
});

app.get('/product/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) return res.status(404).send('Товар не найден');
  res.render('product', { title: product.name, product });
});

app.get('/checkout/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) return res.status(404).send('Товар не найден');
  const weight = req.query.weight || product.weights[0];
  res.render('checkout', { title: 'Оплата', product, weight });
});

app.post('/success/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) return res.status(404).send('Товар не найден');
  res.render('success', { title: 'Успешно', product });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
