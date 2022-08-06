const path = require("path");

//dishes data & assign ID's
const dishes = require(path.resolve("src/data/dishes-data"));
const nextId = require("../utils/nextId");

// ---------------------- Validation middleware functions (6 functions)
function bodyHasNameProperty() {

};

function bodyHasDescriptionProperty() {
    
};

function bodyHasPriceProperty() {
    
};

function  bodyHasImagUrlProperty() {
    
};

function dishExists() {
    const { dishId } = req.params;
    const foundDish = dishes.find(dish => dish.id === Number(dishId));
    if (foundDish) {
      res.locals.dish = foundDish;
      return next();
    }
    next({
        status: 404,
        message: `Dish does not exist: ${dishId}`
    });
};

function  bodyIdMatchesRouteId() {

};

// ------------------------ Create Read Update List Handlers

function list(req, res) {
    res.json({ data: dishes });
};

function create(req, res) {
    //use nextId()

};

function read(req, res) {
    res.json({ data: res.locals.dish });
};

function update(req, res) {
    //use nextId() ???? maybe

};