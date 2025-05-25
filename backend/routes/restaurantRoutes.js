const express = require('express');
const router = express.Router();

// Import controller
const restaurantController = require('../controllers/restaurantController');

// Define routes
router.get('/', restaurantController.getAllRestaurants);

router.get('/:id', restaurantController.getRestaurantById);

router.post('/', restaurantController.createRestaurant);

router.put('/:id', restaurantController.updateRestaurant);

router.delete('/:id', restaurantController.deleteRestaurant);

module.exports = router;