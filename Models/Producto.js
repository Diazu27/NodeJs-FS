class Producto {

    constructor(id, modelo, material, stock){
        this.modelo = modelo;
        this.material = material;
        this.stock = stock;
    };


    ParseProducto = ()=>{

        return `${this.modelo}-${this.material}-${this.stock}`

    }

}

module.exports = Producto;