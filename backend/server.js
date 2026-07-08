const express = require('express');
const cors = require('cors');
require('dotenv').config();

const {
    crearTabla,
    obtenerProductos,
    agregarProducto,
    eliminarProducto,
    contarProductos
} = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ============ INICIALIZAR BASE DE DATOS ============
crearTabla();

// ============ RUTAS ============

// GET - Obtener todos los productos
app.get('/api/products', async (req, res) => {
    try {
        const productos = await obtenerProductos();
        res.json({
            mensaje: 'Productos obtenidos exitosamente',
            productos: productos.map(p => p.nombre),
            ids: productos.map(p => p.id),
            total: productos.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// POST - Agregar un producto
app.post('/api/products', async (req, res) => {
    try {
        const { producto } = req.body;
        if (!producto) {
            return res.status(400).json({
                error: 'El campo producto es obligatorio',
                ejemplo: { producto: 'Leche' }
            });
        }

        await agregarProducto(producto);
        const productos = await obtenerProductos();

        res.status(201).json({
            mensaje: `✅ Producto "${producto}" agregado exitosamente`,
            productos: productos.map(p => p.nombre),
            ids: productos.map(p => p.id),
            total: productos.length
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al agregar producto' });
    }
});

// DELETE - Eliminar un producto por ID
app.delete('/api/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const eliminado = await eliminarProducto(id);

        if (!eliminado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const productos = await obtenerProductos();
        res.json({
            mensaje: `✅ Producto "${eliminado.nombre}" eliminado`,
            productos: productos.map(p => p.nombre),
            ids: productos.map(p => p.id),
            total: productos.length
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});

// GET - Health check
app.get('/api/health', async (req, res) => {
    try {
        const total = await contarProductos();
        res.json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            total_productos: total,
            database: 'PostgreSQL'
        });
    } catch (error) {
        res.json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            database: 'PostgreSQL'
        });
    }
});

// Ruta raíz
app.get('/', async (req, res) => {
    try {
        const total = await contarProductos();
        res.json({
            nombre: '🛒 API Lista de Compras (PostgreSQL)',
            version: '2.0.0',
            autor: 'Paula Yungasaca',
            fecha: '2026-07-08',
            endpoints: {
                'GET /api/products': 'Obtener todos los productos',
                'POST /api/products': 'Agregar un producto',
                'DELETE /api/products/:id': 'Eliminar un producto por ID',
                'GET /api/health': 'Verificar estado del servidor'
            },
            total_productos: total
        });
    } catch {
        res.json({
            nombre: '🛒 API Lista de Compras (PostgreSQL)',
            version: '2.0.0'
        });
    }
});

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        mensaje: `La ruta ${req.originalUrl} no existe en esta API`
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('================================================');
    console.log('🛒 API LISTA DE COMPRAS (POSTGRESQL)');
    console.log('================================================');
    console.log(`📡 Puerto: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log('📊 Base de datos: PostgreSQL');
    console.log('================================================');
    console.log('✅ Servidor listo para recibir peticiones');
});