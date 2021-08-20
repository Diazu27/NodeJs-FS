const fs = require('fs').promises;
const inquirer = require('inquirer');


const path = './Data.dat';



//Devulve un arreglo con todos los objetos de productos
const getProducts = async()=>{
    let {b,a,inodeArray} = await ReadMainData();


    let prod = [];
    inodeArray.pop();


    for (const id of inodeArray){
        //obtengo el objeto
        let obj = await readBlock(id);
        prod.push(obj);
    }
    
    return prod

}

//esta funcion recibe el byte y devuelve objeto 
const readBlock = async(bt) =>{

    //creo el buffer de lectura
    var buffer = Buffer.alloc(110);

    //establezco el punto de partida
    var byte = parseInt(bt);

    //abro la lectura
    const handle = await fs.open(path, "r+");
    await handle.read(buffer,0,110, byte);

    //decodifico data
    const cont = new Buffer.from(buffer.toString(),'base64').toString('ascii').split('-');
  
    // cierro
    handle.close();

    //parseo a un objeto

    return {
        id: cont[0],
        model: cont[1],
        material: cont[2],
        stock: cont[3],
        date: cont[4]
    }
}


//Este recibe el id y devuelve un arreglo con un objeto
const findById = async(id)=>{

    const {a,b,inodeArray} = await ReadMainData();
    const InitialByte = parseInt(inodeArray[id-1]);

    //acceso al archivo
    const handle = await fs.open(path, "r+");

    //Creo el buffer en memoria y le meto la data en un rango de bytes
    var buffer = Buffer.alloc(110);
    await handle.read(buffer,0,110,InitialByte);

    handle.close();

    const cont = new Buffer.from(buffer.toString(),'base64').toString('ascii').split('-');


    return [{
        id: cont[0],
        model: cont[1],
        material: cont[2],
        stock: cont[3],
        date: cont[4]
    }];
}


const EditProducts = async(idP, data, optChange)=>{
    
    //ACCESO AL ARCHIVO, ES OBLIGATORIO PARA LEER O ESCRIBIR
    const handle = await fs.open(path, "r+");

    //leo la data del inode
    const {b,a,inodeArray} = await ReadMainData();

    const InitialByte = parseInt(inodeArray[idP-1]);

    let {id, model, material, stock} = await readBlock(InitialByte);
    let cont = 0;

    for (const i of optChange) {

        switch (i) {
            case 1:
                model = data[cont];   
                break;
            case 2:
                material = data[cont];   
                break;
            case 3:
                stock = data[cont];  
          
                break;
        
            default:
                break;
        }
        cont++;
    }

    //creo el bloque datos o buffer
    let bufferEspecifico = Buffer.alloc(110);
    bufferEspecifico.write(`${id}-${model}-${material}-${stock}-${ActualDate()}-`);
    let dataFinal = bufferEspecifico.toString('base64'); 

    //pregunta de confirmación
    const {opt} = await inquirer.prompt([{
        type: 'confirm',
        name: 'opt',
        message: `Seguro que quiere actualizar este registro) `
    }])  


    if(opt){
        //Se sobreescribe la data    
        const {numberOfBytesWritten} =await handle.write(dataFinal, InitialByte);

        if(numberOfBytesWritten){
            console.log('Se actualizaron los Datos');
        }
    }

    handle.close()

}




const SaveProduct =  async(data) =>{

    const {b,a,inodeArray} = await ReadMainData();

    const handle = await fs.open(path, "r+");

    // tamaño del Arreglo de InodeArray
    const id = inodeArray.length;

    //Inicio de escritura

    const InitialByte = parseInt(inodeArray[id-1]);

    //creo el bloque datos o buffer
    let bufferEspecifico = Buffer.alloc(80);
    bufferEspecifico.write(`${id}-${data}-${ActualDate()}-`);
    let dataFinal = bufferEspecifico.toString('base64'); 

    //Se sobreescribe la data    
    const {numberOfBytesWritten} =await handle.write(dataFinal, InitialByte);

    inodeArray.push(InitialByte+110)

    //actualizo la lista
    await UpdateMainData(inodeArray,id);

    handle.close();

}


const ActualDate = ()=>{
    let date = new Date()

    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    if(month < 10){
        return `${day}/0${month}/${year}`
    }else{
        return `${day}/${month}/${year}`
    }
}



// Main data me refiero a los archivos base como el Super, Inodes 

const UpdateMainData = async(inodeArray,id)=>{

    //acceso al archivo
    const handle = await fs.open(path, "r+");

    //super - nombre y cantidad de registos
    const superBlock = Buffer.alloc(20) // 0 - 20
    let num = id;
    superBlock.write(`Productos-${num.toString()}`)

    //inodes convierto el arreglo a string
    let inode= inodeArray.toString();  // 20- 1368
    //escribir data en el buffer
    const buf = Buffer.alloc(1024);
   
    //Se parsea el buffer a Base64
    await buf.write(`${superBlock.toString()}-${inode}-`);
    let finalData = buf.toString('base64');

    //Se sobreescribe la data    

    try {
        const { bytesWritten } = await handle.write(finalData, 0, buf.length, 1);
        console.log(`${bytesWritten} Bytes modificados`);
    } catch (error) {
        console.log(error)
    }finally{
        handle.close();
    }
}



const InitMainData = async()=>{

    //acceso al archivo
    const handle = await fs.open(path, "r+");

    //super - nombre y cantidad de registos
    const superBlock = Buffer.alloc(20) // 0 - 20
    let num = 0;
    superBlock.write(`Productos-${num.toString()}`)

    //inodes convierto el arreglo a string
    let arr = [1368];
    let inode= arr.toString();  // 20- 1368
    //escribir data en el buffer
    const buf = Buffer.alloc(1024);
   
    //Se parsea el buffer a Base64
    await buf.write(`${superBlock.toString()}-${inode}-`);
    let finalData = buf.toString('base64');

    //Se sobreescribe la data    

    try {
        const { bytesWritten } = await handle.write(finalData, 0, buf.length, 1);
        console.log(`${bytesWritten} Bytes modificados`);
    } catch (error) {
        console.log(error)
    }finally{
        handle.close();
    }
}


const ReadMainData = async()=>{

    //acceso al archivo
    const handle = await fs.open(path, "r+");

    //Creo el buffer en memoria y le meto la data en un rango de bytes
    var buffer = Buffer.alloc(1368);
    await handle.read(buffer,0,1368);

    //Parseo a string
    const cont = new Buffer.from(buffer.toString(),'base64').toString('ascii')
    
    let data = cont.split('-');

    let tableName = data[0];
    let TotalRecords = data[1];
    let inodeArray = data[2].split(',');
    
    handle.close();
    return {tableName,TotalRecords,inodeArray}
}


module.exports = {
    getProducts,
    findById,
    EditProducts,
    SaveProduct,
    InitMainData,
    UpdateMainData,
    ReadMainData
}