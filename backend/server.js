// ============ IMPORTAR DEPENDENCIAS ============
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// ============ CREAR APLICACIÓN ============
const app = express();
const PORT = process.env.PORT || 3000;

// ============ MIDDLEWARES ============
app.use(cors());
app.use(express.json());

// ============ BASE DE DATOS (En memoria) ============
let productos = [
    'Leche',
    'Pan',
    'Huevos',
    'Manzanas'
];

// ============ RUTAS ============

// 📋 Obtener todos los productos
app.get('/api/productos', (req, res) => {
    res.json({
        mensaje: 'Productos obtenidos exitosamente',
        productos: productos,
        total: productos.length,
        timestamp: new Date().toISOString()
    });
});

// ➕ Agregar un producto
app.post('/api/productos', (req, res) => {
    const { producto } = req.body;
    
    if (!producto) {
        return res.status(400).json({
            error: 'El campo "producto" es obligatorio',
            ejemplo: { producto: 'Leche' }
        });
    }
    
    productos.push(producto);
    
    res.status(201).json({
        mensaje: `✅ Producto "${producto}" agregado a la lista`,
        productos: productos,
        total: productos.length
    });
});

// 🗑️ Eliminar un producto (por índice)
app.delete('/api/productos/:index', (req, res) => {
    const index = parseInt(req.params.index);
    
    if (index < 0 || index >= productos.length) {
        return res.status(400).json({
            error: 'Índice inválido',
            mensaje: `El índice ${index} no existe. Total: ${productos.length} productos`
        });
    }
    
    const productoEliminado = productos[index];
    productos.splice(index, 1);
    
    res.json({
        mensaje: `✅ Producto "${productoEliminado}" eliminado`,
        productos: productos,
        total: productos.length
    });
});

// ❤️ Verificar estado del servidor
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        total_productos: productos.length
    });
});

// 🏠 Ruta principal
app.get('/', (req, res) => {
    res.json({
        nombre: '🛒 API Lista de Compras',
        version: '1.0.0',
        autor: 'Tu Nombre',
        fecha: '2026-07-02',
        endpoints: {
            'GET /api/productos': 'Obtener todos los productos',
            'POST /api/productos': 'Agregar un producto',
            'DELETE /api/productos/:index': 'Eliminar un producto',
            'GET /api/health': 'Verificar estado del servidor'
        },
        total_productos: productos.length,
        productos: productos
    });
});

// ============ MANEJO DE ERRORES ============
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        mensaje: `La ruta ${req.originalUrl} no existe`
    });
});

// ============ INICIAR SERVIDOR ============
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🛒 LISTA DE COMPRAS - SERVIDOR');
    console.log('='.repeat(50));
    console.log(`📡 Puerto: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📋 Productos: ${productos.join(', ')}`);
    console.log(`📊 Total: ${productos.length} productos`);
    console.log('='.repeat(50));
    console.log('✅ Servidor listo para recibir peticiones');
});