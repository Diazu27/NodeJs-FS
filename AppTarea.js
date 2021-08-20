const { SaveProduct, ReadMainData, InitMainData, findById, getProducts,EditProducts } = require("./Helpers/DataManage");
const { inquirerMenu, NewProductMenu, pause, ListProducts, FindId,FindIdTitle,  EditProductsMenu, Consulta  } = require("./Helpers/Interface");

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
            
            case 5:
                id = await FindIdTitle();
                obj =  await findById(id);
                ListProducts(obj);
                await pause();
                break;

            case 6:
                id = await FindId();
                obj =  await findById(id);
                await ListProducts(obj);
                const d = await Consulta();
               
                if(d){
                    let {data, optChange} = await EditProductsMenu();
                    await EditProducts(id,data,optChange);
                    await pause();
                    
                }

                
                break;

            case 7:
                await InitMainData();
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