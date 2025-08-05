const express = require("express");
const router = express.Router();
const fruitController = require("../controllers/fruitController");

const auth = require("../middleware/authMiddleware");

router.get("/", fruitController.getAllfruits);
router.get("/:id", fruitController.getfruitById);
router.post("/", auth, fruitController.createfruit);
router.put("/:id", auth, fruitController.updatefruit);
router.delete("/:id", auth, fruitController.deletefruit);
router.get("/name/:name", fruitController.getfruitByName);

module.exports = router;
