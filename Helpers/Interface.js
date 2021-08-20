const inquirer = require('inquirer');
const Producto = require('../Models/Producto');

var Table = require('cli-table');
require('colors');


const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: '1. Crear Producto'
            },
            {
                value: 2,
                name: '2. Listar Productos'
            },
            {
                value: 3,
                name: '3. Eliminar Productos'
            },
            {
                value: 4,
                name: '4. Vender Productos'
            },
            {
                value: 5,
                name: '5. Buscar por Id'
               
            },
            {
                value: 6,
                name: '6. Editar Producto'
               
            },
            {
                value: 7,
                name: '7. Mantenimiento Base datos'
               
            },
            {
                value: 0,
                name: '0. Salir'
            }
            
        ]
    }
];


const inquirerMenu = async()=>{
    console.clear();
    console.log('==============================='.yellow );
    console.log('    Seleccione una opción      '.yellow);
    console.log('===============================\n'.yellow);

    const {opcion} = await inquirer.prompt(preguntas);

    return opcion;
}

const pause = async()=>{

    const question = [{
        type: 'input',
        name: 'enter',
        message: `Presione ${'Enter'.green} para continuar`
    }];

    console.log('\n');
    await inquirer.prompt(question);

}



const NewProductMenu = async()=>{

    console.clear();
    console.log('==============================='.blue );
    console.log('      Crear nuevo Producto     ');
    console.log('===============================\n'.blue);


    const {modelo} = await inquirer.prompt([{
        type: 'input',
        name: 'modelo',
        message: `Escriba el Modelo del producto: \n R// `
    }])

    const {material} = await inquirer.prompt([{
        type: 'input',
        name: 'material',
        message: `Escriba el material del producto: \n R// `
    }])
    const {stock} = await inquirer.prompt([{
        type: 'input',
        name: 'stock',
        message: `Escriba la cantidad en existencia \n R// `
    }])


    const emp = new Producto(1,modelo,material,stock)
    return emp.ParseProducto();
}



const ListProducts = (products) =>{

    var table = new Table();

    table.push(
        ['Id'.green, 'Modelo'.green, 'Material'.green, 'En Stock'.green, 'fecha'.green]
    ); 

    for (const product of products) {
        table.push(
            [product.id, product.model, product.material, product.stock, product.date]
        );  
    }

    console.log("");
    console.log(table.toString());
}


const Consulta = async()=>{
    console.log("");
    const {dato} = await inquirer.prompt([{
        type: 'confirm',
        name: 'dato',
        message: `Quiere actualizar este registro \n R// `
    }])    

    return dato;
}



const EditProductsMenu = async()=>{

    console.clear();
    console.log('==============================='.blue );
    console.log('         editar Producto     ');
    console.log('===============================\n'.blue);

    const {optChange} = await inquirer.prompt([{
        type: 'checkbox',
        name: 'optChange',
        message: 'Seleccione el dato a editar',
        choices: [ 
            { name: 'Modelo',  value: 1},
            { name: 'Material',  value: 2 },
            { name: 'Stock', value: 3 },
        ]
    }]);

    let data = [];

    for (const op of optChange) {
        switch (op) {
            case 1:
                const {modelo} = await inquirer.prompt([{
                    type: 'input',
                    name: 'modelo',
                    message: `Escriba el Modelo del producto: \n R// `
                }])
                data.push(modelo);
            break;
                
            case 2:
                const {material} = await inquirer.prompt([{
                    type: 'input',
                    name: 'material',
                    message: `Escriba el material del producto: \n R// `
                }])
                data.push(material);
                break;
            
                case 3: 
                const {stock} = await inquirer.prompt([{
                    type: 'input',
                    name: 'stock',
                    message: `Escriba la cantidad en existencia \n R// `
                }]);
                data.push(stock);
                break;
        
            default:
                break;
        }
      
        
    }

    return {data, optChange};

}



const FindIdTitle =async ()=>{

    console.clear();
    console.log('==============================='.blue );
    console.log('  Buscar por ID del producto   ');
    console.log('===============================\n'.blue);


    const {id} = await inquirer.prompt([{
        type: 'input',
        name: 'id',
        message: `Escriba el id del producto: \n R// `
    }])

    return parseInt(id);
}


const FindId =async ()=>{

    console.clear();
    const {id} = await inquirer.prompt([{
        type: 'input',
        name: 'id',
        message: `Escriba el id del producto: \n R// `
    }])

    return parseInt(id);
}


module.exports = {
    inquirerMenu,
    pause,
    NewProductMenu,
    ListProducts,
    FindId,
    FindIdTitle,
    EditProductsMenu,
    Consulta,
}