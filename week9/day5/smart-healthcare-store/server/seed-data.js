const http = require('http');

const products = [
    {
        name: 'Vitamin C 1000mg',
        brand: 'HealthPlus',
        category: 'Vitamins',
        price: 15.99,
        description: 'High potency Vitamin C for immune support.',
        image: 'https://placehold.co/600x600/f59e0b/ffffff?text=Vitamin+C',
        tags: ['immune', 'vitamin', 'antioxidant']
    },
    {
        name: 'Calcium + Vitamin D3',
        brand: 'BoneCare',
        category: 'Bone Health',
        price: 12.49,
        description: 'Supports strong bones and teeth.',
        image: 'https://placehold.co/600x600/e2e8f0/1e293b?text=Calcium',
        tags: ['bones', 'calcium', 'vitamin d']
    },
    {
        name: 'Omega-3 Fish Oil',
        brand: 'PureVital',
        category: 'Heart Health',
        price: 19.99,
        description: 'Premium fish oil for heart and brain health.',
        image: 'https://placehold.co/600x600/3b82f6/ffffff?text=Fish+Oil',
        tags: ['heart', 'brain', 'omega']
    },
    {
        name: 'Biotin 5000mcg',
        brand: 'BeautyTabs',
        category: 'Hair & Skin',
        price: 14.00,
        description: 'Healthy hair, skin, and nails supplement.',
        image: 'https://placehold.co/600x600/ec4899/ffffff?text=Biotin',
        tags: ['hair', 'skin', 'nails', 'biotin']
    },
    {
        name: 'Magnesium Citrate',
        brand: 'RelaxVital',
        category: 'Minerals',
        price: 13.50,
        description: 'Supports muscle relaxation and sleep.',
        image: 'https://placehold.co/600x600/6366f1/ffffff?text=Magnesium',
        tags: ['muscle', 'sleep', 'magnesium']
    }
];

const data = JSON.stringify(products);

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/products/seed',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
