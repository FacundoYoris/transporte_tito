function toggleMenu(opcion) {//FUNCIÓN PARA MOSTRAR/OCULTAR LAS FECHAS Y/O TAREAS
    var menu = document.getElementById('menu-' + opcion);
    if (menu.style.display === 'block') {
      menu.style.display = 'none';
    } else {
      menu.style.display = 'block';
    }
}

// const fechasAlta = [

    
//     { fecha: "FECHA 1", tareas: ["TAREA 1", "TAREA 2", "TAREA 3"] },
//     { fecha: "FECHA 2", tareas: ["TAREA A"] }
// ];

const fechasMedia = [
    { fecha: "FECHA 3", tareas: ["TAREA X", "TAREA Y"] },
    { fecha: "FECHA 4", tareas: ["TAREA B", "TAREA C"] }
];

const fechasBaja = [
    { fecha: "FECHA 5", tareas: ["TAREA P", "TAREA Q", "TAREA R"] }
];

function generarListaFechasAlta() {
    let url = '/fechasYtareasPrioridadAlta'
    fetch(url)
        .then(response => response.json())
        .then(datos => Alta(datos))
        .catch(error => console.log(error));

    function Alta(datos){
    const fechasAlta = datos;
    console.log(fechasAlta);
    const fechasPrioridadAlta = document.getElementById("fechas-prioridadAlta");
    fechasPrioridadAlta.innerHTML = "";
    console.log(fechasAlta);
    fechasAlta.forEach((item, index) => { // Cambiado "fecha" por "item"
        const fechaLi = document.createElement("li");
        const fechaDiv = document.createElement("div");
        fechaDiv.classList.add("opcionSecundaria");
        fechaDiv.textContent = item.fecha_inicio; // Cambiado "fecha.fecha_inicio" por "item.fecha_inicio"
        fechaDiv.setAttribute("onclick", `toggleMenu('alta-secundaria${index + 1}')`);

        const tareasUl = document.createElement("ul");
        item.tareas.forEach((tarea, tareaIndex) => { // Cambiado "fecha.tareas" por "item.tareas"
            const tareaLi = document.createElement("li");
            tareaLi.classList.add("submenu");
            tareaLi.setAttribute("data-submenu", `submenu-alta-${index + 1}-${tareaIndex + 1}`);
            tareaLi.textContent = tarea;
            tareasUl.appendChild(tareaLi);
        });

        const tareasDiv = document.createElement("div");
        tareasDiv.classList.add("menuOpciones");
        tareasDiv.setAttribute("id", `menu-alta-secundaria${index + 1}`);
        tareasDiv.appendChild(tareasUl);

        fechaLi.appendChild(fechaDiv);
        fechaLi.appendChild(tareasDiv);
        fechasPrioridadAlta.appendChild(fechaLi);
    });
    }
}

function generarListaFechasMedia() {
    const fechasPrioridadMedia = document.getElementById("fechas-prioridadMedia");
    fechasPrioridadMedia.innerHTML = "";

    fechasMedia.forEach((fecha, index) => {
        const fechaLi = document.createElement("li");
        const fechaDiv = document.createElement("div");
        fechaDiv.classList.add("opcionSecundaria");
        fechaDiv.textContent = fecha.fecha;
        fechaDiv.setAttribute("onclick", `toggleMenu('media-secundaria${index + 1}')`);

        const tareasUl = document.createElement("ul");
        fecha.tareas.forEach((tarea, tareaIndex) => {
            const tareaLi = document.createElement("li");
            tareaLi.classList.add("submenu");
            tareaLi.setAttribute("data-submenu", `submenu-media-${index + 1}-${tareaIndex + 1}`);
            tareaLi.textContent = tarea;
            tareasUl.appendChild(tareaLi);
        });

        const tareasDiv = document.createElement("div");
        tareasDiv.classList.add("menuOpciones");
        tareasDiv.setAttribute("id", `menu-media-secundaria${index + 1}`);
        tareasDiv.appendChild(tareasUl);

        fechaLi.appendChild(fechaDiv);
        fechaLi.appendChild(tareasDiv);
        fechasPrioridadMedia.appendChild(fechaLi);
    });
}

function generarListaFechasBaja() {
    const fechasPrioridadBaja = document.getElementById("fechas-prioridadBaja");
    fechasPrioridadBaja.innerHTML = "";

    fechasBaja.forEach((fecha, index) => {
        const fechaLi = document.createElement("li");
        const fechaDiv = document.createElement("div");
        fechaDiv.classList.add("opcionSecundaria");
        fechaDiv.textContent = fecha.fecha;
        fechaDiv.setAttribute("onclick", `toggleMenu('baja-secundaria${index + 1}')`);

        const tareasUl = document.createElement("ul");
        fecha.tareas.forEach((tarea, tareaIndex) => {
            const tareaLi = document.createElement("li");
            tareaLi.classList.add("submenu");
            tareaLi.setAttribute("data-submenu", `submenu-baja-${index + 1}-${tareaIndex + 1}`);
            tareaLi.textContent = tarea;
            tareasUl.appendChild(tareaLi);
        });

        const tareasDiv = document.createElement("div");
        tareasDiv.classList.add("menuOpciones");
        tareasDiv.setAttribute("id", `menu-baja-secundaria${index + 1}`);
        tareasDiv.appendChild(tareasUl);

        fechaLi.appendChild(fechaDiv);
        fechaLi.appendChild(tareasDiv);
        fechasPrioridadBaja.appendChild(fechaLi);
    });
}

window.onload = function() {
    generarListaFechasAlta();
    generarListaFechasMedia();
    generarListaFechasBaja();
};