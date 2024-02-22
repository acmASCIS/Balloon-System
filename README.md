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

## Usage

Once both the server and client are running, open the client in your browser and follow the interface to manage balloon deliveries for a contest.
