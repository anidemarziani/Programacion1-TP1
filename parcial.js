'use strict';
let discos = [];

// Función Cargar:
const cargarNuevoDisco = () => {

    if( document.getElementById("discosNoEncontrados").classList.contains("hide") == false){
        document.getElementById("discosNoEncontrados").classList.add("hide");
    } 

    let nombreDisco, autorBanda, codigoUnico, pistas;

    nombreDisco = ObtenerNombreDelDisco();
    if( nombreDisco != null  ) {  // Valida si se cancelo el prompt
        autorBanda = ObtenerNombreDeLaBanda();
        if( autorBanda != null ) // Valida si se cancelo el prompt
        {
            codigoUnico = ObtenerCodigoUnicoDelDisco();
            if( codigoUnico != null ) {  // Valida si se cancelo el prompt
               
                pistas = [];
                let cargarPista = true;
            
                while (cargarPista) {
                    let nombrePista, duracionPista;
                    
                    nombrePista = ObtenerNombrePista();
                    if( nombrePista != null) // Valida si se cancelo el prompt
                    {
                        duracionPista = ObtenerDuracionPista();
                        if(duracionPista !=  null ) // Valida si se cancelo el prompt
                        {
                            pistas.push({ nombre: nombrePista, duracion: duracionPista });
                        }
                            
                    }

                    cargarPista = confirm("¿Desea ingresar otra pista?");
                }

                discos.push({ nombre: nombreDisco, autor: autorBanda, codigo: codigoUnico, pistas: pistas });
                
                document.getElementById("totalRecopilado").innerHTML  = `<div><p>Tenes recopilado/s un total de ${discos.length} disco/s!</p></div> `;
            }
        }
    }
    
};
// Función Mostrar:
const mostrarDiscos = () => {
    // Variable para ir armando la cadena:
    
    let discosHtml = "";

    if( discos.length == 0 && document.getElementById("discosNoEncontrados").classList.contains("hide")) 
    {
        document.getElementById("discosNoEncontrados").classList.remove("hide");
    }else
    {
        document.getElementById("discosNoEncontrados").classList.add("hide");

        document.getElementById("totalRecopilado").innerHTML  = `<div><p>Tenes recopilado/s un total de ${discos.length} disco/s!</p></div> `;
        discos.forEach(disco => {
            let duracionMaxima = 0;
            let pistaDuracionMaxima = null;
            let duracionTotalDisco = 0;
    
            // Encontrar la pista con la duración máxima y calcular la duración total del disco
            disco.pistas.forEach(pista => {
                duracionTotalDisco += pista.duracion;
                if (pista.duracion > duracionMaxima) {
                    duracionMaxima = pista.duracion;
                    pistaDuracionMaxima = pista;
                }
            });
    
            let promedioDuracion = duracionTotalDisco / disco.pistas.length;
            if( isNaN(promedioDuracion) )promedioDuracion = 0;
            discosHtml += CrearTarjetaDisco(disco, duracionTotalDisco,promedioDuracion,pistaDuracionMaxima);
    
        });
        
        document.getElementById("info").innerHTML = discosHtml;
    }


}
// Todas las funciones que necesites:
// Función Buscar por codigo:
const BuscarPorCodigo = () => {
    
    document.getElementById("totalRecopilado").innerHTML  = "";
    

    let codigoBuscado;
    do {
        codigoBuscado = prompt("Ingrese el código numérico único del disco (entre 1 y 999):");
        if( codigoBuscado !== null) {
            codigoBuscado = parseInt(codigoBuscado);
            if (isNaN(codigoBuscado) || codigoBuscado < 1 || codigoBuscado > 999) {
                if (isNaN(codigoBuscado)) {
                    alert("El código numérico único debe ser un número.");
                } else {
                    alert("El código numérico único debe estar entre 1 y 999.");
                }
            }
        }
    } while ( codigoBuscado !== null && ( isNaN(codigoBuscado) || codigoBuscado < 1 || codigoBuscado > 999 ) ) ;
    
    if(codigoBuscado !== null ){
        const discoEncontrado = discos.find(disco => disco.codigo === codigoBuscado);

        if (discoEncontrado) {
            let duracionMaxima = 0;
            let pistaDuracionMaxima = null;
            let duracionTotalDisco = 0;
    
            discoEncontrado.pistas.forEach(pista => {
                duracionTotalDisco += pista.duracion;
                if (pista.duracion > duracionMaxima) {
                    duracionMaxima = pista.duracion;
                    pistaDuracionMaxima = pista;
                }
            });
    
            let promedioDuracion = duracionTotalDisco / discoEncontrado.pistas.length;
            if( isNaN(promedioDuracion) )promedioDuracion =0;
    
            let html = CrearTarjetaDisco(discoEncontrado, duracionTotalDisco,promedioDuracion,pistaDuracionMaxima);
        
            document.getElementById("discosNoEncontrados").classList.add("hide");
            document.getElementById("info").innerHTML = html;
            
    
        } else {
            document.getElementById("info").innerHTML = "";
            document.getElementById("discosNoEncontrados").classList.remove("hide");
            
        }
    }
  
};

