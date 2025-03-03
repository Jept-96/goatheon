# NFT Gallery Backend Server

This is the backend server for the NFT Gallery application. It provides real-time synchronization of NFT claim status across all users.

## Features

- RESTful API for NFT data
- Real-time updates using Socket.io
- MongoDB database for persistent storage
- Market data API integration

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (v4.4 or higher)

## Installation

1. Make sure MongoDB is installed and in your PATH
2. Run the `start-backend.bat` script to start MongoDB and the server
3. Alternatively, follow these manual steps:

```bash
# Start MongoDB
mongod --dbpath=./data/db

# In a new terminal, import NFT data
node import-data.js

# Start the server
node server.js
```

## API Endpoints

### NFTs

- `GET /api/nfts` - Get all NFTs with pagination
- `GET /api/nfts/:id` - Get specific NFT details
- `POST /api/nfts/:id/claim` - Claim an NFT with contract address

### Stats

- `GET /api/stats` - Get gallery statistics (total, claimed, remaining)

### Market Data

- `GET /api/market/:contractAddress` - Get market data for a contract

## Socket.io Events

- `nft-claimed` - Emitted when an NFT is claimed
- `nft-unlocked` - Emitted when an NFT is unlocked
- `stats-updated` - Emitted when gallery stats change

## Configuration

The server configuration is stored in the `.env` file:

- `PORT` - The port the server will run on (default: 3001)
- `MONGO_URI` - MongoDB connection string (default: mongodb://localhost:27017/nft-gallery)

## Development

For development with auto-restart on file changes:

```bash
npm run dev
```

## Importing Data

To reset and reimport all NFT data:

```bash
node import-data.js
```

## Testing

For testing purposes, you can use the following endpoint to unlock NFTs:

```bash
# Unlock an NFT
POST /api/nfts/:id/unlock
```

## Troubleshooting

- If MongoDB fails to start, make sure it's installed correctly and the data directory exists
- If the server fails to connect to MongoDB, check the MongoDB connection string in the `.env` file
- If the client can't connect to the server, make sure the server is running and the client is using the correct URL
