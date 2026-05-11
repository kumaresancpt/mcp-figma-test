# SCRUM-15: Visitor Login Page Implementation

## Overview

Full-stack implementation of a visitor login page with role selection (Admin, Receptionist, Security Guard) using React 18 + TypeScript frontend and ASP.NET Core backend with PostgreSQL database.

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev  # http://localhost:5173
```

### Backend
```bash
cd backend
dotnet restore
$env:DB_NAME='Vister_Page'
$env:DB_USERNAME='postgres'
$env:DB_PASSWORD='Database@123'
$env:ASPNETCORE_ENVIRONMENT='Development'
dotnet run --urls http://localhost:8000
```

## Demo Credentials

- **Username:** admin
- **Password:** Admin@123
- **Role:** Admin (select in role tabs)

## Status

✅ Implementation Complete  
✅ All 20 Acceptance Criteria Covered  
✅ Frontend + Backend Running  
✅ Database Initialized  
✅ Ready for Production Deployment

## Documentation

See `output/changelog.md` for detailed implementation report.