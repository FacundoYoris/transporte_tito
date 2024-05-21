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

// function abrirModal(idTarea, tareaId) {
//     const modalId = `verOrden${idTarea}`;
//     let modal = document.getElementById(modalId);
//     if (!modal) {
//         // Si el modal no existe, crearlo dinámicamente
//         modal = document.createElement('div');
//         modal.id = modalId;
//         modal.classList.add('modal');
//         modal.innerHTML = `
//             <div class="modal-dialog">
//                 <div class="modal-content">
//                     <div class="modal-header">
//                         <h5 class="modal-title">Tarea ${tareaId}</h5> <!-- Mostrar el ID de la tarea en el título -->
//                         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                     </div>
//                     <div class="modal-body">
//                         <p>Contenido del modal...</p>
//                     </div>
//                     <div class="modal-footer">
//                         <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
//                     </div>
//                 </div>
//             </div>
//         `;
//         document.body.appendChild(modal);
//     }
//     const modalInstance = new bootstrap.Modal(modal);
//     modalInstance.show();
// }

function abrirModal(idTarea, tareaId) {
    const modalId = `verOrden${idTarea}`;
    let modal = document.getElementById(modalId);
    
    if (!modal) {
        // Si el modal no existe, crearlo dinámicamente
        modal = document.createElement('div');
        modal.id = modalId;
        modal.classList.add('modal');
        document.body.appendChild(modal);
    }
    
    // Realizar la solicitud fetch para obtener los detalles de la orden de trabajo
    fetch(`/orden-de-trabajo/${tareaId}`)
        .then(response => response.json())
        .then(data => {
            // Obtener la fecha y hora de inicio en formato ISO 8601
        const fechaInicioISO = moment(data.fecha_inicio);
        // Formatear la fecha y hora según el formato deseado
        const fechaInicioFormateada = fechaInicioISO.format('DD/MM/YYYY HH:mm');
            // Construir el contenido del modal con los detalles de la orden de trabajo
            modal.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Orden de Trabajo - ${tareaId}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p><strong>Descripción:</strong> ${data.actividad}</p>
                            <p><strong>Fecha de inicio:</strong> ${fechaInicioFormateada}</p>
                            <p><strong>Problema: </strong>${data.descripción_problematica} </p>
                            <!-- Agregar más detalles aquí según los campos de la orden de trabajo -->
                        </div>
                        <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onclick="aceptarOrden(${tareaId})">Aceptar Orden</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            `;
            // Mostrar el modal
            const modalInstance = new bootstrap.Modal(modal);
            modalInstance.show();
        })
        .catch(error => console.error('Error al obtener los datos de la orden de trabajo:', error));
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
                    tareaLi.textContent = tarea;
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
                    tareaLi.textContent = tarea;
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

window.onload = function() {
    generarListaFechasAlta();
    generarListaFechasMedia();
    generarListaFechasBaja();
};