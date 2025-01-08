using Microsoft.EntityFrameworkCore;

namespace CRMSystem.Data
{
    public class CRMContext : DbContext
    {
        // Constructor to pass options to base class
        public CRMContext(DbContextOptions<CRMContext> options) : base(options) { }

        // DbSet for Customer 
        public DbSet<Customer> Customers { get; set; }

        // Override OnModelCreating to seed data
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed some customers if no data exists
            modelBuilder.Entity<Customer>().HasData(
                new Customer { Id = 1, Name = "John Doe", Email = "john.doe@example.com", PhoneNumber = "123-456-7890" },
                new Customer { Id = 2, Name = "Jane Smith", Email = "jane.smith@example.com", PhoneNumber = "987-654-3210" }
            );
        }
    }

    // Entity for Customer
    public class Customer
    {
        public int Id { get; set; }        // Primary key for the customer
        public string Name { get; set; }   // Customer's name
        public string Email { get; set; }  // Customer's email address
        public string PhoneNumber { get; set; } // Customer's phone number
    }
}
