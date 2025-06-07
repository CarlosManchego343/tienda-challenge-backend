const MainClassMethodTemplate = require("../utils/mainClassMethodTemplate");

class GetProducts extends MainClassMethodTemplate {
    async execute() {
        const articulos = await this.db.collection("productos").find({}).toArray();
        return articulos;
    }

    errorMessage() {
        return "Error al obtener artículos";
    }
}

module.exports =  GetProducts;