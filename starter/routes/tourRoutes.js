const express = require('express');
const tourController = require('./../controllers/tourController');
const router = express.Router();

router.param('id', tourController.checkId);

//check body middleware function
// check if the body contains name and price property
// if not send back 400 (bad request) status code
// add it to the post handler stack
router
  .route('/')
  .post(tourController.checkBody, tourController.createTour)
  .get(tourController.getAllTours);
router
  .route('/:id')
  .get(tourController.getTour)
  .delete(tourController.deleteTour)
  .patch(tourController.updateTour);

module.exports = router;
