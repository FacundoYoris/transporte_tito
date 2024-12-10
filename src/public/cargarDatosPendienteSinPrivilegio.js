function toggleMenu(opcion) {//FUNCIÓN PARA MOSTRAR/OCULTAR LAS FECHAS Y/O TAREAS
    var menu = document.getElementById('menu-' + opcion);
    if (menu.style.display === 'block') {
      menu.style.display = 'none';
    } else {
      menu.style.display = 'block';
    }
}


function generarListaFechasAlta() {
    
    let url = '/fechasYtareasPrioridadAlta';
    fetch(url)
        .then(response => response.json())
        .then(datos => agruparPorDia(datos))
        .then(fechasAgrupadas => mostrarFechasAgrupadas(fechasAgrupadas))
        .catch(error => console.log(error));

    function agruparPorDia(datos) {
        
        // Creamos un objeto para almacenar las tareas agrupadas por día
        const tareasPorDia = {};

        // Recorremos los datos y agrupamos las tareas por día
        datos.forEach(item => {
            // Obtenemos la fecha sin la hora y los minutos
            const fechaInicio = new Date(item.fecha_inicio);
            const fechaDia = `${fechaInicio.getDate()}/${fechaInicio.getMonth() + 1}/${fechaInicio.getFullYear()}`;

            // Si el día aún no está en el objeto, lo inicializamos como un arreglo vacío
            if (!tareasPorDia[fechaDia]) {
                tareasPorDia[fechaDia] = { tareas: [] };
            }

            // Agregamos las tareas al día correspondiente
            tareasPorDia[fechaDia].tareas.push(...item.tareas);
        });

        return tareasPorDia;
    }

    function mostrarFechasAgrupadas(fechasAgrupadas) {
        
        const fechasPrioridadAlta = document.getElementById("fechas-prioridadAlta");
        fechasPrioridadAlta.innerHTML = "";
        for (const fecha in fechasAgrupadas) {
            if (fechasAgrupadas.hasOwnProperty(fecha)) {
                const { tareas } = fechasAgrupadas[fecha];
                const fechaLi = document.createElement("li");
                const fechaDiv = document.createElement("div");
                fechaDiv.classList.add("opcionSecundaria");
                fechaDiv.textContent = `${fecha} (${tareas.length})`;
                fechaDiv.setAttribute("onclick", `toggleMenu('alta-secundaria-${fecha}')`);
                const tareasUl = document.createElement("ul");
                tareas.forEach((tarea, index) => {
                    const tareaLi = document.createElement("li");
                    tareaLi.classList.add("submenu");
                    tareaLi.setAttribute("data-submenu", `submenu-alta-${fecha}-${index + 1}`);
                    const tareaBtn = document.createElement("button");
                    tareaBtn.textContent = tarea;
                    // Pasar el ID de la tarea como parámetro adicional a abrirModal
                    tareaBtn.addEventListener("click", () => abrirModal(`verOrden-${fecha}-${index}`, tarea));
                    tareaLi.appendChild(tareaBtn);
                    tareasUl.appendChild(tareaLi);
                });
                const tareasDiv = document.createElement("div");
                tareasDiv.classList.add("menuOpciones");
                tareasDiv.setAttribute("id", `menu-alta-secundaria-${fecha}`);
                tareasDiv.appendChild(tareasUl);
                fechaLi.appendChild(fechaDiv);
                fechaLi.appendChild(tareasDiv);
                fechasPrioridadAlta.appendChild(fechaLi);
            }
        }
    }
}

