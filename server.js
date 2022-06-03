const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const connectionString = "mongodb+srv://rebekahkithing:gJqjkZkJMj8uegw@cluster0.ellxlu7.mongodb.net/?retryWrites=true&w=majority"

MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-trek-quotes')
    const quotesCollection = db.collection('quotes')
    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded ({ extended: true }))
    app.use(express.static('public'))
    app.use(bodyParser.json())
    app.get('/',  (req, res) => {
        quotesCollection.find().toArray()
            .then(results => {
                console.log(results)
                res.render('index.ejs',{quotes:results})
            })
            .catch(error => console.error(error))
      })
      app.post('/quotes',(req,res) => {
        quotesCollection.insertOne(req.body)
            .then(result => {
                console.log(result)
                res.redirect('/')
            })
            .catch(error => console.error(error))
    })

    app.put('/quotes', (req,res) => {
        const filter = {name : 'Spock'};

        const update = {
            $set: {
                name: req.body.name.trim(),
                quote: req.body.quote.trim(),
            }
        };

        const options = {
            upsert: true
        };

        return quotesCollection.findOneAndUpdate(filter, update, options)
         .then (result => {
             console.log(result);

             if (result.lastErrorObject.updatedExisting) {
                 res.status(200);
             } else {
                 res.status(400);
             }
             res.end();
         })
         .catch(error => {
             res.status(500);
             res.json(error);
             res.end();
             console.error(error);
         })
    })

    app.delete('/quotes', (req,res) => {
     quotesCollection.deleteOne(
          {name: req.body.name},
        )
          .then(result => {
              if(result.deletedCount === 0){
                  res.status(404)
              } else {
                  res.status(200)
              }
              res.end();        
        })
        .catch(error => {
            res.status(500);
            res.json(error);
            res.end();
            
            console.error(error);
        })
    })    
    app.listen(3000,function() {
        console.log('Listening on 3000')
    })
})
.catch(error => console.error(error))





