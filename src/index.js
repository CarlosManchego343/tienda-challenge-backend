const http = require('http');
const { MongoClient } = require('mongodb');
const { bodyParser } = require('./lib/bodyParser');

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

async function getProducts(req, res, db) {
    try {
        const collection = db.collection("productos");
        const articulos = await collection.find({}).toArray();
        res.writeHead(200, { "Content-type": "application/json" });
        res.write(JSON.stringify(articulos));
        res.end();
    } catch (error) {
        res.writeHead(500, { "Content-type": "application/json" });
        res.write(JSON.stringify({ error: "Error al obtener artículos" }));
        res.end();
    }
}

async function createCollectionSpecialPrices(req, res, db) {
    try {
        await bodyParser(req);
        const lastname = req.body.lastname;
        const specialNumber = req.body.specialNumber;
        const specialNumberString = specialNumber.toString();
        const collectionName = "preciosEspeciales".concat(lastname).concat(specialNumberString);
        await db.createCollection(collectionName);
        console.log("Colección creada");
        res.writeHead(200, { "Content-type": "application/json" });
        res.write(JSON.stringify("Recibido"));
        res.end();
    } catch (error) {
        res.writeHead(500, { "Content-type": "application/json" });
        res.write(JSON.stringify({ error: "Error al crear la colección" }));
        res.end();
    }
}

async function getCollectionSpecialPrices(req, res, db, collectionName) {
    try {
        const collection = await db.collection(collectionName).find().toArray();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(collection))
        res.end();
    } catch (error) {
        res.writeHead(500, { "Content-type": "application/json" });
        res.write(JSON.stringify({ error: "Error al obtener la colección" }));
        res.end();
    }
}

async function saveInCollectionSpecialPrices(req, res, db) {
    try {
        await bodyParser(req);
        const { collectionName, userID, productID, specialPrice } = req.body;

        const product = await db.collection("productos").findOne({ "productos.id": productID });

        if (!product) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ error: "Producto no encontrado" }));
            res.end();
            return;
        }

        const collection = db.collection(collectionName);
        await collection.insertOne({
            userID,
            productID,
            specialPrice
        })

        res.writeHead(200, { "Content-type": "application/json" });
        res.write(JSON.stringify("Guardando producto precio especial"));
        res.end();
    } catch (error) {
        res.writeHead(500, { "Content-type": "application/json" });
        res.write(JSON.stringify({ error: "Error al guardar en la colección" }));
        res.end();
    }
}

async function updatePricesOnCollection(req, res, db) {
    try {
        await bodyParser(req);
        const { collectionName, userID, productID, specialPrice } = req.body;
        const result = await db.collection(collectionName).updateOne(
            { userID, productID },
            { $set: { specialPrice: specialPrice } }
        );

        if (result.matchedCount === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ error: "No existe un precio especial para actualizar" }));
            res.end();
            return;
        }

        res.writeHead(200, { "Content-type": "application/json" });
        res.write(JSON.stringify("Actualización producto precio especial"));
        res.end();
    } catch (error) {
        res.writeHead(500, { "Content-type": "application/json" });
        res.write(JSON.stringify({ error: "Error al actualizar el precio" }));
        res.end();
    }
}

connectToDatabase().then((db) => {

    if (!db) return;

    const server = http.createServer((req, res) => {
        const { url, method } = req;
        console.log("URL", url, " - Method: ", method);
        switch (method) {
            case "GET":
                if (url === "/") {
                    getProducts(req, res, db);
                }
                if (url.startsWith("/get-collection")) {
                    const fullUrl = new URL(req.url, `http://${req.headers.host}`);
                    const collectionName = fullUrl.searchParams.get("name");
                    getCollectionSpecialPrices(req, res, db, collectionName);
                }
                break;
            case "POST":
                if (url === "/") {
                    createCollectionSpecialPrices(req, res, db);
                }
                if (url === "/save-product") {
                    saveInCollectionSpecialPrices(req, res, db);
                }
                break;
            case "PATCH":
                if (url === "/update-product") {
                    updatePricesOnCollection(req, res, db);
                }
                break;
            default:
                break;
        }
    })

    server.listen(3001);
    console.log("Sever on port", 3001);
})

