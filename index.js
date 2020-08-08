/*************** imports or requires for the server to use ******************************************************************/
const express = require("express");
const postsRoute = require('./posts/postsRoute');

/********************* create a new express server  *************************************************************************/
const server = express();
server.use(express.json());
server.use(postsRoute)



/************************tell the server where to listen     **************************************************************/
server.listen(8000, () => {
    console.log("Server started on port 8000")
})