const express = require("express");
const router = express.Router();
const { searchTask } = require("../controllers/searchController");

router.get("/search_task", searchTask);

module.exports = router