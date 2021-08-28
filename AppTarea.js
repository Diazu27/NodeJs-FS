const { SaveProduct, ReadMainData, InitMainData, findById, getProducts,EditProducts, DeleteProduct,mostrarJson, sellProduct } = require("./Helpers/DataManage");
const { inquirerMenu, NewProductMenu, pause, ListProducts, FindId,FindIdTitle,  EditProductsMenu, Consulta, Cantidad } = require("./Helpers/Interface");

const main = async()=>{

    band = true;

    while (band) {

        const opcion =  await inquirerMenu();
      
        switch (opcion) {
            case 1:
                data = await NewProductMenu();
                await SaveProduct(data);
               
                await pause();
                
                break;
            case 2: 
                data = await getProducts();
                await ListProducts(data);
                await pause();
                break;
            
            case 3: 
            id = await FindId();
            obj =  await findById(id);
            await ListProducts(obj);

            const a = await Consulta();

            if(a){
                
                if(id){
                    await DeleteProduct(id);
                }

            }

            await pause();
            break;
            
            case 4:
                id = await FindIdTitle();
                obj =  await findById(id);
                ListProducts(obj);
                await pause();
                break;

            case 5:
                id = await FindId();
                obj =  await findById(id);
                await ListProducts(obj);
              

                if(obj){
                    const d = await Consulta();
               
                    if(d){
                        let {data, optChange} = await EditProductsMenu();
                        await EditProducts(id,data,optChange);
                        await pause(); 
                    }
                    
                }else{
                    await pause();
                }
                
                break;

            case 6:
                await InitMainData();
                await pause();
            break;


            case 7: 
                id = await FindId();
                obj =  await findById(id);
                await ListProducts(obj);


                const d = await Consulta();
               
                if(d){
                    const cant = await Cantidad();
                    await sellProduct(id,cant);
                }
                await pause();
                break;
               
            case 0: 
                return false;
                
        
            default:
                break;
        }
    }


}

main();