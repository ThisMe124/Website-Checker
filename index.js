import express from 'express'
import isUp from 'is-up'
import bodyparser from 'body-parser'
import isReachable from 'is-reachable'
import { bahasa_planet } from 'bahasa-planet'
import axios from 'axios'
const PORT = 9000;
const app = express();
app.set("view engine", "ejs")
app.use(bodyparser.urlencoded({
   extended: false
}));
app.use(bodyparser.json());
app.set('json spaces', 2)

const isUrl = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
}

//Web Check API V1 ( Recommended )
app.get('/isdown/v1', async(req, res) => {
try {
  var url = req.query.domain
  if (!url) return res.status(400).json({
        status: false,
        message: "Enter domain query"
    })
  const response = await axios.head(url) 
   res.json({ 
     status: true,
     status_code: response.status, 
     info_error: null,
     github: "https://github.com/ThisMe124/Website-Checker"
   }) 
  } catch(error) {
  if(error.response) {
     res.json({ 
       status: false, 
       status_code: error.response.status, 
       info_error: null,
       github: "https://github.com/ThisMe124/Website-Checker"
     })
  } else if (error.code === 'ECONNABORTED') {
     res.json({ 
       status: 'timeout', 
       status_code: null, 
       info_error: error.message
     })
  } else {
     res.json({ 
       status: 'Unknow Error', 
       status_code: null, 
       info_error: 
       error.message
     })
    }
  }
// handle if the error reaches the server.
}, (error, req, res, next) => {
    res.json({ 
       status: 'Unknow Error', 
       status_code: null, 
       info_error: error.message
     })
})

//Web Check API V2 ( Recommended )
app.get("/isdown/v2", async (req,res) => {
  var url = req.query.domain
  if (!url) return res.status(400).json({
        status: false,
        message: "Enter domain query"
    })
  var resp = await isReachable(url)
  var wdoh = await isReachable(url)
  if (resp === true) {
   resp = "Site is Running (200) OK"
   } else if (resp === false) {
   resp = "Site is Down (500) Not OK"
   } 
   res.json({ 
        domain: url, 
        status: resp,
        status_web: wdoh,
        github: "https://github.com/ThisMe124/Website-Checker",
    })
// handle if the error reaches the server.
}, (error, req, res, next) => {
    res.json({ 
       status: 'Unknow Error', 
       status_code: null, 
       info_error: error.message
     })
})

//Web Check API V3 ( the same as v1 but the difference is the get method and recommended to use )
app.get('/isdown/v3', async(req, res) => {
try {
  var url = req.query.domain
  if (!url) return res.status(400).json({
        status: false,
        message: "Enter domain query"
    })
  const response = await axios.get(url) 
   res.json({ 
     status: true,
     status_code: response.status, 
     info_error: null,
     github: "https://github.com/ThisMe124/Website-Checker"
   }) 
  } catch(error) {
  if(error.response) {
     res.json({ 
       status: false, 
       status_code: error.response.status, 
       info_error: null,
       github: "https://github.com/ThisMe124/Website-Checker"
     })
  } else if (error.code === 'ECONNABORTED') {
     res.json({ 
       status: 'timeout', 
       status_code: null, 
       info_error: error.message
     })
  } else {
     res.json({ 
       status: 'Unknow Error', 
       status_code: null, 
       info_error: 
       error.message
     })
    }
  }
// handle if the error reaches the server.
}, (error, req, res, next) => {
    res.json({ 
       status: 'Unknow Error', 
       status_code: null, 
       info_error: error.message
     })
})

// [ NEW ] check a response from url and get a content.
app.get('/check_domain/response', async(req, res) => {
if(!req.query.url) return res.json({ status: false, info: 'please input query url' })
try {
const response = await axios.get(req.query.url) 
res.json({ 
  status: true, 
  results: response.data, 
  status_code: response.status, 
  info_error: null 
 }) 
} catch(error) {
  if(error.response) {
     res.json({ 
       status: false, 
       results: response.data,
       status_code: error.response.status, 
       info_error: null
     })
    } else {
     res.json({ 
       status: 'Unknow Error', 
       status_code: null, 
       info_error: error.message
     })
    } 
  }
// handle if the error reaches the server.
}, (error, req, res, next) => {
    res.json({ 
       status: 'Unknow Error', 
       status_code: null, 
       info_error: error.message
     })
})

// Bonus Hehe :)
app.get("/bahasa/planet", async(req, res) => {
try {
var text = req.query.text
var alias = req.query.alias
if (!text) return res.status(400).json({
status: false,
message: "Enter text parameters"
})
if (!alias) return res.status(400).json({
status: false,
message: "Enter alias parameters"
})
let pop = bahasa_planet(text, alias)
res.json({ result: pop })
} catch(err) {
res.json({ info: err.message })
}
})

app.get("/", async (req,res) => {
   res.json({
   result: "200 OK",
   github: "https://github.com/ThisMe124/Website-Checker"
   })
})

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})


app.listen(PORT, () => {
   console.log(`App is listening on Port ${PORT}`);
});
