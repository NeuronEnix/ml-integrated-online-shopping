require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Connect to MongoDB
require("./dbConnection").connectToDatabase();

const app = express();

const corsOptions = {
    origin: ["http://localhost:3000"],
    credentials: true,
};

app.use(cors(corsOptions));

// Middleware
const { reqLogger } = require("./handlers/requestHandler");
app.use(express.json(), reqLogger);

// Api routers
app.use(require("./api"));
app.use(require("./handlers/tokenHandler/router"));
const { resOk, resErr, resErrType, unknownErrHandler } = require("./handlers/responseHandler");
app.all("/", (req, res) => resOk(res));

// Handling Error
// request should reach here if no api were matched ( make sure that your api routers and middleware are specified above this )
app.use((req, res) => {
    // Always keep this at the end just before uncaughtErrorHandler
    resErr(res, resErrType.invalidAPI);
});

// catch all uncaught errors ( should always be specified at the end just before app.listen() )
app.use(unknownErrHandler);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server listening at:", PORT));

const fs = require( "fs" );
if ( !fs.existsSync( "img" ) ) fs.mkdirSync( "img" );