const { Pool } = require('pg');
require('dotenv').config();

// Configurar conexión a PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Necesario para Render
    }
});

// Función para crear la tabla si no existe
async function crearTabla() {
    const query = `
        CREATE TABLE IF NOT EXISTS productos (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.query(query);
        console.log('✅ Tabla "productos" creada/verificada');
    } catch (error) {
        console.error('❌ Error creando tabla:', error);
    }
}

// Función para obtener todos los productos
async function obtenerProductos() {
    const result = await pool.query('SELECT * FROM productos ORDER BY id ASC');
    return result.rows;
}

// Función para agregar un producto
async function agregarProducto(nombre) {
    const result = await pool.query(
        'INSERT INTO productos (nombre) VALUES ($1) RETURNING *',
        [nombre]
    );
    return result.rows[0];
}

// Función para eliminar un producto por ID
async function eliminarProducto(id) {
    const result = await pool.query(
        'DELETE FROM productos WHERE id = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
}

// Función para contar productos
async function contarProductos() {
    const result = await pool.query('SELECT COUNT(*) FROM productos');
    return parseInt(result.rows[0].count);
}

module.exports = {
    pool,
    crearTabla,
    obtenerProductos,
    agregarProducto,
    eliminarProducto,
    contarProductos
};