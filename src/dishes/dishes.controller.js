
const path = require("path");
// existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));
//  assign ID's when necessary
const nextId = require("../utils/nextId");

// CRUD functionality 
function create(req, res, next) {
  const { name, description, price, image_url } = req.body.data;
  const newDish = {
    id: nextId(),
    name,
    description,
    price,
    image_url
  }
  dishes.push(newDish);
  res.status(201).json({data: newDish}); 
}

function list(req, res, next) {
  res.json({ data: dishes });
}

function read(req, res, next) {
  res.json({ data: res.locals.dish })
}

function update(req, res, next) {
  const oldDishData = res.locals.dish;
  const newDishData = req.body.data
  res.status(200).json( { data: {...oldDishData, ...newDishData} } );
}


// MIDDLEWARE
function dishIdExists(req, res, next) {
  const { dishId } = req.params;
  const dish = dishes.find(dish => dish.id === dishId);
  if(dish) {
    res.locals.dish = dish;
    return next();
  }
  next({
    status: 404,
    message: `Dish does not exist: ${dishId}`
  })
}

function dishIdsMatch(req, res, next) {
  const bodyId = req.body.data.id
  const paramId = req.params.dishId

  if(bodyId === null || !bodyId || bodyId === "") {
    req.body.data.id = paramId;
    return next();
  }

  if(bodyId != paramId) return next({
    status: 400,
    message: `Dish id does not match route id. Dish: ${bodyId}, Route: ${paramId}`
  })
  return next();
}

//Body data validation
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) return next();
    next({
      status: 400,
      message: `Dish must include a ${propertyName}`,
    });
  };
}

function textPropertyIsValid(propertyName) {
  return function (req, res, next) {
    if (req.body.data[propertyName] !== "") return next();
    next({
      status: 400,
      message: `Dish must include a ${propertyName}`,
    });
  };
}

function pricePropertyIsValid(req, res, next) {
    const { price } = req.body.data;
    if(typeof price !== "number") return next({
      status: 400,
      message: `price`
    })
  
    if (price > 0) {
      return next();
    }
    return next({
      status: 400,
      message: `Dish must have a price that is an integer greater than 0`,
    });
 };


module.exports = {
  create: [
    bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("price"),
    bodyDataHas("image_url"),
    textPropertyIsValid("name"),
    textPropertyIsValid("description"),
    textPropertyIsValid("image_url"),
    pricePropertyIsValid,
    create,
  ],
  read: [dishIdExists, read],
  list,
  update: [
    dishIdExists, 
    dishIdsMatch,
    bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("price"),
    bodyDataHas("image_url"),
    textPropertyIsValid("name"),
    textPropertyIsValid("description"),
    textPropertyIsValid("image_url"),
    pricePropertyIsValid,
    update
  ],
};