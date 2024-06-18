var llaves;
var id_tabla;
var id_elemento;
function inicializarActualizar() {
    id_tabla = obtenerValorEnDireccion("tabla");
    id_elemento = obtenerValorEnDireccion("id");
    let titulo_actual = "Actualizar Tipo de Gestión";
    let items;
    let forms = "";

    switch (id_tabla) {
        case "resultado":
            titulo_actual = "Actualizar Resultado";
            items = {
                "id_resultado": "ID",
                "nombre_resultado": "Nombre",
            };
            break;
        case "gestion":
            titulo_actual = "Actualizar Gestión";
            items = {
                "id_gestion": "ID",
                "id_usuario": "ID Usuario",
                "id_cliente": "ID Cliente",
                "id_tipo_gestion": "ID Tipo Gestión",
                "id_resultado": "ID Resultado",
                "comentarios": "Comentarios",
            };
            break;
        case "cliente":
            titulo_actual = "Actualizar Clientes";
            items = {
                "id_cliente": "ID",
                "nombres": "Nombres",
                "apellidos": "Apellidos",
                "email": "E-Mail",
                "celular": "Celular",
            };
            break;
        case "usuario":
            titulo_actual = "Actualizar Usuario";
            items = {
                "id_usuario": "ID",
                "nombres": "Nombres",
                "apellidos": "Apellidos",
                "email": "E-Mail",
                "celular": "Celular",
                "username": "Nombre de Usuario",
                "password": "Contraseña",
            };
            break;
        default:
            id_tabla = "tipo_gestion";
            items = {
                "id_tipo_gestion": "ID",
                "nombre_tipo_gestion": "Nombre",
            };
    };

    // Tomar las "llaves" del array items.
    llaves = Object.keys(items);
    llaves.forEach((llave) => {
        let tipo = "text";
        let comentario = `Ingrese ${items[llave]}.`;
        let desactivar = "";
        if (["email", "username", "password"].includes(llave)) {
            tipo = llave;
        }
        if (["id_gestion", "id_usuario", "id_cliente", "id_tipo_gestion", "id_resultado"].includes(llave)) {
            comentario = "";
            desactivar = " disabled";
        }
        forms += `
        <div class="mb-3">
            <label for="${llave}" class="form-label">${items[llave]}</label>
            <input type="${tipo}" class="form-control" id="${llave}" aria-describedby="emailHelp"${desactivar}>
            <div id="emailHelp" class="form-text">${comentario}</div>
        </div>\n`
    });
    document.getElementById("titulo-actualizar").innerHTML = titulo_actual;
    document.getElementById("form-actualizar").innerHTML = forms;

    obtenerDatosActualizar(id_tabla, id_elemento);
}

function obtenerDatosActualizar() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch(`http://144.126.210.74:8080/api/${id_tabla}/${id_elemento}`, requestOptions)
        .then((response) => response.json())
        .then((json) => json.forEach(completarFormulario))
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function completarFormulario(element, index, arr) {
    let elemento = arr[0];
    console.log(elemento);
    llaves.forEach((llave) => {
        document.getElementById(llave).value = elemento[llave];
    })

}

function actualizarDatos() {
    //Obtenemos el tipo de gestión que ingresa el usuario
    let solicitud_patch = {};
    llaves.forEach((llave) => {
        solicitud_patch[llave] = document.getElementById(llave).value;
    });
    console.log(solicitud_patch);

    //Encabezado de la solicitud
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    //Carga útil de datos
    const raw = JSON.stringify(solicitud_patch);
    console.log(raw);

    //Opciones de solicitud
    const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    //Ejecutamos solicitud
    fetch(`http://144.126.210.74:8080/api/${id_tabla}/${id_elemento}`, requestOptions)
        .then((response) => {
            if (response.status == 200) {
                location.href = `listar.html?tabla=${id_tabla}`;
            }
        })
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}
