const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

//validation middleware
// const checkForAbbreviationLength = (req, res, next) => {
//     const abbreviation = req.params.abbreviation;
//     if (abbreviation.length !== 2) {
//       next("State abbreviation is invalid.");
//     } else {
//       next();
//     }
//   };

function bodyDataHas() {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName] && data[`${index}`] > 0) {
      return next();
    }
    if (data["quantity"] < 1) {
      next({
        status: 400,
        message: `Dish ${index} must have a quantity that is an integer greater than 0`,
      });
    }
    next({ status: 400, message: `Dish must include a ${propertyName}` });
  };
}

function orderExists(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  }
  next({
    status: 404,
    message: `Order does not exist: ${orderId}`,
  });
}

function bodyIdMatchesRouteId() {}

function bodyHasStatus() {
  //`Order must have a status of pending, preparing, out-for-delivery, delivered`
  const status = res.locals.order;
  if (
    order.status !==
    ("pending" || "preparing" || "out-for-delivery" || "delivered")
  ) {
    next();
  }
  return next({
    status: 400,
    message: `Order must have a status of pending, preparing, out-for-delivery, delivered`,
  });
}

function cannotUpdate(req, res, next) {
  const deliveredOrder = res.locals.order;
  if (order.status === "delivered") {
    return next({
      status: 400,
      message: `A delivered order cannot be changed`,
    });
  }
  next();
}

function isPendingStatus(req, res, next) {
  //an order cannot be deleted unless status === pending
}

//CREATE READ UPDATE DELETE LIST functions

function create() {
  //use nextId()
}

function read() {
  res.json({ data: res.locals.order });
}

function update() {}

function destroy(req, res) {}

function list(req, res) {
  res.json({ data: orders });
}

module.exports = {
  list,
  create: [
    create,
    bodyDataHas("deliverTo"),
    bodyDataHas("mobileNumber"),
    bodyDataHas("dishes"),
    bodyDataHas("quantity"),
  ],
  read: [read, orderExists],
  update: [
    update,
    bodyDataHas("deliverTo"),
    bodyDataHas("mobileNumber"),
    bodyDataHas("dishes"),
    bodyDataHas("quantity"),
    bodyIdMatchesRouteId,
    bodyHasStatus,
    cannotUpdate,
  ],
  delete: [destroy, orderExists, isPendingStatus],
};
