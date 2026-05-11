# Visitor Management System - Login Portal

Comprehensive authentication system for the Visitor Management Platform.

## Project Structure

- **frontend/** - React + TypeScript + Tailwind CSS application
- **backend/** - ASP.NET Core Web API with Entity Framework Core

## Quick Start

### Prerequisites
- Node.js 18+
- .NET 8 SDK
- PostgreSQL 12+

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
export ASPNETCORE_ENVIRONMENT=Development
export DB_NAME=Vister_Page
export DB_USERNAME=postgres
export DB_PASSWORD=Database@123
dotnet run --urls http://localhost:8000
```

## Documentation

See [IMPLEMENTATION.md](./IMPLEMENTATION.md) for detailed implementation notes.
