# Expense Tracker Dashboard

A small full-stack Proof of Concept demonstrating a React frontend connected to a Java Spring Boot REST API backed by PostgreSQL.

## Architecture

```
React + Vite
     |
     | HTTP / JSON
     v
Spring Boot REST API
     |
     | Spring Data JPA
     v
PostgreSQL
```

## Features

- Dashboard summary for balance, income, and expenses
- Load transactions from the backend
- Add income or expense transactions through REST API
- Transaction history
- Filter transactions by type
- Form validation and API error handling
- Responsive layout
- Reusable React components
- PostgreSQL persistence

## Frontend

Tech stack:

- React 19
- Vite
- JavaScript
- CSS
- Fetch API

Run:

```bash
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

## Backend

Tech stack:

- Java 21
- Spring Boot 3.5
- Spring Web
- Spring Data JPA
- Bean Validation
- PostgreSQL
- Maven

Backend structure:

```
backend/
└── src/main/java/com/expensetracker/
    ├── config/
    ├── common/
    └── transaction/
        ├── TransactionController
        ├── TransactionService
        ├── TransactionRepository
        ├── Transaction
        └── dto/
```

### Start PostgreSQL

From the project root:

```bash
docker compose -f docker-compose.backend.yml up -d
```

This creates:

- Database: `expense_tracker`
- User: `postgres`
- Password: `postgres`
- Port: `5433`

### Start Spring Boot

From the `backend` directory:

```bash
mvn spring-boot:run
```

Backend runs on:

```
http://localhost:8080
```

## REST API

### Get transactions

```
GET /api/v1/transactions
```

### Get summary

```
GET /api/v1/transactions/summary
```

### Create transaction

```
POST /api/v1/transactions
Content-Type: application/json

{
  "description": "Grocery shopping",
  "category": "Food",
  "amount": 2500,
  "type": "EXPENSE",
  "date": "2026-09-21"
}
```

### Delete transaction

```
DELETE /api/v1/transactions/{id}
```

## React concepts demonstrated

- Functional components
- Props
- `useState`
- `useEffect`
- Controlled forms
- Event handling
- List rendering with `map()` and `key`
- Conditional rendering
- Parent-child communication through callback props
- Derived values with `useMemo`
- REST API integration
- Loading and error states

## Backend concepts demonstrated

- REST controllers
- DTOs
- Service layer
- Repository layer
- JPA entity mapping
- PostgreSQL persistence
- Bean Validation
- Global exception handling
- CORS configuration
- Seed data
- Transaction boundaries with `@Transactional`

## Local startup order

1. Start PostgreSQL.
2. Start the Spring Boot backend on port 8080.
3. Start the React frontend on port 5173.
4. Open `http://localhost:5173`.

