const router = require("express").Router();
const admin = require("firebase-admin");
let data = [];

router.get("/", (req, res) => {
  return res.send("Inside the user router");
});

router.get("/jwtVerfication", async (req, res) => {
  //console.log(req.header);
  if (!req.headers.authorization) {
    return res.status(500).send({ msg: "Toke Not Found" });
  }

  const token = req.headers.authorization.split(" ")[1];
  // return res.status(200).send({ token: token });
  try {
    const decodeValue = await admin.auth().verifyIdToken(token);
    if (!decodeValue) {
      return res
        .status(500)
        .json({ successful: false, msg: "Ununthorized token" });
    }
    return res.status(200).json({ successful: true, data: decodeValue });
  } catch (err) {
    return res.send({
      successful: false,
      msg: `Error in Extraction the token : ${err}`,
    });
  }
});

const listAllUsers = async (nextpagetoken) => {
  admin
    .auth()
    .listUsers(1000, nextpagetoken)
    .then((listuserresult) => {
      listuserresult.users.forEach((rec) => data.push(rec.toJSON()));
      if (listuserresult.pageToken) {
        listAllUsers(listuserresult.pageToken);
      }
    })
    .catch((err = console.log(err)));
};

listAllUsers();

router.get("/all", async (req, res) => {
  listAllUsers();
  try {
    return res.status(200).send({ success: true, data: data });
  } catch (err) {
    return res.send({ success: false, msg: `Error on listing user: ${err}` });
  }
});

module.exports = router;
