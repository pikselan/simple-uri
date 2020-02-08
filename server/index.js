// require module 
const bodyParser = require("body-parser")
const express = require("express")
const mongoose = require("mongoose")
const validUrl = require("valid-url")
const shortId = require("shortid")

// connect to MongoDB
const uri = "mongodb+srv://admin:[password]@[your-cluster].mongodb.net/[name-collection]?retryWrites=true&w=majority"

mongoose.connect(uri, { useNewUrlParser : true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'Mongodb connection error'))

// schema
const Schema = mongoose.Schema
const uriSchema = new Schema({
  originalUri: { type: String },
  uriCode: { type: String },
  shortUri: { type: String },
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now }
})
mongoose.model("uriModel", uriSchema)

// start server with parameter on port 7000
const app = express()
app.use(bodyParser.json())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,x-access-token,X-Key"
    )
    if(req.method == "OPTIONS") {
      res.status(200).end()
    } else {
      next()
    }
})
const port = 7000
  
  
// route
const uriModel = mongoose.model("uriModel")
const errorUri = 'http://localhost:7000/error'
app.get("/:code", async (req,res) => {
  const uriCode = req.params.code
  const item = await uriModel.findOne({ uriCode: uriCode })
  if (item) {
    return res.redirect(item.originalUri)
  } else {
    return res.redirect(errorUri)
  }
})

app.post("/", async (req,res) => {
  console.log(req.body)
  const originalUri = req.body.originalUri
  const shortBaseUri = req.body.shortBaseUri
  if (validUrl.isUri(shortBaseUri)) {
    
  } else {
    return res
    .status(401)
    .json(
      "Invalid Base Uri"
      )
  }
  
  const uriCode = shortId.generate();
  const updateAt = new Date()
  if (validUrl.isUri(originalUri)) {
    try {
      const item = await uriModel.findOne({ originalUri: originalUri })
      if (item) {
        res.status(200).json(item)
      } else {
        shortUri = shortBaseUri + "/" + uriCode
        const item = new uriModel({
          originalUri,
          shortUri,
          uriCode,
          updateAt
        })
        await item.save()
        res.status(200).json(item)
      }
    } catch {
      res.status(401).json("Invalid User Id")
    }
  } else {
    return res.status(401).json("Invalid Original Uri")
  }
})

app.listen(port, () => {
  console.log(`Server started on port`, port)
})
