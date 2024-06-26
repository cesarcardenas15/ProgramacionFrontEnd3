var id_tabla = "";
// Especificar contenido de las tablas.
var items;

var llaves;

function inicializarLista() {
    id_tabla = obtenerValorEnDireccion("tabla");

    var titulo_actual = "Listado de Tipo de Gestión";
    switch (id_tabla) {
        case "resultado":
            titulo_actual = "Listado de Resultado";
            items = {
                "id_resultado": "ID",
                "nombre_resultado": "Nombre",
                "fecha_registro": "Fecha Registro"
            };
            break;
        case "gestion":
            titulo_actual = "Listado de Gestión";
            items = {
                "id_gestion": "ID",
                "id_usuario": "ID Usuario",
                "id_cliente": "ID Cliente",
                "id_tipo_gestion": "ID Tipo Gestión",
                "id_resultado": "ID Resultado",
                "comentarios": "Comentarios",
                "fecha_registro": "Fecha Registro"
            };
            break;
        case "cliente":
            titulo_actual = "Listado de Clientes";
            items = {
                "id_cliente": "ID",
                "nombres": "Nombres",
                "apellidos": "Apellidos",
                "email": "E-Mail",
                "celular": "Celular",
                "fecha_registro": "Fecha Registro"
            };
            break;
        case "usuario":
            titulo_actual = "Listado de Usuario";
            items = {
                "id_usuario": "ID",
                "nombres": "Nombres",
                "apellidos": "Apellidos",
                "email": "E-Mail",
                "celular": "Celular",
                "username": "Nombre de Usuario",
                "password": "Contraseña",
                "fecha_registro": "Fecha Registro"
            };
            break;
        default:
            id_tabla = "tipo_gestion";
            items = {
                "id_tipo_gestion": "ID",
                "nombre_tipo_gestion": "Nombre",
                "fecha_registro": "Fecha Registro"
            };
    }
    document.getElementById("list-title").innerHTML = titulo_actual;
    document.getElementById("boton-crear").href += `?tabla=${id_tabla}`;
    llaves = Object.keys(items);
    let titulos_tabla = "";

    llaves.forEach((llave) => {
        titulos_tabla += `<th>${items[llave]}</th>\n`;
    })
    titulos_tabla += `<th>Opciones</th>\n`
    document.querySelector("#tbl_lista thead").innerHTML += titulos_tabla;

    obtenerDatosYListar();
}
function obtenerDatosYListar() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/" + id_tabla + "?_size=200", requestOptions)
        .then((response) => response.json())
        .then((json) => {
            json.forEach(completarFila);
            $('#tbl_lista').DataTable();
        })
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function completarFila(element, index, arr) {
    let nombres_elementos = {
        "tipo_gestion": "nombre_tipo_gestion",
        "resultado": "nombre_resultado",
        "gestion": "id_gestion",
        "cliente": "nombres",
        "usuario": "nombres"

    };
    let valores = "";

    let elemento = arr[index];
    let id_elemento = elemento[llaves[0]];
    llaves.forEach((llave) => {
        if (llave != "fecha_registro") {
            valores += `<td>${elemento[llave]}</td>\n`;
        }
    });

    var fechaHoraFormateada = formatearFechaHora(element.fecha_registro);
    document.querySelector("#tbl_lista tbody").innerHTML += `
        <tr>
            ${valores}
            <td>${fechaHoraFormateada}</td>
            <td>
                <a href="actualizar.html?tabla=${id_tabla}&id=${id_elemento}" class="btn btn-warning">Actualizar</a>
                <a href="eliminar.html?tabla=${id_tabla}&id=${id_elemento}" class="btn btn-danger">Eliminar</a>
            </td>
        </tr>`
}
