# NFT Gallery - User Guide

This document provides instructions on how to use the NFT Gallery and how to customize it with your own images, names, and stories.

## Table of Contents

1. [Overview](#overview)
2. [How It Works](#how-it-works)
3. [Adding Your Images](#adding-your-images)
4. [Customizing NFT Names and Stories](#customizing-nft-names-and-stories)
5. [Unlock Schedule](#unlock-schedule)
6. [Technical Details](#technical-details)

## Overview

The NFT Gallery is a web-based platform that allows users to claim NFTs on a first-come, first-served basis. The gallery displays 102 NFTs that unlock at predetermined intervals. When an NFT unlocks, users can claim it by creating a token on pump.fun and submitting the contract address.

## How It Works

1. **Locked NFTs**: All NFTs start in a locked state, displayed with a blur effect and a lock icon.
2. **Timed Unlocks**: NFTs unlock according to a predetermined schedule (see [Unlock Schedule](#unlock-schedule)).
3. **Claiming Process**:
   - When an NFT unlocks, users can click on it to claim it.
   - Clicking "CLAIM" redirects to pump.fun where users can create a token.
   - After creating the token, users return to the gallery and enter the contract address.
   - The first valid contract address submitted claims the NFT.
4. **Claimed NFTs**: Claimed NFTs display a "CLAIMED" badge and show the contract address and market cap.

## Adding Your Images

To add your own images to the NFT Gallery:

1. Create a folder named `gallery` inside the `assets/images` directory if it doesn't already exist.
2. Add your images to this folder.
3. Name your images to match the NFT IDs (e.g., `1.png`, `2.png`, etc.).
4. Images should be in a 1:1 aspect ratio (square) with a recommended size of 500x500 pixels.
5. Supported formats: PNG, JPG, GIF, WEBP.

The system will automatically use these images for the corresponding NFTs.

## Customizing NFT Names and Stories

To customize the names and stories for your NFTs, edit the `nft-data.json` file:

1. Open the `nft-data.json` file in a text editor.
2. For each NFT, update the "title" and "description" fields with your custom content.
3. Save the file.

Example format:
```json
[
  {
    "id": 1,
    "title": "NFT Name 1",
    "description": "This is the story for NFT #1"
  },
  {
    "id": 2,
    "title": "NFT Name 2",
    "description": "This is the story for NFT #2"
  }
]
```

The system will automatically load this data when the gallery page is opened. If you've already used the gallery and want to reload the data from the JSON file, you can clear your browser's localStorage and refresh the page.

## Unlock Schedule

The NFTs unlock according to the following schedule:

- NFTs 1-10: Every 15 minutes
- NFTs 11-20: Every 30 minutes
- NFTs 21-30: Every 45 minutes
- NFTs 31-40: Every 60 minutes (1 hour)
- NFTs 41-50: Every 75 minutes (1 hour 15 minutes)
- NFTs 51-60: Every 90 minutes (1 hour 30 minutes)
- NFTs 61-70: Every 105 minutes (1 hour 45 minutes)
- NFTs 71-80: Every 120 minutes (2 hours)
- NFTs 81-90: Every 135 minutes (2 hours 15 minutes)
- NFTs 91-100: Every 150 minutes (2 hours 30 minutes)
- NFTs 101-102: Every 165 minutes (2 hours 45 minutes)

## Technical Details

The NFT Gallery is built using HTML, CSS, and JavaScript. It uses localStorage to persist data between sessions, so users won't lose their progress if they close the browser.

### File Structure

- `gallery.html`: Main HTML file for the gallery
- `css/gallery.css`: CSS styles for the gallery
- `js/gallery-data.js`: Data structure for the NFTs
- `js/gallery-timer.js`: Timer system for unlocking NFTs
- `js/gallery-ui.js`: User interface functionality
- `js/gallery-claim.js`: Claiming functionality
- `nft-data.json`: JSON file containing customizable NFT titles and descriptions

### Market Cap Data

The gallery currently simulates market cap data for claimed NFTs. In a production environment, you would integrate with a Solana API like Jupiter, Birdeye, or DexScreener to fetch real market cap data.

To implement this, you would need to modify the `fetchMarketCap` function in `js/gallery-claim.js` to call the appropriate API.
