const MainClassMethodTemplate = require("../utils/mainClassMethodTemplate");

class PatchPricesOnCollection extends MainClassMethodTemplate {
    shouldParseBody() {
        return true;
    }

    async execute() {
        const { collectionName, userID, productID, specialPrice } = this.req.body;
        const result = await this.db.collection(collectionName).updateOne(
            { userID, productID },
            { $set: { specialPrice: specialPrice } }
        );

        if (result.matchedCount === 0) {
            this.res.writeHead(404, { "Content-Type": "application/json" });
            this.res.write(JSON.stringify({ error: "No existe un precio especial para actualizar" }));
            this.res.end();
            return;
        }

        return { mensaje: "Actualización producto precio especial" };
    }

    errorMessage() {
        return "Error al actualizar el precio";
    }
}

module.exports = PatchPricesOnCollection;