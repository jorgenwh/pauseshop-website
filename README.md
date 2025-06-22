# PauseShop Website

This repository contains the website for the PauseShop Chrome extension. The website is built using React, TypeScript, and Tailwind CSS.

## About PauseShop

PauseShop is a Chrome extension designed to help users make more mindful purchasing decisions by providing a moment of pause before completing a purchase. The extension aims to reduce impulse buying and promote thoughtful consumption.

## Tech Stack

- **React**: Frontend library for building user interfaces
- **TypeScript**: Typed superset of JavaScript for better code quality and developer experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Google Cloud**: Hosting platform for the website

## Project Structure

```
src/
├── assets/        # Static assets like images, fonts, etc.
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
├── pages/         # Page components for different routes
├── services/      # API and other service functions
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/pauseshop-website.git
   cd pauseshop-website
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Building for Production

To build the app for production, run:

```
npm run build
```

This will create a `build` folder with optimized production files.

## Deployment

The website will be deployed to Google Cloud Platform. Deployment instructions will be added soon.

## License

[MIT](LICENSE)