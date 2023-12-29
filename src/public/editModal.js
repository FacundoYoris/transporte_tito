function enviarDatosEditModal(id){
    const url = "/stock-disponible";
    fetch(url)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error))
}
