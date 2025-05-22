"use strict";
const productController = require("./product-controller");

module.exports.main = async (event) => {
  const { httpMethod, path, pathParameters } = event;

  // Extract path segments
  const segments = path.split("/").filter(Boolean); // removes empty strings
  const [resource, id] = segments;

  console.log("Segments:", segments, "Method:", httpMethod);

  // Check if the first segment is 'products'
  if (resource !== "products") {
    return { statusCode: 404, body: JSON.stringify({ error: "Not found" }) };
  }

  switch (httpMethod) {
    case "POST":
      return productController.createProduct(event);

    case "GET":
      return id
        ? productController.getProduct({ ...event, pathParameters: { Id: id } })
        : productController.listProducts();

    case "PUT":
      return productController.updateProduct({ ...event, pathParameters: { Id: id } });

    case "DELETE":
      return productController.deleteProduct({ ...event, pathParameters: { Id: id } });

    default:
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid request" }) };
  }
};
