using CRMSystem.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CRMSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly CRMContext _context;
        private readonly ILogger<CustomerController> _logger;

        public CustomerController(CRMContext context, ILogger<CustomerController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            try
            {
                _logger.LogInformation("Getting all customers");
                var customers = await _context.Customers.ToListAsync();
                return Ok(customers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting customers");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            _logger.LogInformation($"Getting customer with id: {id}");
            var customer = await _context.Customers.FindAsync(id);
            
            if (customer == null)
            {
                _logger.LogWarning($"Customer with id: {id} not found");
                return NotFound($"Customer with ID {id} not found");
            }
            
            return Ok(customer);
        }

        [HttpPost]
        public async Task<ActionResult<Customer>> CreateCustomer([FromBody] Customer customer)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                _logger.LogInformation("Creating new customer");
                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customer);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating customer");
                return StatusCode(500, "Error creating customer");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, [FromBody] Customer customer)
        {
            try
            {
                if (id != customer.Id)
                {
                    return BadRequest("ID mismatch");
                }

                _logger.LogInformation($"Updating customer with id: {id}");
                var existingCustomer = await _context.Customers.FindAsync(id);
                
                if (existingCustomer == null)
                {
                    _logger.LogWarning($"Customer with id: {id} not found for update");
                    return NotFound($"Customer with ID {id} not found");
                }

                existingCustomer.Name = customer.Name;
                existingCustomer.Email = customer.Email;
                existingCustomer.PhoneNumber = customer.PhoneNumber;

                await _context.SaveChangesAsync();
                return Ok(existingCustomer);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating customer with id: {id}");
                return StatusCode(500, "Error updating customer");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            try
            {
                _logger.LogInformation($"Deleting customer with id: {id}");
                var customer = await _context.Customers.FindAsync(id);
                
                if (customer == null)
                {
                    _logger.LogWarning($"Customer with id: {id} not found for deletion");
                    return NotFound($"Customer with ID {id} not found");
                }

                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();

                return Ok(new { message = $"Customer with ID {id} deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting customer with id: {id}");
                return StatusCode(500, "Error deleting customer");
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Customer>>> SearchCustomers(
            [FromQuery] string? searchTerm,
            [FromQuery] string? sortBy,
            [FromQuery] string? sortDirection)
        {
            try
            {
                var query = _context.Customers.AsQueryable();

                // Apply search
                if (!string.IsNullOrWhiteSpace(searchTerm))
                {
                    searchTerm = searchTerm.ToLower();
                    query = query.Where(c => 
                        c.Name.ToLower().Contains(searchTerm) ||
                        c.Email.ToLower().Contains(searchTerm) ||
                        c.PhoneNumber.Contains(searchTerm));
                }

                // Apply sorting
                if (!string.IsNullOrWhiteSpace(sortBy))
                {
                    query = sortBy.ToLower() switch
                    {
                        "name" => sortDirection == "desc" 
                            ? query.OrderByDescending(c => c.Name)
                            : query.OrderBy(c => c.Name),
                        "email" => sortDirection == "desc"
                            ? query.OrderByDescending(c => c.Email)
                            : query.OrderBy(c => c.Email),
                        "phone" => sortDirection == "desc"
                            ? query.OrderByDescending(c => c.PhoneNumber)
                            : query.OrderBy(c => c.PhoneNumber),
                        _ => query.OrderBy(c => c.Id)
                    };
                }

                var customers = await query.ToListAsync();
                return Ok(customers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching customers");
                return StatusCode(500, "Internal server error");
            }
        }

        private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.Id == id);
        }
    }
}