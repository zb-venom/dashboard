const router = require("express").Router();

const visitsContoller = require("../controllers/visits.controller");

router
  .route("/visits/:type")
  .get(visitsContoller.getVisits)
  .post(visitsContoller.addVisits);

router.route("/*").all((req, res) => {
  res.status(404).send({
    message: "Page not found",
  });
});

module.exports = router;
