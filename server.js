const usesThen = () => {
  return doAnotherThing().then((anotherResult) => {
    return anotherResult[0];
  });
};

const usesAwait = async () => {
  const anotherResult = await doAnotherThing();
  return anotherResult[0];
};

const catchThen = () => {
  return doThing().catch((error) => {
    console.error(error);
  });
};
const catchAwait = async () => {
  try {
    return await doThing();
  } catch (error) {
    console.error(error);
  }
};

(async () => {
  const express = require("express");
  const bodyParser = require("body-parser");
  const { MongoClient, ServerApiVersion } = require("mongodb");

  try {
    const connectionString =
      "mongodb+srv://rebekahkithing:gJqjkZkJMj8uegw@cluster0.ellxlu7.mongodb.net/?retryWrites=true&w=majority";
    const client = await MongoClient.connect(connectionString, {
      useUnifiedTopology: true,
    });

    console.log("Connected to Database");
    const db = client.db("star-trek-quotes");
    const quotesCollection = db.collection("quotes");

    const app = express();
    app.set("view engine", "ejs");
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static("public"));
    app.use(bodyParser.json());

    app.get("/", async (req, res) => {
      try {
        const results = await quotesCollection.find().toArray();

        console.log(results);
        res.render("index.ejs", { quotes: results });
      } catch (error) {
        console.error(error);
      }
    });

    app.post("/quotes", async (req, res) => {
      try {
        const result = await quotesCollection.insertOne(req.body);

        console.log(result);
        res.redirect("/");
      } catch (error) {
        console.error(error);
      }
    });

    app.put("/quotes", async (req, res) => {
      try {
        const filter = { name: "Spock" };

        const update = {
          $set: {
            name: req.body.name.trim(),
            quote: req.body.quote.trim(),
          },
        };

        const options = {
          upsert: true,
        };

        const result = await quotesCollection.findOneAndUpdate(
          filter,
          update,
          options
        );
        console.log(result);

        if (result.lastErrorObject.updatedExisting) {
          res.status(200);
        } else {
          res.status(400);
        }
        res.end();
      } catch (error) {
        console.error(error);
        res.status(500);
      }
    });

    app.delete("/quotes", async (req, res) => {
      try {
        const result = await quotesCollection.deleteOne({
          name: req.body.name,
        });

        if (result.deletedCount === 0) {
          res.status(404);
        } else {
          res.status(200);
        }
        res.end();
      } catch (error) {
        res.status(500);
        res.json(error);
        res.end();

        console.error(error);
      }
    });

    app.listen(3000, function () {
      console.log("Listening on 3000");
    });
  } catch (error) {
    console.error(error);
  }
})();
