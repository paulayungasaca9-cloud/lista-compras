const { Pool } = require('pg');
require('dotenv').config();

// Configurar conexión a PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Función para crear la tabla e insertar datos solo si está vacía
async function crearTabla() {
    try {
        // Crear la tabla si no existe
        await pool.query(`
            CREATE TABLE IF NOT EXISTS productos (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Tabla "productos" creada/verificada');

        // Verificar si la tabla tiene datos
        const result = await pool.query('SELECT COUNT(*) FROM productos');
        const count = parseInt(result.rows[0].count);

        // Si está vacía, insertar los productos iniciales
        if (count === 0) {
            await pool.query(`
                INSERT INTO productos (nombre) VALUES 
                    ('Leche'), 
                    ('Pan'), 
                    ('Huevos'), 
                    ('Manzanas')
            `);
            console.log('✅ Productos iniciales insertados (tabla vacía)');
        } else {
            console.log(`ℹ️ La tabla ya tiene ${count} productos, no se insertaron duplicados`);
        }
    } catch (error) {
        console.error('❌ Error en la base de datos:', error);
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