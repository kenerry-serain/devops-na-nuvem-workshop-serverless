using Microsoft.AspNetCore.Mvc;
using StockApi.Models;
using StockApi.Services;

namespace StockApi.Controllers
{
    [Route("")]
    [ApiController]
    public class StockController : ControllerBase
    {
        private readonly IStockService _stockService;

        public StockController(IStockService stockService)
        {
            _stockService = stockService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateStock([FromBody] Stock stock)
        {
            var createdStock = await _stockService.CreateStockAsync(stock);
            return CreatedAtAction(nameof(GetStock), new { id = createdStock.Id }, createdStock);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStock(string id)
        {
            var stock = await _stockService.GetStockAsync(id);
            if (stock == null) return NotFound();

            return Ok(stock);
        }

        [HttpGet]
        public async Task<IEnumerable<Stock>> ListStocks()
        {
            return await _stockService.ListStocksAsync();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStock(string id, [FromBody] Stock stock)
        {
            var updatedStock = await _stockService.UpdateStockAsync(id, stock);
            if (updatedStock == null) return NotFound();

            return Ok(updatedStock);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStock(string id)
        {
            var deleted = await _stockService.DeleteStockAsync(id);
            if (!deleted) return NotFound();

            return NoContent();
        }
    }
}
