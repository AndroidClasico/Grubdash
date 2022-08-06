const path = require("path");

//dishes data & assign ID's
const dishes = require(path.resolve("src/data/dishes-data"));
const nextId = require("../utils/nextId");

// ---------------------- Validation middleware functions (6 functions)
function bodyHasNameProperty() {}

function bodyHasDescriptionProperty() {}

function bodyHasPriceProperty() {}

function bodyHasImageUrlProperty() {}

function dishExists(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  next({
    status: 404,
    message: `Dish does not exist: ${dishId}`,
  });
}

function bodyIdMatchesRouteId() {}

// ------------------------ Create Read Update List Handlers

function list(req, res) {
  res.json({ data: dishes });
}

function create(req, res) {
  //use nextId()
  const { data: { name, description, price, image_url } = {} } = req.body
  const newDish = {
    id: nextId(),
    name: name,
    description: description,
    price: price,
    image_url: image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

function read(req, res, next) {
  res.json({ data: res.locals.dish });
}

function update(req, res) {
  //use nextId() ???? maybe
}

module.exports = {
  list,
  create: [
    create,
    bodyHasNameProperty,
    bodyHasDescriptionProperty,
    bodyHasPriceProperty,
    bodyHasImageUrlProperty,
  ],
  read: [read, dishExists],
  update: [
    update,
    dishExists,
    bodyHasNameProperty,
    bodyHasDescriptionProperty,
    bodyHasPriceProperty,
    bodyHasImageUrlProperty,
    bodyIdMatchesRouteId,
  ],
};
