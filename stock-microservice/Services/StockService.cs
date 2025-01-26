using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using StockApi.Models;

namespace StockApi.Services
{
    public class StockService : IStockService
    {
        private readonly DynamoDBContext _context;
        private readonly string _tableName;
        private readonly DynamoDBOperationConfig _config;
        public StockService(IAmazonDynamoDB dynamoDb)
        {
            _context = new DynamoDBContext(dynamoDb);
            _tableName = Environment.GetEnvironmentVariable("DYNAMO_TABLE_NAME") ?? "StocksTable";
            _config = new DynamoDBOperationConfig { OverrideTableName = _tableName };
        }

        public async Task<Stock> CreateStockAsync(Stock stock)
        {
            stock.Id = Guid.NewGuid().ToString();

            await _context.SaveAsync(stock, _config);
            return stock;
        }

        public async Task<Stock> GetStockAsync(string id)
        {
            return await _context.LoadAsync<Stock>(id, _config);
        }

        public async Task<IEnumerable<Stock>> ListStocksAsync()
        {
            var conditions = new List<ScanCondition>();
            return await _context.ScanAsync<Stock>(conditions, _config).GetRemainingAsync();
        }

        public async Task<Stock> UpdateStockAsync(string id, Stock stock)
        {
            var existingStock = await _context.LoadAsync<Stock>(id,_config);
            if (existingStock == null) return null;

            existingStock.ProductId = stock.ProductId;
            existingStock.Quantity= stock.Quantity;

            await _context.SaveAsync(existingStock,_config);
            return existingStock;
        }

        public async Task<bool> DeleteStockAsync(string id)
        {
            var stock = await _context.LoadAsync<Stock>(id,_config);
            if (stock == null) return false;

            await _context.DeleteAsync(stock,_config);
            return true;
        }
    }
}
