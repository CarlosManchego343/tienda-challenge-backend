const MainClassMethodTemplate = require("../utils/mainClassMethodTemplate");

class PostCollectionSpecialPrices extends MainClassMethodTemplate {
    shouldParseBody() {
        return true;
    }

    async execute() {
        const lastname = this.req.body.lastname;
        const specialNumber = this.req.body.specialNumber;
        const specialNumberString = specialNumber.toString();
        const collectionName = "preciosEspeciales".concat(lastname).concat(specialNumberString);
        await this.db.createCollection(collectionName);
        return { mensaje: "Colección creada", collectionName };
    } 

    errorMessage() {
        return "Error al crear la colección";
    }
}

module.exports = PostCollectionSpecialPrices;