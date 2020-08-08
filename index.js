/*************** imports or requires for the server to use ******************************************************************/
const express = require("express");


/********************* create a new express server  *************************************************************************/
const server = express();
server.use(express.json());

/************************tell the server where to listen     **************************************************************/
server.listen(8000, () => {
    console.log("Server started on port 8000")
})