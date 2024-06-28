var id_tabla = "";
var nombres_elementos = {
    "tipo_gestion": "nombre_tipo_gestion",
    "resultado": "nombre_resultado",
    "gestion": "id_gestion",
    "cliente": "c_nombres",
    "usuario": "u_nombres"
};
var ids_a_nombrar = ["id_gestion", "id_tipo_gestion", "id_usuario", "id_cliente", "id_resultado"];
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
                "id_usuario": "Nombre Usuario",
                "id_cliente": "Nombre Cliente",
                "id_tipo_gestion": "Nombre Tipo Gestión",
                "id_resultado": "Nombre Resultado",
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

    construirSolicitud();
}

function construirSolicitud() {

    // Establecer partes de la consulta a construir
    let select = "";
    let from = "";
    let where = "";

    // Ir por cada llave de la tabla actual
    llaves.forEach((llave) => {
        // Si la llave por la que se está pasando corresponde al id del registro de la tabla, añadirlo a la lista
        if (llave == `id_${id_tabla}`) {
            select += `${id_tabla}.${llave}, `;
            from += `${id_tabla}, `;
        }
        // Si no, ver si la llave de id por la que se está pasando tiene que reemplazarse por la llave de un nombre
        else if (ids_a_nombrar.includes(llave)) {
            // Obtener el id de la tabla de la llave cortando la parte "id_" de la llave (Por ejemplo, "id_gestión" pasa a ser "gestión").
            let nombre_tabla = llave.substring(3);
            // Usar el id para obtener la llave que corresponde al nombre del registro.
            let reemplazo_llave = nombres_elementos[nombre_tabla];

            let consulta_select = "";
            // Si la llave corresponde a un nombre de cliente o usuario, concatenarla con el apellido correspondiente y usarla como la llave
            // de reemplazo para separar los nombres de clientes y usuarios a elementos independientes, esto para poder después accederlos sin
            // problema
            if (["c_nombres", "u_nombres"].includes(reemplazo_llave)) {
                consulta_select = `CONCAT(${nombre_tabla}.nombres, ' ', ${nombre_tabla}.apellidos) AS ${reemplazo_llave}`;
            }
            // Si no, simplemente hacer una consulta normal con la llave de reemplazo
            else {
                consulta_select = `${nombre_tabla}.${reemplazo_llave}`
            }

            select += `${consulta_select}, `;
            from += `${nombre_tabla}, `;
            where += `${id_tabla}.${llave} = ${nombre_tabla}.${llave} AND `;
        }
        // Si la llave no es el id del registro ni tampoco el id de otra tabla, entonces es otro elemento del registro, en ese caso, simplemente
        // añadirlo al SELECT
        else {
            select += `${id_tabla}.${llave}, `;
        };
    });

    // Si "where" no está vacío, anidar "WHERE" al principio, si no, dejar where vació
    if (!where == "") {
        where = " WHERE " + where;
        // Borrar AND sobrante en WHERE
        where = where.slice(0, -5);
    };
    // Borrar comas sobrantes y espacio al final
    select = select.slice(0, -2);
    from = from.slice(0, -2);

    // Unir la consulta final
    let solicitud = `SELECT ${select} FROM ${from}${where}`;

    console.log(solicitud);
    obtenerDatosYListar(solicitud);
}
function obtenerDatosYListar(solicitud) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
        "query": solicitud
    });
    console.log(raw);
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    console.log(requestOptions);
    fetch("http://144.126.210.74:8080/dynamic", requestOptions)
        .then(response => response.json())
        .then((json) => {
            json.forEach(completarFila);
            $('#tbl_lista').DataTable();
        })
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}
function completarFila(element, index, arr) {
    let valores = "";

    console.log(element);

    let elemento = arr[index];
    let id_elemento = elemento[llaves[0]];
    llaves.forEach((llave) => {
        if (llave != "fecha_registro") {
            if (ids_a_nombrar.includes(llave) && llave != `id_${id_tabla}`) {
                console.log(llave, id_elemento, "aaaaa");
                let id_tabla_a_nombrar = llave.substring(3);
                valores += `<td>${elemento[nombres_elementos[id_tabla_a_nombrar]]}</td>\n`;
                console.log(valores, llave, elemento[nombres_elementos[id_tabla_a_nombrar]]);
            }
            else {
                valores += `<td>${elemento[llave]}</td>\n`;
            }
        }
    });

    var fechaHoraFormateada = formatearFechaHora(element.fecha_registro);
    arr[index] = document.querySelector("#tbl_lista tbody").innerHTML += `
        <tr>
            ${valores}
            <td>${fechaHoraFormateada}</td>
            <td>
                <a href="actualizar.html?tabla=${id_tabla}&id=${id_elemento}" class="btn btn-warning">Actualizar</a>
                <a href="eliminar.html?tabla=${id_tabla}&id=${id_elemento}" class="btn btn-danger">Eliminar</a>
            </td>
        </tr>`
}
