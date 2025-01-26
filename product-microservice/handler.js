"use strict";
const productController = require("./product-controller");

function normalizePath(event, basePath) {
  if (event.path.startsWith(basePath)) {
    event.path = event.path.replace(basePath, '') || '/';
  }
  return event;
}

module.exports.main = async (event) => {
  const BASE_PATH = "/products"; // Defina o Base Path esperado
  event = normalizePath(event, BASE_PATH);

  const { httpMethod, path, pathParameters } = event;
  const Id = pathParameters?.Id || pathParameters?.proxy;

  console.log("ID", Id, "Path", path);

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
