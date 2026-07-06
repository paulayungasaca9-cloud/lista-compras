const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

// ✅ CONFIGURACIÓN CORS - PERMITIR TODO
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 📦 BASE DE DATOS EN MEMORIA
let productos = ['Leche', 'Pan', 'Huevos', 'Manzanas'];

// 📋 RUTAS DE LA API
app.get('/api/products', (req, res) => {
  res.json({
    mensaje: 'Productos obtenidos exitosamente',
    productos: productos,
    total: productos.length,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/products', (req, res) => {
  const { producto } = req.body;
  if (!producto) {
    return res.status(400).json({ 
      error: 'El campo producto es obligatorio',
      ejemplo: { producto: 'Leche' }
    });
  }
  productos.push(producto);
  res.status(201).json({
    mensaje: `✅ Producto "${producto}" agregado exitosamente`,
    productos: productos,
    total: productos.length
  });
});

app.delete('/api/products/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (index < 0 || index >= productos.length) {
    return res.status(400).json({ 
      error: 'Índice inválido',
      mensaje: `El índice ${index} no existe. Total: ${productos.length} productos`
    });
  }
  const eliminado = productos[index];
  productos.splice(index, 1);
  res.json({
    mensaje: `✅ Producto "${eliminado}" eliminado`,
    productos: productos,
    total: productos.length
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    total_productos: productos.length
  });
});

app.get('/', (req, res) => {
  res.json({
    nombre: '🛒 API Lista de Compras',
    version: '1.0.0',
    endpoints: {
      'GET /api/products': 'Obtener todos los productos',
      'POST /api/products': 'Agregar un producto',
      'DELETE /api/products/:index': 'Eliminar un producto',
      'GET /api/health': 'Verificar estado del servidor'
    },
    total_productos: productos.length,
    productos: productos
  });
});

app.listen(PORT, () => {
  console.log('================================================');
  console.log('🛒 API LISTA DE COMPRAS - DEPLOY EN RENDER');
  console.log('================================================');
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`📋 Productos: ${productos.join(', ')}`);
  console.log(`📊 Total: ${productos.length} productos`);
  console.log('✅ CORS habilitado para todos los orígenes');
  console.log('================================================');
  console.log('✅ Servidor listo para recibir peticiones');
});