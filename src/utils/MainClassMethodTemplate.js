class MainClassMethodTemplate {

    constructor(req, res, db) {
        this.req = req,
            this.res = res,
            this.db = db
    }

    async handle() {
        try {
            if (this.shouldParseBody()) {
                await this.parseBody();
            }

            const result = await this.execute();

            this.res.writeHead(200, { "Content-Type": "application/json" });
            this.res.end(JSON.stringify(result));
        } catch (error) {
            console.error("Error:", error);
            this.res.writeHead(500, { "Content-Type": "application/json" });
            this.res.end(JSON.stringify({ error: this.errorMessage() }));
        }
    }

    shouldParseBody() {
        return false;
    }

    async parseBody() {
        const { bodyParser } = require("../utils/bodyParser");
        await bodyParser(this.req);
    }

    async execute() {
        throw new Error("execute() no implementado");
    }

    errorMessage() {
        return "Error interno del servidor";
    }

}

module.exports =  MainClassMethodTemplate ;