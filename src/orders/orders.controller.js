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

function bodyHasDeliverTo(req, res, next) {
    const deliverTo = req.params.deliverTo
    if (!deliverTo) {
        next({
            status: 400,
            message: "Order must include a deliverTo"
        })
    }   else {
        next()
        }
}

function bodyHasMobileNumber() {

}

function bodyHasDishesProperty() {

}

function bodyHasDishQuantity() {

}

function orderExists() {

}

function bodyIdMatchesRouteId() {

}

function bodyHasStatus() {

}

function cannotUpdate() {

}

function isPendingStatus() {

}

//CREATE READ UPDATE DELETE LIST functions

function create() {

}

function read() {
    res.json({ data: res.locals.order });
}

function update() {

}

function destroy(req, res) {

}

function list(req, res) {
    res.json({ data: dishes });
}

module.exports = {
    list,
    create: [],
    read: [],
    update: [],
    delete: [destroy],
}