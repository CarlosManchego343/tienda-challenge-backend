const http = require('http');

const server = http.createServer((req, res) => {

    const { url, method } = req;

    console.log("URL", url, " - Method: ", method);

    res.writeHead(200, {"content-type": "text/plain"});
    res.write("Received");
    res.end();
})

server.listen(3001);
console.log("Sever on port", 3001);