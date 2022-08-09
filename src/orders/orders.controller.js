const path = require("path");
// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));
// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// CRUD functions
function read(req, res, next) {
  res.json({ data: res.locals.order });
}

function list(req, res, next) {
  res.json({ data: orders });
}

function create(req, res, next) {
  const { deliverTo, mobileNumber, status, dishes } = req.body.data;
  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

function update(req, res, next) {
  const oldOrderData = res.locals.order;
  const newOrderData = req.body.data;
  res.status(200).json({ data: { ...oldOrderData, ...newOrderData } });
}

function destroy(req, res, next) {
  const { orderId } = req.params;
  const index = orders.findIndex((order) => order.id === Number(orderId));
  const deletedOrders = orders.splice(index, 1);
  res.sendStatus(204);
}

// MIDDLEWARE
function orderIdExists(req, res, next) {
  const { orderId } = req.params;
  const order = orders.find((order) => order.id === orderId);
  if (order) {
    res.locals.order = order;
    return next();
  }
  next({
    status: 404,
    message: `Order does not exist: ${orderId}`,
  });
}

function orderIdsMatch(req, res, next) {
  const bodyId = req.body.data.id;
  const paramId = req.params.orderId;

  if (bodyId === null || !bodyId || bodyId === "") {
    req.body.data.id = paramId;
    return next();
  }

  if (bodyId != paramId)
    return next({
      status: 400,
      message: `Order id does not match route id. Order: ${bodyId}, Route: ${paramId}.`,
    });
  return next();
}

function orderIsPending(req, res, next) {
  const { status } = res.locals.order;
  if (status !== "pending")
    return next({
      status: 400,
      message: `An order cannot be deleted unless it is pending`,
    });
  next();
}

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) return next();
    next({
      status: 400,
      message: `Order must include a ${propertyName}`,
    });
  };
}

function textPropertyIsValid(propertyName) {
  return function (req, res, next) {
    if (req.body.data[propertyName] !== "") return next();
    next({
      status: 400,
      message: `Order must include a ${propertyName}`,
    });
  };
}

function dishesPropertyIsValid(req, res, next) {
  const { dishes } = req.body.data;
  if (!Array.isArray(dishes) || dishes.length === 0) {
    return next({
      status: 400,
      message: `Order must include at least one dish`,
    });
  }
  next();
}

function quantityPropertyIsValid(req, res, next) {
  const { dishes } = req.body.data;
  for (let i in dishes) {
    const quantity = dishes[i].quantity;
    if (
      !quantity ||
      quantity === null ||
      !Number.isInteger(quantity) ||
      quantity < 1
    )
      return next({
        status: 400,
        message: `Dish ${i} must have a quantity that is an integer greater than 0`,
      });
  }
  next();
}

function statusPropertyIsValid(req, res, next) {
  const { status } = req.body.data;
  if (
    !status ||
    status === null ||
    (status !== "pending" && status !== "delivered")
  )
    return next({
      status: 400,
      message: `status`,
    });
  next();
}

module.exports = {
  create: [
    bodyDataHas("deliverTo"),
    bodyDataHas("mobileNumber"),
    bodyDataHas("dishes"),
    textPropertyIsValid("deliverTo"),
    textPropertyIsValid("mobileNumber"),
    dishesPropertyIsValid,
    quantityPropertyIsValid,
    create,
  ],
  list,
  read: [orderIdExists, read],
  update: [
    orderIdExists,
    orderIdsMatch,
    bodyDataHas("deliverTo"),
    bodyDataHas("mobileNumber"),
    bodyDataHas("dishes"),
    textPropertyIsValid("deliverTo"),
    textPropertyIsValid("mobileNumber"),
    dishesPropertyIsValid,
    quantityPropertyIsValid,
    statusPropertyIsValid,
    update,
  ],
  delete: [orderIdExists, orderIsPending, destroy],
};
