// const http = require('http')
// const fs = require('fs/promises')
// let indexFile 
// const port = 8080
// const host = 'localhost'

// const requestListener = function (req, res) {
//     res.setHeader("Content-Type", "text/html");
//     res.writeHead(200);
//     res.end(indexFile);
// };

// const server = http.createServer(requestListener)
// fs.readFile(__dirname + "/index.html")
//     .then(contents => {
//         indexFile = contents;
//         server.listen(port, host, () => {
//             console.log(`Server is running on http://${host}:${port}`);
//         });
//     })
//     .catch(err => {
//         console.error(`Could not read index.html file: ${err}`);
//         process.exit(1);
//     });
    
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
 
router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});
 
//add the router
app.use('/', router);
app.listen(process.env.port || 8080);
