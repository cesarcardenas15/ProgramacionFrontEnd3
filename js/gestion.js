function agregarTipoGestion() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "nombre_tipo_gestion": "Enviar SMS",
        "fecha_registro": "2024-01-23 11:52.50"
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://144.126.210.74/api/tipo_gestion/10", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function listarTipoGestion() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74/api/tipo_gestion=_size=200", requestOptions)
        .then((response) => response.text())
        .then((json) => json.foreach(completarFila))
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function completarFila(element, index, arr) {
    arr[index] = document.querySelector("#tbl_tipo_gestion tbody" 
    `<tr>
     <td>${element.id_tipo_gestion}</td>
     <td>${element.nombre_tipo_gestion}</td>
     <td>${element.fecha_registro}</td>
     </tr>`)
}