# Balloon Contest Utility

A utility for managing balloon delivery in Codeforces contests using the Codeforces API.

## Features

- Fetches delivered submissions from Codeforces API.
- Facilitates balloon delivery tracking for contests.

## Prerequisites

- Node.js (latest LTS recommended)
- npm or yarn

## Installation and Setup

### 1. Clone the Repository

```sh
git clone https://github.com/MohanadKh03/balloon-contest.git
cd balloon-contest
```

### 2. Configure Environment Variables

- Navigate to the `server` directory:
  ```sh
  cd server
  ```
- Copy the example environment file and create your own `.env` file:
  ```sh
  cp .env.example .env
  ```
- Open `.env` and configure it with the necessary credentials and API keys.
  - CODEFORCES_KEY and CODEFORCES_SECRET: your codeforces account credentials (must use the contest manager's credentials for private contests/mashups)
  - MONGO_URI

### 3. Install Server Dependencies

```sh
npm install
```

### 4. Start the Server

```sh
npm run start
```

### 5. Install Client Dependencies

- Navigate to the `client` directory:
  ```sh
  cd ../client
  ```
- Install dependencies:
  ```sh
  npm install
  ```

### 6. Start the Client

```sh
npm run dev
```

## File Structure

```
/
├── client/   # Frontend application
├── server/   # Backend server
├── README.md # Project documentation
```

### Server Files

- `server/src/contestants-importer.ts`: A utility script for importing contestant data from an Excel file into the MongoDB database. It reads contestant information such as Codeforces handles, seat positions, and locations from a spreadsheet (default: `lvl1.xlsx`), processes the data, and inserts it into the database after clearing any existing contestant records.

  **How to use:**
  1. Ensure the Excel file (e.g., `lvl1.xlsx`) is in the `server` directory with columns for "Codeforces Handle", "Bench (down to up)", "Position (right to left)", and "Hall".
  2. Set up the `.env` file with `MONGO_URI`.
  3. Run the script: `npx ts-node src/contestants-importer.ts` (from the server directory).


Once both the server and client are running, open the client in your browser and follow the interface to manage balloon deliveries for a contest.
