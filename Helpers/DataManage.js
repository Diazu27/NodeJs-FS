const fs = require('fs').promises;
const inquirer = require('inquirer');


const path = './Data.dat';


//Devulve un arreglo con todos los objetos de productos
const getProducts = async()=>{
    
    const {superData,inodeList,Bmp}= await ReadMainData();

    let prod = [];

    inodeList.pop();
    for (const obj of inodeList){
        //obtengo el objeto

        let id = obj.id;
        if(!Bmp[id+1].isFree){
            let product = await readBlock(obj.finalByte);
            prod.push(product);
        }
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

    const {superData,inodeList,Bmp}= await ReadMainData();

    if( id < Bmp.length ){

        if(!Bmp[id].isFree){
            const InitialByte = parseInt(inodeList[id-1].finalByte);
            
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
        
        }else{
            return false;
        }

    }else{
        return false;
    }

    
}


const EditProducts = async(idP, data, optChange)=>{
    
    //ACCESO AL ARCHIVO, ES OBLIGATORIO PARA LEER O ESCRIBIR
    const handle = await fs.open(path, "r+");

    //leo la data del inode
    const {superData,inodeList,Bmp}= await ReadMainData();

    const InitialByte = parseInt(inodeList[idP-1].finalByte);
    let {id, model, material, stock} = await readBlock(InitialByte);
    let cont = 0;

   console.log(data,optChange);
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
    let bufferEspecifico = Buffer.alloc(80);
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

    const {superData,inodeList,Bmp}= await ReadMainData();
    const handle = await fs.open(path, "r+");
    // tamaño del Arreglo de InodeArray
    var id = 0;

    const obj = Bmp.find(element => element.isFree === true);

    
    if(obj){
        id = obj.id;
    }else{
        id = inodeList.length;
    }

    const InitialByte = parseInt(inodeList[id-1].finalByte);

    //creo el bloque datos o buffer
    let bufferEspecifico = Buffer.alloc(80);
    bufferEspecifico.write(`${id}-${data}-${ActualDate()}-`);
    let dataFinal = bufferEspecifico.toString('base64'); 

    //Se sobreescribe la data    
    await handle.write(dataFinal, InitialByte);

    //actualizo la lista
    await UpdateMainData(id);

    
    
    handle.close();

}


const sellProduct = async(idP, cant)=>{
    const {superData,inodeList,Bmp}= await ReadMainData();

    const handle = await fs.open(path, "r+");
    const InitialByte = parseInt(inodeList[idP-1].finalByte);
    let {id, model, material, stock} = await readBlock(InitialByte);

    
    if(stock<cant){
        
        console.log("\n-----------------------".red);
        console.log("No hay suficiente Stock".red);
        console.log("-----------------------".red);
        
    }else{

        

        //pregunta de confirmación
        const {opt} = await inquirer.prompt([{
            type: 'confirm',
            name: 'opt',
            message: `¿Seguro que quiere vender este producto? `
        }]); 

        let a = parseInt(stock);
        let b = parseInt(cant);
        
        //Resto la cantidad
        stock = a-b;

        //creo el bloque datos o buffer
        let bufferEspecifico = Buffer.alloc(80);
        bufferEspecifico.write(`${id}-${model}-${material}-${stock}-${ActualDate()}-`);
    
        let dataFinal = bufferEspecifico.toString('base64'); 
    
     
        if(opt){

            //Se sobreescribe la data    
            const {numberOfBytesWritten} =await handle.write(dataFinal, InitialByte);
            
        }
    
       
    }

    handle.close()
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



const DeleteProduct= async(id)=>{
    const {superData,inodeList,Bmp}= await ReadMainData();

    const handle = await fs.open(path, "r+");

    //Inicio de escritura

    const InitialByte = parseInt(inodeList[id-1].finalByte);

    //creo el bloque datos o buffer
    let bufferEspecifico = Buffer.alloc(80);
    let dataFinal = bufferEspecifico.toString('base64'); 
    //Se sobreescribe la data    
    const {numberOfBytesWritten} =await handle.write(dataFinal, InitialByte);

    UpdateMainData(id);

    handle.close();
}

// Main data me refiero a los archivos base como el Super, Inodes 


const UpdateSuper = ()=>{

}



const UpdateMainData = async(id)=>{

    const {superData,inodeList,Bmp}= await ReadMainData();

    const finalByteAnt = parseInt(inodeList[id-1].finalByte);

    let a = "";

    if(id > inodeList.length-1){
        //Agrego el nuevo inode
        inodeList.push({
            id: id,
            finalByte: finalByteAnt + 108
        })

        Bmp.push({
            id: id,
            isFree : false
        });

        superData.RecordTotal += 1;

        a = `${JSON.stringify(superData)} - ${JSON.stringify(inodeList)} - ${JSON.stringify(Bmp)}-`;

    }else{


        if(Bmp[id].isFree){
            Bmp[id] = {
                id: id,   
                isFree: false
            }

            superData.RecordTotal += 1;

        }else{
            
            Bmp[id] = {
                id: id,   
                isFree: true
            }
            superData.RecordTotal -= 1;
        }



        a = `${JSON.stringify(superData)} - ${JSON.stringify(inodeList)} - ${JSON.stringify(Bmp)}-`;
    }

    //acceso al archivo
    const handle = await fs.open(path, "r+");
    
    //super - nombre y cantidad de registos
    const superBlock = Buffer.alloc(1024)
    superBlock.write(a);
    let finalData = superBlock.toString('base64');

    //Se sobreescribe la data    

    try {
        const { bytesWritten } = await handle.write(finalData, 0, superBlock.length, 1);
        console.log(`${bytesWritten} Bytes modificados`);
    } catch (error) {
        console.log(error)
    }finally{
        handle.close();
    }

   
}



const InitMainData = async()=>{

    const superData = {
        nameTable : 'Productos',
        recordSize : '108bytes',
        RecordTotal : 0
    }
    const  inodeList = [{
        id: 0,
        finalByte: 1368
    }]
    
    const Bmp = [{
        id: 0,
        isFree : false
    }]

    //acceso al archivo
    const handle = await fs.open(path, "r+");
    const a = `${JSON.stringify(superData)} - ${JSON.stringify(inodeList)} - ${JSON.stringify(Bmp)}-`;

    //super - nombre y cantidad de registos
    const superBlock = Buffer.alloc(1024)
    superBlock.write(a);
    let finalData = superBlock.toString('base64');

    try {
        const { bytesWritten } = await handle.write(finalData, 0, superBlock.length, 1);
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
    const cont = new Buffer.from(buffer.toString(),'base64').toString('ascii');
    
    let data = cont.split('-');

    let superData = JSON.parse(data[0]) ;
    let inodeList = JSON.parse(data[1]);
    let Bmp = JSON.parse(data[2]);
    
    handle.close();

    return {superData,inodeList,Bmp}
}



const mostrarJson = async()=>{

    const {superData,inodeList,Bmp}= await ReadMainData();
    console.log(superData);
    console.log(inodeList);
    console.log(Bmp);
}

module.exports = {
    getProducts,
    findById,
    EditProducts,
    SaveProduct,
    InitMainData,
    UpdateMainData,
    ReadMainData,
    DeleteProduct,
    mostrarJson,
    sellProduct
}