# 💸 Bank API – CAMT.053 Parser & Account Service

A RESTful API built with Node.js and TypeScript that reads a `camt.053` bank statement XML file, parses relevant account and transaction data into memory and exposes it through HTTP endpoints.

---

## 🚀 Features

- Parse and store `camt.053` XML bank data in-memory
- List all bank accounts
- Get details of a specific account
- List transactions per account
- Secure endpoints with JWT-based authentication

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** ≥ 18.x
- **npm** or **yarn**
- `openssl` or Node.js for generating a JWT secret
- A valid `camt.053.xml` file to parse

---

## 📦 Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/bank-api.git
   cd bank-api

## Generate JWT_SECRET using OpenSSL :

openssl rand -hex 64
