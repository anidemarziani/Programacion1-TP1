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
                let duracionDisco  = 0;
                while (cargarPista) {
                    let nombrePista, duracionPista;
                    
                    nombrePista = ObtenerNombrePista();
                    if( nombrePista != null) // Valida si se cancelo el prompt
                    {
                        duracionPista = ObtenerDuracionPista();
                        if(duracionPista !=  null ) // Valida si se cancelo el prompt
                        {
                            pistas.push({ nombre: nombrePista, duracion: duracionPista });
                            duracionDisco+=duracionPista;
                        }
                            
                    }

                    cargarPista = confirm("¿Desea ingresar otra pista?");
                }

                discos.push({ nombre: nombreDisco, autor: autorBanda, codigo: codigoUnico, duracion:duracionDisco , pistas: pistas });
                
                document.getElementById("totalRecopilado").innerHTML  = `<div><p>Tenes recopilado/s un total de ${discos.length} disco/s!</p></div> `;
            }
        }
    }
    
};
// Función Mostrar:
const mostrarDiscos = () => {
    if( document.getElementById("discosNoEncontrados").classList.contains("hide") == false) { document.getElementById("discosNoEncontrados").classList.add("hide");} 
    document.getElementById("discosNoEncontrados").classList.add("hide");
    document.getElementById("totalRecopilado").innerHTML  = `<div><p>Tenes recopilado/s un total de ${discos.length} disco/s!</p></div> `;
    
    let discosHtml = "";
    let discoMayorDuracionCodigoUnico;
    if( discos.length > 1){
        discoMayorDuracionCodigoUnico = discos.sort( (a,b)=> b.duracion - a.duracion)[0].codigo;
    }

    discos.forEach(disco => {
        let duracionMaxima = 0;
        let pistaDuracionMaxima = null;
        // Encontrar la pista con la duración máxima y calcular la duración total del disco
        disco.pistas.forEach(pista => {
            if (pista.duracion > duracionMaxima) {
                duracionMaxima = pista.duracion;
                pistaDuracionMaxima = pista;
            }
        });

        let promedioDuracion = disco.duracion / disco.pistas.length;
        let esDiscoDeMayorDuracion = false;
        if( disco.codigo === discoMayorDuracionCodigoUnico ) esDiscoDeMayorDuracion = true;
        if( isNaN(promedioDuracion) ) promedioDuracion = 0;

        discosHtml += CrearTarjetaDisco(disco,promedioDuracion,pistaDuracionMaxima, esDiscoDeMayorDuracion);

    });
    
    document.getElementById("info").innerHTML = discosHtml;



}
// Todas las funciones que necesites:
// Función Buscar por codigo:
const BuscarPorCodigo = () => {
    
    

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
            document.getElementById("totalRecopilado").innerHTML  = "";
        }
    } while ( codigoBuscado !== null && ( isNaN(codigoBuscado) || codigoBuscado < 1 || codigoBuscado > 999 ) ) ;
    
    if(codigoBuscado !== null )
    {
        
        document.getElementById("totalRecopilado").innerHTML  = `<div><p>Resultados de búsqueda: ${codigoBuscado}</p></div> `;
        const discoEncontrado = discos.find(disco => disco.codigo === codigoBuscado);

        if (discoEncontrado) {
            let duracionMaxima = 0;
            let pistaDuracionMaxima = null;
            let esDiscoDeMayorDuracion = false;
            
            discoEncontrado.pistas.forEach(pista => {
                if (pista.duracion > duracionMaxima) {
                    duracionMaxima = pista.duracion;
                    pistaDuracionMaxima = pista;
                }
            });
    
            let promedioDuracion = discoEncontrado.duracion / discoEncontrado.pistas.length;
            if( isNaN(promedioDuracion) )promedioDuracion = 0;
    
            let html = CrearTarjetaDisco(discoEncontrado,promedioDuracion,pistaDuracionMaxima, esDiscoDeMayorDuracion);
        
            document.getElementById("discosNoEncontrados").classList.add("hide");
            document.getElementById("info").innerHTML = html;
            
    
        } else {
            document.getElementById("info").innerHTML = "";
            document.getElementById("discosNoEncontrados").classList.remove("hide");
            
        }
    }
  
};

// Funcion Crear Tarjeta Disco: Devuelve el html que representa la tarjeta del disco.
const CrearTarjetaDisco = ( disco, promedioDuracion, pistaDeMayorDuracion, discoMayorDuracion) => {
    let template = `<li class="disco" id="${disco.codigo}">
    <h3>${disco.nombre}</h3>`

    if( discoMayorDuracion == true) template += `<p class="mayorDuracion">Mayor duración</p>`;

    template += `<p class="autor"><strong>Autor/Banda</strong><br> ${disco.autor}</p>
        <p><strong>Código único</strong><br> ${disco.codigo}</p>
        <p><strong>Cantidad de pistas</strong><br> ${disco.pistas.length}</p>
    `;  

    if( disco.pistas.length > 0){
        template += `<p><strong>Pista de mayor duración</strong> <br>${pistaDeMayorDuracion.nombre}</p>
            <p><strong>Duración total del disco</strong> <br>${disco.duracion} segundos</p>
            <p><strong>Promedio de duración</strong><br>${promedioDuracion.toFixed(2)} segundos</p>
            <h4>Pistas:</h4><ol>`
            
        disco.pistas.forEach(pista => {
            let duracionEnRojo = pista.duracion > 180 ? `<span class="duracionEnRojo">${pista.duracion}s</span>` : `<span>${pista.duracion}s</span>`;
            template += `<li> <span>${pista.nombre}</span> - ${duracionEnRojo}</li>`;
        });
        template += "</ol></li>";
    }
   
    return template;
}
// Función Obtener nombre del disco: Itera hasta obtener un nombre de disco valido, o su la cancelacion del prompt que devuelve null.
const ObtenerNombreDelDisco = () => {
    let nombreDisco="";
    do {
        nombreDisco = prompt("Ingrese el nombre del disco:");
        if ( nombreDisco !== null) nombreDisco = nombreDisco.trim();
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
        if ( autorBanda !== null) autorBanda = autorBanda.trim();
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
            codigoUnico = codigoUnico.trim();
            codigoUnico = parseInt(codigoUnico);
            if (isNaN(codigoUnico) ) 
            {
                alert("El código numérico único debe ser un número.");
            } else if( codigoUnico < 1 || codigoUnico > 999) {
                alert("El código numérico único debe estar entre 1 y 999.");
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
        if ( nombrePista !== null) nombrePista = nombrePista.trim();
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
        if( duracionPista !== null) {
            duracionPista = duracionPista.trim();
            duracionPista = parseInt(duracionPista);
        }
        
        if (isNaN(duracionPista) ) 
        {
            alert("El código numérico único debe ser un número.");
        } 
        else if( duracionPista < 0 || duracionPista > 7200 ) 
        {
            alert("La duración de la pista debe ser un número entre 0 y 7200 segundos.");
        }
        
    } while (isNaN(duracionPista) || duracionPista < 0 || duracionPista > 7200);
    return duracionPista;
}
