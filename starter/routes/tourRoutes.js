const express = require('express');
const router = express.Router();
const tourController = require('./../controllers/tourController');

router
  .route('/')
  .post(tourController.createTour)
  .get(tourController.getAllTours);
router
  .route('/:id')
  .get(tourController.getTour)
  .delete(tourController.deleteTour)
  .patch(tourController.updateTour);

module.exports = router;
