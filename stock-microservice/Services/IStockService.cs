using StockApi.Models;

namespace StockApi.Services
{
    public interface IStockService
    {
        Task<Stock> CreateStockAsync(Stock stock);
        Task<Stock> GetStockAsync(string id);
        Task<IEnumerable<Stock>> ListStocksAsync();
        Task<Stock> UpdateStockAsync(string id, Stock stock);
        Task<bool> DeleteStockAsync(string id);
    }
}
