// ============ CONFIGURACIÓN ============
const API_URL = 'https://lista-compras-api-16zc.onrender.com/api/productos';

// ============ ELEMENTOS DEL DOM ============
const btnCargar = document.getElementById('btnCargar');
const resultado = document.getElementById('resultado');
const btnAgregar = document.getElementById('btnAgregar');
const inputProducto = document.getElementById('inputProducto');
const mensajeEnvio = document.getElementById('mensajeEnvio');
const totalProductos = document.getElementById('totalProductos');

// ============ FUNCIÓN: CARGAR PRODUCTOS ============
async function cargarProductos() {
    try {
        resultado.innerHTML = '⏳ Cargando productos...';
        
        const response = await fetch(`${API_URL}`);
        const data = await response.json();
        
        if (response.ok) {
            // Actualizar el contador
            totalProductos.textContent = data.total || 0;
            
            // Construir la lista de productos
            let html = '<strong>✅ Productos en tu lista:</strong><br><br>';
            
            if (data.productos && data.productos.length > 0) {
                data.productos.forEach((producto, index) => {
                    html += `
                        <div class="producto-item">
                            <span class="numero">${index + 1}.</span>
                            <span class="texto">${producto}</span>
                            <button class="eliminar" onclick="eliminarProducto(${index})">✕</button>
                        </div>
                    `;
                });
            } else {
                html += '📭 No hay productos en tu lista. ¡Agrega uno!';
            }
            
            html += `<br><em>Total: ${data.total || 0} productos</em>`;
            resultado.innerHTML = html;
            
        } else {
            resultado.innerHTML = '❌ Error al cargar los productos';
        }
    } catch (error) {
        resultado.innerHTML = '❌ Error de conexión con el servidor<br><small>¿Está el servidor ejecutándose?</small>';
        console.error('Error:', error);
    }
}

// ============ FUNCIÓN: AGREGAR PRODUCTO ============
async function agregarProducto() {
    const producto = inputProducto.value.trim();
    
    if (!producto) {
        mensajeEnvio.innerHTML = '⚠️ Por favor, escribe un producto';
        return;
    }
    
    try {
        mensajeEnvio.innerHTML = '⏳ Agregando producto...';
        
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ producto: producto })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            mensajeEnvio.innerHTML = `✅ ${data.mensaje}`;
            inputProducto.value = '';
            inputProducto.focus();
            
            // Recargar automáticamente la lista
            setTimeout(cargarProductos, 500);
        } else {
            mensajeEnvio.innerHTML = '❌ Error al agregar el producto';
        }
    } catch (error) {
        mensajeEnvio.innerHTML = '❌ Error de conexión con el servidor';
        console.error('Error:', error);
    }
}

// ============ FUNCIÓN: ELIMINAR PRODUCTO ============
async function eliminarProducto(index) {
    try {
        const response = await fetch(`${API_URL}/${index}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            mensajeEnvio.innerHTML = `✅ ${data.mensaje}`;
            cargarProductos();
        } else {
            mensajeEnvio.innerHTML = '❌ Error al eliminar el producto';
        }
    } catch (error) {
        mensajeEnvio.innerHTML = '❌ Error de conexión con el servidor';
        console.error('Error:', error);
    }
}

// ============ FUNCIÓN: VERIFICAR SERVIDOR ============
async function verificarServidor() {
    try {
        const response = await fetch('http://localhost:3000/api/health');
        if (response.ok) {
            document.getElementById('estadoServidor').textContent = '🟢';
        } else {
            document.getElementById('estadoServidor').textContent = '🔴';
        }
    } catch {
        document.getElementById('estadoServidor').textContent = '🔴';
    }
}

// ============ EVENT LISTENERS ============
btnCargar.addEventListener('click', cargarProductos);
btnAgregar.addEventListener('click', agregarProducto);

// Permitir enviar con Enter
inputProducto.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        agregarProducto();
    }
});

// ============ INICIALIZAR ============
// Cargar productos al iniciar
cargarProductos();
verificarServidor();

// Verificar servidor cada 30 segundos
setInterval(verificarServidor, 30000);

// Mostrar la plataforma
document.getElementById('plataforma').textContent = 'Render.com (Próximo)';