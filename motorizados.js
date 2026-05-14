const URL_PIZZERIA_M = 'https://hjwfmexfahcqsiqnsxpd.supabase.co'; 
const KEY_PIZZERIA_M = 'sb_publishable_mH6jx0dJyPpbxIGyvWlP4g_5o8NlOmJ'; 

const motorizadoSupabase = window.supabase.createClient(URL_PIZZERIA_M, KEY_PIZZERIA_M);

async function cargarPedidosMotorizado() {
    const contenedor = document.getElementById('listaEntregas');
    if (!contenedor) return;

    try {
        const { data, error } = await motorizadoSupabase
            .from('pedidos')
            .select('*')
            .eq('estado', 'despachado');

        if (error) throw error;

        if (!data || data.length === 0) {
            contenedor.innerHTML = "<p style='text-align:center;'>No hay pedidos para repartir. 🛵💨</p>";
            return;
        }

        contenedor.innerHTML = "";
        data.forEach(p => {
            // FUERZA LA DIRECCIÓN A SER UN LINK DE GOOGLE MAPS SI NO LO ES
            let direccionParaMapa = p.direccion || "";
            let urlFinal = "";

            if (direccionParaMapa.startsWith('http')) {
                urlFinal = direccionParaMapa;
            } else {
                urlFinal = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(direccionParaMapa);
            }

            contenedor.innerHTML += `
                <div class="card-motorizado" style="border:2px solid #ff914d; padding:15px; margin:10px; border-radius:12px; background:#fff;">
                    <h3 style="margin-top:0;">
                        <a href="${urlFinal}" target="_blank" style="color: #007bff; font-weight: bold;">
                            📍 CLIC AQUÍ PARA VER UBICACIÓN
                        </a>
                    </h3>
                    <p><strong>Cliente:</strong> ${p.nombre}</p>
                    <p><strong>Ref:</strong> ${p.referencia || 'N/A'}</p>
                    <div style="display:flex; gap:10px;">
                        <a href="tel:${p.telefono}" style="background:#25d366; color:white; padding:10px; border-radius:8px; text-decoration:none; flex:1; text-align:center;">📞 Llamar</a>
                        <button onclick="confirmarEntrega(${p.id})" style="flex:1; cursor:pointer;">✅ Entregado</button>
                    </div>
                </div>`;
        });
    } catch (err) {
        console.error("Error:", err);
    }
}

async function confirmarEntrega(id) {
    const { error } = await motorizadoSupabase
        .from('pedidos')
        .update({ estado: 'entregado' })
        .eq('id', id);

    if (!error) {
        alert("¡Pedido entregado!");
        cargarPedidosMotorizado();
    }
}

cargarPedidosMotorizado();