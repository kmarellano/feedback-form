# 🍽️ Brighte Eats

## Overview

A simple API for collecting and viewing expressions of interest for Brighte Eats.

## ✨ Features

- Register `Lead` interest with basic details
- View all submitted `Leads` or a specific one
- Filter and sort `Leads` by various parameters
- Paginate through `Leads` results

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) v18 or higher
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)

## 🚀 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/brighte-eats.git
   cd brighte-eats
   ```

2. Install dependencies: (Optional: run this only when running project directly with Node)

   ```bash
   npm ci
   ```

3. Set up environment variables:

   Create two environment files from the provided template:

   ```bash

   # Create development environment file
   cp .envcopy .env.development

   # Create test environment file
   cp .envcopy .env.test
   ```

## ⚙️ Environment Setup

The project uses different database connections depending on how you run it:

### Development Environment (.env.development)

When running with Docker Compose, use:

```bash
PORT=4000
NODE_ENV=development
DATABASE_URL="postgresql://admin:admin@postgres:5432/brighte?schema=public"
```

When running locally with Node, use:

```bash
PORT=4000
NODE_ENV=development
DATABASE_URL="postgresql://admin:admin@localhost:5432/brighte?schema=public"
```

### Test Environment (.env.test)

For running integration tests:

```bash
PORT=4000
NODE_ENV=test
DATABASE_URL="postgresql://test:test@localhost:5433/brighte?schema=public"
```

## 🏃‍♂️ Running the Application

### Using Docker Compose (Recommended)

This is the recommended way to run the application as it sets up all required services:

```bash
npm run docker:up
```

The API will be available at http://localhost:4000.

## ⚠️ Common Issue: Database Connection Error

If you see an error like: `Can't reach database server`

**Follow these steps**:

1. Ensure your `DATABASE_URL` is correctly set in the `.env.development` file.
2. Restart your Docker containers to reload the environment:

```bash
npm run docker:down
npm run docker:up
```

### Using Node.js (Local Development)

If you prefer to run the application directly with Node:

1. Make sure you have a PostgreSQL instance running locally, please follow instruction on `docker-compose.yml`.
2. Update the DATABASE_URL in your `.env.development file`
3. Start PostgreSQL instance and Start the application:

```bash
npm run docker:up
npm run dev
```

## 🧪 Running Tests

To run tests:

1. Ensure you have created the `.env.test` file as described in the Environment Setup section.
2. Run the tests:

```bash
npm run test
```

## 🔍 GraphQL API Tools

To interact with the GraphQL API, we recommend using one of these tools:

- [Altair GraphQL Client](https://altairgraphql.dev/docs/)
- [Apollo Studio Sandbox](https://studio.apollographql.com/sandbox/explorer)

Simply open either tool and enter your GraphQL endpoint URL (http://localhost:4000/graphql) to get started.

## 📚 API Reference

### Enums

#### ServiceType

| Value    | Description      |
| -------- | ---------------- |
| DELIVERY | Delivery service |
| PAYMENT  | Payment service  |
| PICKUP   | Pickup service   |

#### OrderBy

| Value | Description      |
| ----- | ---------------- |
| ASC   | Ascending order  |
| DESC  | Descending order |

### Types

#### Lead

| Field              | Type           | Description            |
| :----------------- | :------------- | :--------------------- |
| `id`               | `ID!`          | Unique lead identifier |
| `name`             | `String!`      | Lead's name            |
| `email`            | `String!`      | Lead's email address   |
| `mobile`           | `String!`      | Lead's mobile number   |
| `postcode`         | `String!`      | Lead's postcode        |
| `preferredService` | `ServiceType!` | Preferred service type |
| `createdAt`        | `String!`      | Creation timestamp     |
| `updatedAt`        | `String!`      | Last update timestamp  |

### Inputs

#### PaginationParams

| Field      | Type      | Description               |
| :--------- | :-------- | :------------------------ |
| `paginate` | `Boolean` | Enable/disable pagination |
| `page`     | `Int`     | Page number               |
| `limit`    | `Int`     | Number of items per page  |

#### LeadsParams

| Field              | Type          | Description             |
| :----------------- | :------------ | :---------------------- |
| `name`             | `String`      | Filter by name          |
| `postcode`         | `String`      | Filter by postcode      |
| `preferredService` | `ServiceType` | Filter by service type  |
| `createdAt`        | `String`      | Filter by creation date |

#### LeadsOrderParams

| Field              | Type      | Description            |
| :----------------- | :-------- | :--------------------- |
| `name`             | `OrderBy` | Order by name          |
| `postcode`         | `OrderBy` | Order by postcode      |
| `preferredService` | `OrderBy` | Order by service type  |
| `createdAt`        | `OrderBy` | Order by creation date |

#### RegisterInput

| Field              | Type           | Description            |
| :----------------- | :------------- | :--------------------- |
| `name`             | `String`       | Name of the lead       |
| `email`            | `String!`      | Email address          |
| `mobile`           | `String!`      | Mobile number          |
| `postcode`         | `String!`      | Postcode               |
| `preferredService` | `ServiceType!` | Preferred service type |

---

## Queries

### Get All Leads

```graphql
query GetLeads(
  $filterBy: LeadsParams
  $pagination: PaginationParams
  $orderBy: LeadsOrderParams
) {
  leads(filterBy: $filterBy, pagination: $pagination, orderBy: $orderBy) {
    id
    name
    email
    mobile
    postcode
    preferredService
    createdAt
    updatedAt
  }
}
```

---

### Get Single Lead

```graphql
query GetLead($id: ID, $email: String, $mobile: String) {
  lead(id: $id, email: $email, mobile: $mobile) {
    id
    name
    email
    mobile
    postcode
    preferredService
    createdAt
    updatedAt
  }
}
```

---

## Mutations

### Register Lead

```graphql
mutation RegisterLead($input: RegisterInput!) {
  register(input: $input) {
    id
    name
    email
    mobile
    postcode
    preferredService
    createdAt
    updatedAt
  }
}
```

---
