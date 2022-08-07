const path = require("path");

//dishes data & assign ID's
const dishes = require(path.resolve("src/data/dishes-data"));
const nextId = require("../utils/nextId");

// ---------------------- Validation middleware functions (6 functions)
function bodyDataHas(propertyName) {
    return function (req, res, next) {
      const { data = {} } = req.body;
      if (data[propertyName]) {
        return next();
      }
      if (data["price"] < 1 || !data["price"]) {
        next({ status: 400, message: `Dish must include a price` });
      }
      next({ status: 400, message: `Dish must include a ${propertyName}` });
    };
}

function isNumber(req, res, next) {
    const dish = res.locals.dish;
    if (typeof dish.price !== "string") {
      return next();
    }
    next({
      status: 400,
      message: `Updated dish price must be a number`,
    });
}

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

function bodyIdMatchesRouteId(req, res, next) {}

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

function read(req, res) {
  res.json({ data: res.locals.dish });
}

function update(req, res) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    const { data: { id, name, description, price, image_url } = {} } = req.body;
  
    // Update the dish
    foundDish.id = id;
    foundDish.name = name;
    foundDish.description = description;
    foundDish.price = price;
    foundDish.image_url = image_url;
  
    res.json({ data: foundDish });
}

module.exports = {
  list,
  create: [
    create,
    bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("price"),
    bodyDataHas("image_url"),
  ],
  read: [read, dishExists],
  update: [
    update,
    dishExists,
    isNumber,
    bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("price"),
    bodyDataHas("image_url"),
    bodyIdMatchesRouteId,
  ],
};