// Funcion Crear Tarjeta Disco: Devuelve el html que representa la tarjeta del disco.
const CrearTarjetaDisco = ( disco,duracionTotalDisco, promedioDuracion , pistaDeMayorDuracion) => {
    let template = `<article id="${disco.codigo}">
    <h3>${disco.nombre}</h3>
    <p><strong>Autor/Banda</strong><br> ${disco.autor}</p>
    <p><strong>Código único</strong><br> ${disco.codigo}</p>
    <p><strong>Cantidad de pistas</strong><br> ${disco.pistas.length}</p>
    `;

    if( disco.pistas.length > 0){
        template += `<p><strong>Pista de mayor duracion</strong> <br>${pistaDeMayorDuracion.nombre}</p>
            <p><strong>Duración total del disco</strong> <br>${duracionTotalDisco} segundos</p>
            <p><strong>Promedio de duración</strong><br>${promedioDuracion.toFixed(2)} segundos</p>
            <h4>Pistas:</h4><ol>`
            
        disco.pistas.forEach(pista => {
            let duracionEnRojo = pista.duracion > 180 ? `<span class="duracionEnRojo">(${pista.duracion}s)</span>` : pista.duracion;
            template += `<li> ${pista.nombre} ${duracionEnRojo}</li>`;
        });
        template += "</ol></article>";
    }


    
    return template;
}
// Función Obtener nombre del disco: Itera hasta obtener un nombre de disco valido, o su la cancelacion del prompt que devuelve null.
const ObtenerNombreDelDisco = () => {
    let nombreDisco="";
    do {
        nombreDisco = prompt("Ingrese el nombre del disco:");
        if (nombreDisco === "") {
            alert("El nombre del disco no puede estar vacío.");
        }
    } while (nombreDisco === "");

    return nombreDisco;
}
// Función Obtener nombre de la banda: Itera hasta obtener un nombre de la banda valido, o su la cancelacion del prompt que devuelve null.
const ObtenerNombreDeLaBanda = () => {
    let autorBanda = "";
    do {
        autorBanda = prompt("Ingrese el autor o banda del disco:");
        if (autorBanda === "") {
            alert("El autor o banda del disco no puede estar vacío.");
        }
    } while (autorBanda === "");
    return autorBanda;
}
// Función Obtener código unico del disco: Itera hasta obtener un codigo unico de disco o la cancelacion del prompt (que devuelve null).
const ObtenerCodigoUnicoDelDisco = ()=> {
    let codigoUnico;
    do {
        codigoUnico = prompt("Ingrese el código numérico único del disco (entre 1 y 999):");
        if( codigoUnico !== null) {
            codigoUnico = parseInt(codigoUnico);
            if (isNaN(codigoUnico) || codigoUnico < 1 || codigoUnico > 999) {
                if (isNaN(codigoUnico)) {
                    alert("El código numérico único debe ser un número.");
                } else {
                    alert("El código numérico único debe estar entre 1 y 999.");
                }
            } else if (discos.some(disco => disco.codigo === parseInt(codigoUnico) )) {
                alert("El código numérico único ya ha sido utilizado. Ingrese otro código.");
            }
        }
    } while ( codigoUnico !== null && ( isNaN(codigoUnico) || codigoUnico < 1 || codigoUnico > 999 || discos.some(disco => disco.codigo === parseInt(codigoUnico)) ) );
    return codigoUnico;
}
// Función Obtener nombre de pista : Itera hasta obtener un nombre de pista valido o la cancelacion del prompt (que devuelve null).
const ObtenerNombrePista = () => {
    let nombrePista;
    do {
        nombrePista = prompt("Ingrese el nombre de la pista:");
        if (nombrePista === "") {
            alert("El nombre de la pista no puede estar vacío.");
        }
    } while (nombrePista === "");
    return nombrePista;
}
// Función Obtener duracion de pista : Itera hasta obtener una duracion de pista valida o la cancelacion del prompt (que devuelve null).
const ObtenerDuracionPista = () => {
    let duracionPista;
    do {
        duracionPista = prompt("Ingrese la duración de la pista en segundos (entre 0 y 7200):");
        if( duracionPista !== null) 
            duracionPista = parseInt(duracionPista);
        if (isNaN(duracionPista) || duracionPista < 0 || duracionPista > 7200) {
            alert("La duración de la pista debe ser un número entre 0 y 7200 segundos.");
        }
    } while (isNaN(duracionPista) || duracionPista < 0 || duracionPista > 7200);
    return duracionPista;
}
