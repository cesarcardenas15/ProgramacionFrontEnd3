var id_tabla = "";
var id_registro = "";
function inicializarEliminacion() {
    id_tabla = obtenerValorEnDireccion("tabla");
    id_registro = obtenerValorEnDireccion("id");
    if (id_tabla == undefined) {
        id_tabla = "tipo_gestion";
    }
    let titulos = {
        "tipo_gestion": "Tipo de Gestión",
        "gestion": "Gestión",
        "cliente": "Cliente",
        "usuario": "Usuario",
        "resultado": "Resultado",
    };
    document.getElementById("titulo-eliminar").innerHTML = "Eliminar " + titulos[id_tabla];
    if (id_registro != undefined) {
        let mensaje = "¿Estás seguro de que quieres eliminar el registro de " + titulos[id_tabla] + " con el ID " + id_registro + "?";
        document.getElementById("lbl-eliminar").innerHTML = mensaje;
    }
    else {
        document.getElementById("lbl-eliminar").hidden = true;
        document.getElementById("boton-eliminar").hidden = true;
        let texto_error = "Parece que no se pudo obtener el registro para eliminar, vuelve a la lista e intentalo de nuevo, verifica tu conexión a internet o inténtalo más tarde";
        mostrarError(texto_error);
    }
}

function alternarModalConfirmacion() {
    $("#modal-confirmacion").modal("toggle");
}

function alternarModalExito() {
    $("#modal-exito").modal("toggle");
}

function mostrarError(texto_error) {
    let alerta_error = `
        <div class="alert alert-warning alert-dismissible" role="alert" id="error-crear">
            <div>${texto_error}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>\n`;
    document.getElementById("errores").innerHTML = alerta_error;
}

function eliminarDatos() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    //Opciones de solicitud
    const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
    };

    //Ejecutamos solicitud
    fetch(`http://144.126.210.74:8080/api/${id_tabla}/${id_registro}`, requestOptions)
        .then((response) => {

            //Cambiar por elementos de bootstrap
            if (response.status == 200) {
                alternarModalExito();
            }
            if (response.status == 400) {
                let texto_error = "No es posible eliminar. El registro está siendo utilizado.";
                mostrarError(texto_error);
            }
        })
        .then((result) => {
            let texto_error = "Hubo un error al eliminar el registro, verifica tu conexion o intentalo de nuevo más tarde";
            mostrarError(texto_error);
            console.log(result);
        })
        .catch((error) => console.error(error));
}