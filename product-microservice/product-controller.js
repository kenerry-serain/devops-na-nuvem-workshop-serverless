const { dynamoDB, TABLE_NAME } = require("./dynamo");
const { v4: uuidv4 } = require("uuid");

module.exports.createProduct = async (event) => {
  const { Name, Price, Description } = JSON.parse(event.body);
  const product = {
    Id: uuidv4(),
    Name,
    Price,
    Description,
  };
  await dynamoDB.put({ TableName: TABLE_NAME, Item: product }).promise();
  return { statusCode: 201, body: JSON.stringify(product) };
};

module.exports.getProduct = async (event) => {
  const { Id } = event.pathParameters;
  const result = await dynamoDB.get({ TableName: TABLE_NAME, Key: { Id } }).promise();
  return result.Item
    ? { statusCode: 200, body: JSON.stringify(result.Item) }
    : { statusCode: 404, body: JSON.stringify({ error: "Product not found" }) };
};

module.exports.updateProduct = async (event) => {
  const { Id } = event.pathParameters;
  const { Name, Price, Description } = JSON.parse(event.body);
  await dynamoDB.update({
    TableName: TABLE_NAME,
    Key: { Id },
    UpdateExpression: "set #N = :n, Price = :p, Description = :d",
    ExpressionAttributeNames: {
      "#N": "Name"
    },
    ExpressionAttributeValues: {
      ":n": Name,
      ":p": Price,
      ":d": Description,
    },
  }).promise();
  return { statusCode: 200, body: JSON.stringify({ Id, Name, Price, Description }) };
};

module.exports.deleteProduct = async (event) => {
  const { Id } = event.pathParameters;
  await dynamoDB.delete({ TableName: TABLE_NAME, Key: { Id } }).promise();
  return { statusCode: 200, body: JSON.stringify({ message: "Product deleted" }) };
};

module.exports.listProducts = async () => {
  const result = await dynamoDB.scan({ TableName: TABLE_NAME }).promise();
  return { statusCode: 200, body: JSON.stringify(result.Items) };
};
