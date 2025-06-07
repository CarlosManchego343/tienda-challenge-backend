const MainClassMethodTemplate = require("../utils/mainClassMethodTemplate");

class PostDocumentSpecialPrices extends MainClassMethodTemplate {
    shouldParseBody() {
        return true;
    }

    async execute() {
        const { collectionName, userID, productID, specialPrice } = this.req.body;
        const product = await this.db.collection("productos").findOne({ "productos.id": productID });

        if (!product) {
            this.res.writeHead(404, { "Content-Type": "application/json" });
            this.res.write(JSON.stringify({ error: "Producto no encontrado" }));
            this.res.end();
            return;
        }

        const collection = this.db.collection(collectionName);
        await collection.insertOne({
            userID,
            productID,
            specialPrice
        })

        return { mensaje: "Guardado producto precio especial" };
    }

    errorMessage() {
        return "Error al guardar en la colección";
    }
}

module.exports = PostDocumentSpecialPrices;