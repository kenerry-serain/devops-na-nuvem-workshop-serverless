"use strict";
const productController = require("./product-controller");

module.exports.main = async (event) => {
  const { httpMethod, pathParameters } = event;
  const Id = pathParameters?.Id || pathParameters?.proxy;
  console.log('ID',Id)
  switch (httpMethod) {
    case "POST":
      return productController.createProduct(event);
    case "GET":
      return Id ? productController.getProduct({ ...event, pathParameters: { Id } }) : productController.listProducts();
    case "PUT":
      return productController.updateProduct({ ...event, pathParameters: { Id } });
    case "DELETE":
      return productController.deleteProduct({ ...event, pathParameters: { Id } });
    default:
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid request" }) };
  }
};