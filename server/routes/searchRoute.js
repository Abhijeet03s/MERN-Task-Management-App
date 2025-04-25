const express = require("express");
const router = express.Router();
const { searchTask } = require("../controllers/searchController");
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post("/", searchTask);

module.exports = router;