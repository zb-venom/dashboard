const router = require("express").Router();

const visitsContoller = require("../controllers/visits.controller");

router
  .route("/visits/:type")
  .get(visitsContoller.getVisits)
  .post(visitsContoller.addVisits);

module.exports = router;
