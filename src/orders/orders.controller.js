const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

//validation middleware

function bodyHasDeliverTo() {

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

}

function update() {

}

function delete() {

}

function list() {

}

module.exports = {
    list,
    create: [],
    read: [],
    update: [],
    delete: [],
}