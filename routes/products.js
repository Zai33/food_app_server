const router = require("express").Router();
const admin = require("firebase-admin");
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

router.post("/create", async (req, res) => {
  try {
    const id = Date.now();
    const data = {
      product_Id: req.body.id,
      product_name: req.body.product_name,
      product_price: req.body.product_price,
      product_category: req.body.product_category,
      image: req.body.image,
    };
    const response = await db.collection("products").doc(`/${id}/`).set(data);
    console.log(response);
    return res.status(200).send({ success: true, data: response });
  } catch (err) {
    return res.send({ success: false, msg: `Error${err}` });
  }
});

// get all the products
router.get("/all", async (req, res) => {
  (async () => {
    try {
      let query = db.collection("products");
      let response = [];
      await query.get().then((querysnap) => {
        let docs = querysnap.docs;
        docs.map((doc) => {
          response.push({ ...doc.data() });
        });
        return response;
      });
      return res.status(200).send({ success: true, data: response });
    } catch (err) {
      return res.send({ success: false, msg: `Error${err}` });
    }
  })();
});

//delete product
router.delete("/delete/:product_name", async (req, res) => {
  const name = req.params.product_name;
  try {
    await db
      .collection("products")
      .doc(`/${name}/`)
      .delete()
      .then((result) => {
        return res.status(200).send({ success: true, data: result });
      });
  } catch (err) {
    return res.send({ success: false, msg: `Error${err}` });
  }
});

module.exports = router;
