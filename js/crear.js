// Llaves de los elementos en la tabla.
var llaves;

var id_tabla_pagina;

function inicializarCrear() {
    // Obtener que en que tabla se quiere crear a partir del id encontrado en la dirección URL.
    id_tabla_pagina = obtenerValorEnDireccion("tabla");

    // Especificar titulo predeterminado.
    let titulo_actual = "Crear Tipo de Gestión";
    let items;
    let forms = "";

    // A partir del ID de la tabla, especificar los nombres correspondientes a cada llave de la tabla
    // que se mostrarán para describir cada elemento del formulario.
    switch (id_tabla_pagina) {
        case "resultado":
            titulo_actual = "Crear Resultado";
            items = {
                "nombre_resultado": "Nombre",
            };
            break;
        case "gestion":
            titulo_actual = "Crear Gestión";
            items = {
                "id_usuario": "ID Usuario",
                "id_cliente": "ID Cliente",
                "id_tipo_gestion": "ID Tipo Gestión",
                "id_resultado": "ID Resultado",
                "comentarios": "Comentarios",
            };
            break;
        case "cliente":
            titulo_actual = "Crear Clientes";
            items = {
                "id_cliente": "ID Cliente",
                "nombres": "Nombres",
                "apellidos": "Apellidos",
                "email": "E-Mail",
                "celular": "Celular",
            };
            break;
        case "usuario":
            titulo_actual = "Crear Usuario";
            items = {
                "id_usuario": "ID Usuario",
                "nombres": "Nombres",
                "apellidos": "Apellidos",
                "email": "E-Mail",
                "celular": "Celular",
                "username": "Nombre de Usuario",
                "password": "Contraseña",
            };
            break;
        default:
            // Si no se especifica un ID de tabla, especificar uno predeterminado.
            id_tabla_pagina = "tipo_gestion";
            items = {
                "nombre_tipo_gestion": "Nombre",
            };
    };

    // Si no se especificó ninguna tabla, mostrar un error.
    if (id_tabla_pagina == undefined) {
        let texto_error = "Parece que hubo un error y no es posible encontrar la tabla especificaste, selecciona otra tabla inténtalo de nuevo.";
        mostrarError(texto_error);
    }

    // Tomar las "llaves" de los elementos de la tabla.
    llaves = Object.keys(items);

    // Por cada llave, construir un elemento del formulario.
    llaves.forEach((llave) => {
        let tipo = "text";
        let comentario = `Ingrese ${items[llave]}.`;
        let seleccion = false;

        // Si la llave corresponde a alguna de las siguientes, especificar su tipo para que el formulario
        // las muestre correctamente (Por ejemplo, esto se usa para esconder las contraseñas).
        if (["email", "username", "password"].includes(llave)) {
            tipo = llave;
        }

        // Si la llave corresponde a alguna de las siguientes, especificar que son de tipo "Selección",
        // para que el usuario pueda elegir un registro desde una lista.
        if (["id_gestion", "id_tipo_gestion", "id_resultado", "id_cliente", "id_usuario"].includes(llave)) {
            seleccion = true;
        }

        // Construir los elementos del formulario a partir de las variables establecidas anteriormente.
        if (!seleccion) {
            forms += `
                <div class="mb-3">
                    <label for="${llave}" class="form-label">${items[llave]}</label>
                    <input type="${tipo}" class="form-control" id="${llave}" aria-describedby="emailHelp" required>
                    <div id="emailHelp" class="form-text">${comentario}</div>
                    <div class="invalid-feedback">
                        Por favor, ingresa ${items[llave]}.
                    </div>
                </div>\n`;
        }
        // Si el elemento del formulario es de tipo "Selección", construir el elemento para usarlo como tal.
        else {
            forms += `
                <div class="form-floating">
                    <select class="form-select" id="${llave}" aria-label="${items[llave]}" required>
                        <option selected disabled>Seleccione una opcion...</option>
                    </select>
                    <label for="floatingSelect">${items[llave]}</label>
                </div>`;
            // Corta la parte "id_" de la llave para conseguir el nombre de la tabla.
            let nombre_tabla = llave.substring(3);
            // Usar el nombre de la tabla para encontrar los registros que necesita el elemento de tipo
            // selección.
            obtenerDatosCrear(nombre_tabla);
        }
    });
    document.getElementById("titulo-crear").innerHTML = titulo_actual;
    document.getElementById("form-crear").innerHTML = forms;
}

function obtenerDatosCrear(id_tabla) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch(`http://144.126.210.74:8080/api/${id_tabla}`, requestOptions)
        .then((response) => response.json())
        .then((json) => json.forEach(completarFormulario))
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function completarFormulario(element, index, arr) {
    let elemento = arr[index];
    // Especificar el valor preferido para mostrar en la selección dependiendo de la tabla.
    let nombres_elementos = {
        "tipo_gestion": "nombre_tipo_gestion",
        "resultado": "nombre_resultado",
        "gestion": "id_gestion",
        "cliente": "nombres",
        "usuario": "nombres"

    };
    // Obtener nombre de tabla
    let id_tabla = Object.keys(elemento)[0];
    // Quitarle "id_" a la llave del id de la tabla para obtener su nombre.
    let nombre_tabla = id_tabla.substring(3);
    let opcion = "";
    if (["cliente", "usuario"].includes(nombre_tabla)) {
        opcion = `<option value="${elemento[id_tabla]}">${elemento["nombres"]} ${elemento["apellidos"]}</option>\n`
    }
    else {
        opcion = `<option value="${elemento[id_tabla]}">${elemento[nombres_elementos[nombre_tabla]]}</option>\n`;
    }
    document.getElementById(id_tabla).innerHTML += opcion;
}

// Validar que el formulario tenga datos validos
function validarDatos() {
    // Almacenar los elementos del formulario que necesitan validación
    const forms = document.querySelectorAll('.needs-validation');

    // Al presionar el botón de tipo "submit", ir por cada elemento y si alguno no es valido,
    // evitar que se permita la creación del registro.
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault();
            if (!form.checkValidity()) {
                event.stopPropagation();
                let texto_error = "Hay uno o más elementos que no tienen valores validos, verifica el formulario e inténtalo de nuevo."
                mostrarError(texto_error);
            }
            // Si ningún elemento es invalido, preguntar por confirmación
            else {
                alternarModalConfirmacion();
            }
            form.classList.add('was-validated')
        }, false)
    });

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

function crearDatos() {
    let solicitud_crear = {};
    llaves.forEach((llave) => {
        solicitud_crear[llave] = document.getElementById(llave).value;
    });
    solicitud_crear["fecha_registro"] = fechaActualFormateada();

    //Encabezado de la solicitud
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    //Carga útil de datos
    const raw = JSON.stringify(solicitud_crear);
    console.log(raw);

    //Opciones de solicitud
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    //Ejecutamos solicitud
    fetch(`http://144.126.210.74:8080/api/${id_tabla_pagina}`, requestOptions)
        .then((response) => {
            if (response.status == 200) {
                alternarModalConfirmacion();
                alternarModalExito();
            }
        })
        .then((result) => console.log(result))
        .catch((error) => {
            let texto_error = "Parece que ocurrió un error al crear, verifica tu conexión a internet o inténtalo más tarde.";
            alternarModalConfirmacion();
            mostrarError(texto_error);
            console.error(error);
        });
}
