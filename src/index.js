const http = require('http');
const { MongoClient } = require('mongodb');
const  GetProducts  = require('./classes/getProducts');
const PostCollectionSpecialPrices = require('./classes/PostCollectionSpecialPrices');
const PostDocumentSpecialPrices = require('./classes/PostDocumentSpecialPrices');
const PatchPricesOnCollection = require('./classes/PatchPricesOnCollection');
const GetCollectionSpecialPrices = require('./classes/GetCollectionSpecialPrices');

const uri = "mongodb://localhost:27017";

const dbName = "tienda";

const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Conectando a MongoDB");
        return client.db(dbName);
    } catch (error) {
        console.error("Error al conectar a MongoDB", error);
        return null;
    }
}

connectToDatabase().then((db) => {

    if (!db) return;

    const server = http.createServer(async (req, res) => {
        const { url, method } = req;
        console.log("URL", url, " - Method: ", method);
        switch (method) {
            case "GET":
                if (url === "/") {
                    await new GetProducts(req, res, db).handle();
                }
                if (url.startsWith("/get-collection")) {
                    await new GetCollectionSpecialPrices(req, res, db).handle();
                }
                break;
            case "POST":
                if (url === "/") {
                    await new PostCollectionSpecialPrices(req, res, db).handle();
                }
                if (url === "/save-product") {
                    await new PostDocumentSpecialPrices(req, res, db).handle();
                }
                break;
            case "PATCH":
                if (url === "/update-product") {
                    await new PatchPricesOnCollection(req, res, db).handle();
                }
                break;
            default:
                break;
        }
    })

    server.listen(3001);
    console.log("Sever on port", 3001);
})

