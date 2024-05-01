const express = require("express")
const { FirebaseApp } = require("./Api/FirebaseApp.js")

const bodyParser = require("body-parser")

require("dotenv").config()

var jsonParser = bodyParser.json()

const app = express();
const DB_Retrieval_Router = express.Router();
const DB_RetrieveParamRouter = express.Router({mergeParams: true});

const DB_SetDataRouter = express.Router();
const DB_SetDataRouterParams = express.Router({mergeParams: true})

app.use("/retrieve", DB_Retrieval_Router)
app.use("/push", DB_SetDataRouter)

DB_Retrieval_Router.use("/" ,DB_RetrieveParamRouter)
DB_SetDataRouter.use("/", DB_SetDataRouterParams)

// Retrieval Purposes!
DB_Retrieval_Router.route("/").get((req, res) => {
    res.status(200).send("Retrieval Ready!")
})

DB_RetrieveParamRouter.get("/:path/:user", (req, res) => {
    let path = req.params["path"]
    let user = req.params["user"]

    let extendedPath = req.query["path"]

    let newUserPath

    if (typeof(extendedPath) !== "undefined") {
        newUserPath = `${user}/${extendedPath}`
    } else {
        newUserPath = user
    }

    const db = new FirebaseApp(path)

    db.getValue(newUserPath).then((value) => {
        res.json(value.val())
        res.end()
    })

})

// Pushing Data Purpose!
// -- Here for the Work

DB_SetDataRouter.route("/").get((req, res) => {
    res.send("Waiting to Set Data!")
})

DB_SetDataRouterParams.post("/:path/:user", jsonParser, (req, res) => {
    let path = req.params["path"]
    let user = req.params["user"]

    let extendedPath = req.query["path"]

    let newUserPath

    if (typeof(extendedPath) !== "undefined") {
        newUserPath = `${user}/${extendedPath}`
    } else {
        newUserPath = user
    }

    let database = new FirebaseApp(path)
    database.setValue(newUserPath, req.body)
})

app.use(express.json())
app.listen(process.env.PORT, () => {
    console.log(`Starting Server on Port ${process.env.PORT}`)
})