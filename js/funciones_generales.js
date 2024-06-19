function formatearFechaHora(fecha_registro) {
    var fechaHoraActual = new Date(fecha_registro);
    var fechaHoraFormateada = fechaHoraActual.toLocaleString('es-ES', {
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'UTC'
    }).replace(/(\d+)\/(\d+)\/(\d+)\, \s*(\d+):(\d+):(\d+)/, '$3-$2-$1 $4:$5:$6')
    return fechaHoraFormateada;
}

function fechaActualFormateada() {
    var fechaHoraActual = new Date();
    var fechaHoraFormateada = fechaHoraActual.toLocaleString('es-ES', {
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'UTC'
    }).replace(/(\d+)\/(\d+)\/(\d+)\, \s*(\d+):(\d+):(\d+)/, '$3-$2-$1 $4:$5:$6')
    return fechaHoraFormateada;
}

function obtenerValorEnDireccion(llave) {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_direccion = parametros.get(llave);
    return p_id_direccion;
}