function generarListaFechasMedia() {
    let url = '/fechasYtareasPrioridadMedia';
    fetch(url)
        .then(response => response.json())
        .then(datos => agruparPorDia(datos))
        .then(fechasAgrupadas => mostrarFechasAgrupadas(fechasAgrupadas))
        .catch(error => console.log(error));

    function agruparPorDia(datos) {
        const tareasPorDia = {};
        datos.forEach(item => {
            const fechaInicio = new Date(item.fecha_inicio);
            const fechaDia = `${fechaInicio.getDate()}/${fechaInicio.getMonth() + 1}/${fechaInicio.getFullYear()}`;
            if (!tareasPorDia[fechaDia]) {
                tareasPorDia[fechaDia] = { tareas: [] };
            }
            tareasPorDia[fechaDia].tareas.push(...item.tareas);
        });
        return tareasPorDia;
    }

    function mostrarFechasAgrupadas(fechasAgrupadas) {
        const fechasPrioridadMedia = document.getElementById("fechas-prioridadMedia");
        fechasPrioridadMedia.innerHTML = "";
        for (const fecha in fechasAgrupadas) {
            if (fechasAgrupadas.hasOwnProperty(fecha)) {
                const { tareas } = fechasAgrupadas[fecha];
                const fechaLi = document.createElement("li");
                const fechaDiv = document.createElement("div");
                fechaDiv.classList.add("opcionSecundaria");
                fechaDiv.textContent = `${fecha} (${tareas.length})`;
                fechaDiv.setAttribute("onclick", `toggleMenu('media-secundaria-${fecha}')`);
                const tareasUl = document.createElement("ul");
                tareas.forEach((tarea, index) => {
                    const tareaLi = document.createElement("li");
                    tareaLi.classList.add("submenu");
                    tareaLi.setAttribute("data-submenu", `submenu-media-${fecha}-${index + 1}`);
                    const tareaBtn = document.createElement("button");
                    tareaBtn.textContent = tarea;
                    // Pasar el ID de la tarea como parámetro adicional a abrirModal
                    tareaBtn.addEventListener("click", () => abrirModal(`verOrden-${fecha}-${index}`, tarea));
                    tareaLi.appendChild(tareaBtn);
                    tareasUl.appendChild(tareaLi);
                });
                const tareasDiv = document.createElement("div");
                tareasDiv.classList.add("menuOpciones");
                tareasDiv.setAttribute("id", `menu-media-secundaria-${fecha}`);
                tareasDiv.appendChild(tareasUl);
                fechaLi.appendChild(fechaDiv);
                fechaLi.appendChild(tareasDiv);
                fechasPrioridadMedia.appendChild(fechaLi);
            }
        }
    }
}



function mostrarFechasAgrupadas(fechasAgrupadas) {
    const fechasPrioridadMedia = document.getElementById("fechas-prioridadMedia");
    fechasPrioridadMedia.innerHTML = "";
    
    fechasAgrupadas.forEach(fechaItem => {
        const { fecha_inicio, tareas } = fechaItem;
        const fechaLi = document.createElement("li");
        const fechaDiv = document.createElement("div");
        fechaDiv.classList.add("opcionSecundaria");
        fechaDiv.textContent = `${fecha_inicio} (${tareas.length})`;
        fechaDiv.setAttribute("onclick", `toggleMenu('media-secundaria-${fecha_inicio}')`);
        const tareasUl = document.createElement("ul");

        tareas.forEach((tarea) => {
            const tareaLi = document.createElement("li");
            tareaLi.classList.add("submenu");
            const tareaBtn = document.createElement("button");
            tareaBtn.textContent = tarea.actividad;  // Muestra la actividad como texto

            // Usar el id para abrir el modal de detalles
            tareaBtn.addEventListener("click", () => abrirModal(tarea.id, tarea.actividad));
            tareaLi.appendChild(tareaBtn);
            tareasUl.appendChild(tareaLi);
        });

        const tareasDiv = document.createElement("div");
        tareasDiv.classList.add("menuOpciones");
        tareasDiv.setAttribute("id", `menu-media-secundaria-${fecha_inicio}`);
        tareasDiv.appendChild(tareasUl);
        fechaLi.appendChild(fechaDiv);
        fechaLi.appendChild(tareasDiv);
        fechasPrioridadMedia.appendChild(fechaLi);
    });
}




function generarListaFechasBaja() {
    let url = '/fechasYtareasPrioridadBaja';
    fetch(url)
        .then(response => response.json())
        .then(datos => agruparPorDia(datos))
        .then(fechasAgrupadas => mostrarFechasAgrupadas(fechasAgrupadas))
        .catch(error => console.log(error));

    function agruparPorDia(datos) {
        const tareasPorDia = {};
        datos.forEach(item => {
            const fechaInicio = new Date(item.fecha_inicio);
            const fechaDia = `${fechaInicio.getDate()}/${fechaInicio.getMonth() + 1}/${fechaInicio.getFullYear()}`;
            if (!tareasPorDia[fechaDia]) {
                tareasPorDia[fechaDia] = { tareas: [] };
            }
            tareasPorDia[fechaDia].tareas.push(...item.tareas);
        });
        return tareasPorDia;
    }

    function mostrarFechasAgrupadas(fechasAgrupadas) {
        const fechasPrioridadBaja = document.getElementById("fechas-prioridadBaja");
        fechasPrioridadBaja.innerHTML = "";
        for (const fecha in fechasAgrupadas) {
            if (fechasAgrupadas.hasOwnProperty(fecha)) {
                const { tareas } = fechasAgrupadas[fecha];
                const fechaLi = document.createElement("li");
                const fechaDiv = document.createElement("div");
                fechaDiv.classList.add("opcionSecundaria");
                fechaDiv.textContent = `${fecha} (${tareas.length})`;
                fechaDiv.setAttribute("onclick", `toggleMenu('baja-secundaria-${fecha}')`);
                const tareasUl = document.createElement("ul");
                tareas.forEach((tarea, index) => {
                    const tareaLi = document.createElement("li");
                    tareaLi.classList.add("submenu");
                    tareaLi.setAttribute("data-submenu", `submenu-baja-${fecha}-${index + 1}`);
                    const tareaBtn = document.createElement("button");
                    tareaBtn.textContent = tarea;
                    // Pasar el ID de la tarea como parámetro adicional a abrirModal
                    tareaBtn.addEventListener("click", () => abrirModal(`verOrden-${fecha}-${index}`, tarea));
                    tareaLi.appendChild(tareaBtn);
                    tareasUl.appendChild(tareaLi);
                });
                const tareasDiv = document.createElement("div");
                tareasDiv.classList.add("menuOpciones");
                tareasDiv.setAttribute("id", `menu-baja-secundaria-${fecha}`);
                tareasDiv.appendChild(tareasUl);
                fechaLi.appendChild(fechaDiv);
                fechaLi.appendChild(tareasDiv);
                fechasPrioridadBaja.appendChild(fechaLi);
            }
        }
    }
}


