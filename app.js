
var buffer_completo = Buffer.alloc(20);

console.log(buffer_completo);

buffer_completo.write("Andres    ");

console.log(buffer_completo);


var prueba = buffer_completo.subarray(0, 10);


/*Nota
    1 char = 1byte;


    Con el subarray le estoy diciendo que me muestre del byte a l otro byte;

    Alloc(), crea un buffer con tamaño especifico;



    Idea: Escribir buffers por tamaños especificos,
    cuando se lean, crear un arreglo que los corte de cierta cantidad de bits cada vez y las meta en un arreglo,
    cada buffer será un arreglo y se puede acceder a los datos con un trim o split, Crear clases que hagan la recoleccion de datos.


    Nota: Investigar como escribir sin borrar el contenido
    Nota: Si da tiempo, seria cool devolver JSON para la api,


*/

