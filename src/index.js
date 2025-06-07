const http = require('http');

const server = http.createServer((req, res) => {

    const { url, method } = req;

    console.log("URL", url, " - Method: ", method);



    switch (method) {
        case "GET":
            if (url === "/") {
                res.writeHead(200, { "content-type": "application/json" });
                res.write(JSON.stringify("hello world!!"));
                res.end();
            }
            break;
        /*case "POST":

            break;
        case "PUT":

            break;
        default:
            break;*/
    }
})

server.listen(3001);
console.log("Sever on port", 3001);