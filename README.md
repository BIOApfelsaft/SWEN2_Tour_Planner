# Tour Planner

## Short description
A web application for creating, managing and tracking tours and tour logs (bike, hike, run, or vacation). Backend: ASP.NET Core (C#). Frontend: Angular (Standalone Components, MVVM). Database: PostgreSQL (Entity Framework Core). Maps: Leaflet. Route/distance/time: OpenRouteService API. Images stored on filesystem; database stores image paths.

---

## Tech Stack

**Frontend:**
* [Angular](https://angular.io/) (Standalone Components, MVVM Architecture)
* [Leaflet](https://leafletjs.com/) (Interactive Maps)
* [Tailwind CSS v4](https://tailwindcss.com/) (Styling)

**Backend:**
* [ASP.NET Core (C#)](https://dotnet.microsoft.com/apps/aspnet) (REST API)
* [OpenRouteService API](https://openrouteservice.org/) (Route & Distance Calculation)

**Database & Storage:**
* [PostgreSQL](https://www.postgresql.org/) (Hosted via Docker)
* Local Filesystem (For uploading and serving tour images; file paths are stored in the DB)

---

## Setup & Installation

### 1. Prerequisites
Before you can run the project locally, ensure you have the following software installed:

1. **[Node.js & npm](https://nodejs.org/)**: (v22.14) Required for the Angular frontend.
2. **[.NET SDK](https://dotnet.microsoft.com/download)**: (.NET 10.0) Required for the C# backend.
3. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)**: Required to quickly spin up the PostgreSQL database via Docker Compose.
4. **Angular CLI**: Install the Angular command-line tools globally via npm:
```bash
npm install -g @angular/cli
```

### 2. Clone the Repository
```bash
git clone https://github.com/BIOApfelsaft/SWEN2_Tour_Planner.git
cd TourPlanner
```

### 3. Configuration (API Keys & Secrets)
Create or update .env in the root (.) folder. 
Create or update the pgpass inside the ./database folder. 
Create or update the servers.json inside the ./database folder. 
Create or update the appsettings.Development.json inside the ./backend/TourPlannerAPI folder. 
(Note: These files are excluded via .gitignore for security reasons).

### 4. Database Setup
```bash
docker-compose up -d
```

### 5. Backend Setup and Start
```bash
cd backend/TourPlannerAPI
dotnet run
```
The Swagger API documentation will be available at http://localhost:5134/swagger.

### 6. Frontend Setup and Start (Second terminal)
```bash
cd frontend
npm install
ng serve
```

---

## Project Structure
```
TourPlanner/
├── backend/                  # ASP.NET Core Web API
│   ├── TourPlannerAPI/       # Main project (Controllers, Services, Models)
├── frontend/                 # Angular Application
│   ├── src/
│   │   ├── app/              # Standalone Components & MVVM ViewModels
├── docker-compose.yml        # PostgreSQL database configuration
└── README.md
```