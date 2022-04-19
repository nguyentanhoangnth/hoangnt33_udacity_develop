import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8080;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // filter image
  app.get("/api/filteredimage/", async (req, res) => {
    let { image_url } = req.query;

    if (!image_url || image_url == "") {
      return res.status(400).send({ message: "Image Url is required or malformed" });
    }

    try {
      let absolutePath: string = await filterImageFromURL(req.query.image_url) as string;
      res.sendFile(absolutePath, async (err) => {
        if (err) {
          return res.status(201).send({ message: "Have no any resources can be find" });
        } else {
          await deleteLocalFiles([absolutePath]);
          return res.status(200);
        }
      });
    } catch (e) {
      return res.status(201).send({ message: "Have no any resources can be find" });
    }
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();