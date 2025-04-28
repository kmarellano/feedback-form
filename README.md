# Brighte Eats

## Overview

A simple API for collecting and viewing expressions of interest for Brighte Eats.

## Features

- Register user interest with basic details.
- View all submitted leads or a specific one.

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

## API Reference

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

---

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

---

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

### Get all leads

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

### Get single lead

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
