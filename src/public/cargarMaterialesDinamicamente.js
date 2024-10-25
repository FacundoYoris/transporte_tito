// ESTO ESTA SIN USAR. CUANDO LO QUIERO CORRER ME HACE PROBLEMA <%=ID%>!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const contenedorMateriales = document.querySelector("#material-container-<%= id %>");
const btnAgregar = document.querySelector("#agregar");

// Variable para llevar el total de materiales agregados.
let total=1;

btnAgregar.addEventListener('click', evento =>{
    let nuevoMaterial = document.createElement('div');
    nuevoMaterial.classList.add('row', 'mb-3', 'material-row');
    nuevoMaterial.innerHTML= `
                <div class="col-md-6">
                    <label for="material${materialIndex}" class="form-label">Seleccionar material</label>
                    <select class="form-select material-select" id="material${materialIndex}" required>
                        <option value="" disabled selected>Elige un material</option>
                        <% items.forEach(function(item) { %>
                            <option value="<%= item.id %>"><%= item.item %></option>
                        <% }); %>
                    </select>
                </div>
                <div class="col-md-4">
                    <label for="cantidad${materialIndex}" class="form-label">Cantidad</label>
                    <input type="number" class="form-control cantidad-input" id="cantidad${materialIndex}" min="1" required>
                </div>
                <div class="col-md-2">
                    <button onclick="eliminar(this)" style=" background-color: red; border-color: red;">-</button>
                </div>
            `;
            container.appendChild(nuevoMaterial);

})



const eliminar = (e) => {
    const divPadre = e.parentNode;
    contenedorMateriales.removeChild(divPadre);
    // actualizarContador();
};

// const actualizarContador = () => {
//     let divs = contenedorMateriales.children;
//     total = 1;
//     for (let i=0; i<divs.length;i++){
//         divs[i].children[0].innerHTML=total++;
//     }
// }