const MainClassMethodTemplate = require("../utils/mainClassMethodTemplate");
const { URL } = require("url");

class GetCollectionSpecialPrices extends MainClassMethodTemplate {
    async execute() {
        const parsedUrl = new URL(this.req.url, `http://${this.req.headers.host}`);
        const collectionName = parsedUrl.searchParams.get("name");

        if (!collectionName) {
            throw new Error("collectionName no proporcionado");
        }

        const collection = await this.db.collection(collectionName).find().toArray();
        return collection;
    }

    errorMessage() {
        return "Error al obtener la colección";
    }
}

module.exports = GetCollectionSpecialPrices;