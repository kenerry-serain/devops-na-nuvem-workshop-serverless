const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = {
  dynamoDB,
  TABLE_NAME: process.env.DYNAMO_TABLE_NAME ||"ProductsTable",
};