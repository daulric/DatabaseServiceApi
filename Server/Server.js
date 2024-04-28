const express = require("express")
const { FirebaseApp } = require("./Api/FirebaseApp.js")

const app = express();
const DB_Retrieval_Router = express.Router();
const DB_RetrieveParamRouter = express.Router({mergeParams: true});

app.use("/retrieve", DB_Retrieval_Router)
DB_Retrieval_Router.use("/" ,DB_RetrieveParamRouter)

const port = 3000

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
    
    console.log(newUserPath)

    const db = new FirebaseApp(path)

    db.getValue(newUserPath).then((value) => {
        res.json(value.val())
        res.end()
    })

})

app.use(express.json())

app.listen(port, () => {
    console.log(`Starting Server on Port ${port}`)
})