function abrirModal(idTarea, tareaId) {
    const modalId = `verOrden${idTarea}`;
    let modal = document.getElementById(modalId);

    // Si el modal no existe, crear uno dinámicamente
    if (!modal) {
        modal = document.createElement('div');
        modal.id = modalId;
        modal.classList.add('modal', 'fade');
        document.body.appendChild(modal);
    }
    
    // Realizar la solicitud fetch para obtener los detalles de la orden de trabajo
    fetch(`/orden-de-trabajo/${tareaId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            return response.json();
        })
        .then(data => {
            // Formatear la fecha de inicio
            const fechaInicioISO = moment(data.fecha_inicio);
            const fechaInicioFormateada = fechaInicioISO.format('DD/MM/YYYY HH:mm');
            
            // Construir el contenido del modal con los detalles de la orden de trabajo
            modal.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Orden de Trabajo - ${data.id_orden_trabajo}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p><strong>Descripción:</strong> ${data.actividad}</p>
                            <p><strong>Fecha de inicio:</strong> ${fechaInicioFormateada}</p>
                            <p><strong>Problema:</strong> ${data["descripción_problematica"] || "No especificado"}</p>
                            <p><strong>Elemento:</strong> ${data.elemento || "No especificado"}</p>
                            <!-- Agregar más detalles aquí según los campos de la orden de trabajo -->
                        </div>
                        <div class="modal-footer">
                            <button id="btnAceptarOrden${idTarea}" type="button" class="btn btn-primary">Aceptar Orden</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Añadir evento al botón "Aceptar Orden" para abrir el modal de confirmación
            document.getElementById(`btnAceptarOrden${idTarea}`).addEventListener('click', function() {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                modalInstance.hide();

                // Usar un setTimeout para abrir el segundo modal después de cerrar el primero
                setTimeout(() => {
                    abrirModalConfirmacion(idTarea, tareaId);
                }, 300);
            });

            // Mostrar el modal
            const modalInstance = new bootstrap.Modal(modal);
            modalInstance.show();
        })
        .catch(error => console.error('Error al obtener los datos de la orden de trabajo:', error));
}



function abrirModalConfirmacion(idTarea, tareaId) {
    const modalIdConfirmacion = `aceptarOrden${idTarea}`;
    let modalConfirmacion = document.getElementById(modalIdConfirmacion);

    // Crear el modal de confirmación si no existe
    if (!modalConfirmacion) {
        modalConfirmacion = document.createElement('div');
        modalConfirmacion.id = modalIdConfirmacion;
        modalConfirmacion.classList.add('modal', 'fade');
        document.body.appendChild(modalConfirmacion);

        // Construir el contenido del modal de confirmación
        modalConfirmacion.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Aceptar orden de trabajo</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ¿Estás seguro que deseas aceptar la orden de trabajo?
                    </div>
                    <div class="modal-footer">
                        <form action="/cambiar-estado-pendiente-enProceso" method="post">
                            <input id="id" name="id" value="${tareaId}" hidden>
                            <button type="submit" class="btn btn-primary" tabindex="5">Aceptar</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    // Mostrar el modal de confirmación
    const modalInstanceConfirmacion = new bootstrap.Modal(modalConfirmacion);
    modalInstanceConfirmacion.show();
}









window.onload = function() {
    generarListaFechasAlta();
    generarListaFechasMedia();
    generarListaFechasBaja();
};
