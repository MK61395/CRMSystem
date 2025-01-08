# CRM System

A modern Customer Relationship Management system built with ASP.NET Core and Angular. Features a responsive design, dark/light mode, and complete CRUD operations.

## Tech Stack

- **Backend**: ASP.NET Core 6.0
- **Frontend**: Angular 14
- **Database**: MySQL
- **ORM**: Entity Framework Core
- **Styling**: Bootstrap 5 + Custom CSS

## Features

- Full CRUD operations for customer management
- Real-time search and sorting
- Responsive design that works on mobile, tablet, and desktop
- Dark/light mode toggle
- Export to Excel functionality
- Clean and modern UI with Bootstrap
- Form validation
- Error handling
- Loading states
- Statistics dashboard

## Project Structure

### Backend

- **Controllers**: RESTful API endpoints in `CustomerController.cs` handling CRUD operations
- **Data**: Entity Framework DbContext and model definitions
- **MySQL**: Database storing customer information
- **Error Handling**: Global exception handling and logging
- **Entity Framework**: Code-first approach with migrations

### Frontend

- **Components**: Angular components for customer management
- **Services**: TypeScript services handling HTTP requests
- **Models**: Strong typing with TypeScript interfaces
- **Forms**: Reactive forms with validation
- **Responsive Design**: Mobile-first approach using Bootstrap grid
- **Dark Mode**: CSS variables and dynamic theme switching

## Getting Started

1. Clone the repository
2. Update the connection string in `appsettings.json`
3. Run database migrations:
   ```
   dotnet ef database update
   ```
4. Install frontend dependencies:
   ```
   cd ClientApp
   npm install
   ```
5. Run the application:
   ```
   dotnet run
   ```

## Features in Detail

- **Customer Management**: Create, read, update, and delete customer records
- **Search**: Real-time search across all customer fields
- **Sorting**: Sort by name, email, or phone number
- **Export**: Export customer list to Excel
- **Responsive**: Works on all screen sizes
- **Theme**: Toggle between dark and light modes
- **Statistics**: Basic customer metrics dashboard

## Development Approach

Built using a modern development stack with separation of concerns:

- Backend API with ASP.NET Core
- Frontend SPA with Angular
- Entity Framework Core for ORM
- MySQL for data persistence
- Bootstrap for responsive design
- Font Awesome for icons

## Future Improvements

- JWT Authentication
- DIfferent user modules
