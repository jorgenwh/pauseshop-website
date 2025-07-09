# FreezeFrame - AI-Powered Product Discovery from Video Screenshots

## Project Overview
FreezeFrame is a React-based web application that allows users to upload screenshots from videos and uses AI to identify products visible in the images, then helps them find those products on Amazon. The app is designed for users who see products in videos (YouTube, streaming services, etc.) and want to purchase them.

## Core Functionality
- **Image Upload**: Users can drag-and-drop or browse to upload PNG/JPG images
- **AI Product Detection**: Streaming AI analysis identifies products in uploaded images
- **Product Categorization**: Products are classified into categories (Clothing, Footwear, Accessories, Electronics, Home Goods, Beauty, Other)
- **Amazon Integration**: Direct links to search for identified products on Amazon
- **Real-time Results**: Streaming response shows products as they're detected

## Technical Architecture

### Frontend (This Repository)
- **Framework**: React 19 with TypeScript
- **Routing**: React Router v7 for SPA navigation
- **Styling**: Tailwind CSS with custom dark theme
- **Build Tool**: Vite with SWC for fast compilation
- **Deployment**: Google App Engine with automated CI/CD via GitHub Actions

### Key Technologies
- **UI Components**: Custom component library with Radix UI primitives
- **State Management**: React hooks (useState, useCallback, useRef)
- **File Handling**: Drag-and-drop file upload with image compression
- **API Communication**: Fetch API with streaming responses (Server-Sent Events)
- **Image Processing**: Client-side base64 conversion with size optimization

### Backend Integration
- **Server**: Separate Node.js backend hosted on Google Cloud Run
- **API**: RESTful endpoints with streaming responses for real-time product detection
- **AI Service**: Integration with AI models for image analysis and product identification

## Project Structure
```
src/
├── app.tsx                 # Main app component with routing
├── pages/                  # Page components (Upload, Results)
├── features/               # Feature-based modules
│   ├── image-upload/       # File upload and image processing
│   └── product-display/    # Product listing and filtering
├── components/             # Reusable UI components
│   ├── ui/                 # Base UI components (Button, Card, etc.)
│   └── feedback/           # User feedback components
└── lib/                    # Utilities and configuration
    ├── api/                # API client and endpoints
    ├── types.ts            # TypeScript type definitions
    ├── constants.ts        # App constants and text content
    └── utils.ts            # Helper functions
```

## Key Features
1. **Responsive Design**: Mobile-first approach with dark theme
2. **Progressive Enhancement**: Works without JavaScript for basic functionality
3. **Error Handling**: Comprehensive error states and user feedback
4. **Performance**: Image compression, lazy loading, and optimized builds
5. **Accessibility**: Keyboard navigation and screen reader support
6. **SEO**: Server-side rendering ready with proper meta tags

## Development Workflow
- **Code Quality**: ESLint + Prettier with pre-commit hooks
- **Type Safety**: Full TypeScript coverage with strict mode
- **Testing**: Component-based architecture for easy testing
- **Deployment**: Automated deployment to Google App Engine on main branch pushes

## Environment Configuration
- **Production**: Uses remote AI server on Google Cloud Run
- **Development**: Can be configured for local development server
- **Build**: Optimized production builds with compression and minification

## User Flow
1. User uploads a screenshot from a video
2. Image is processed and sent to AI service via streaming API
3. Products are detected and displayed in real-time
4. User can filter products by category
5. User clicks to search for products on Amazon
6. User can start a new search or refine results

This application serves as the frontend interface for an AI-powered product discovery service, focusing on user experience and real-time feedback during the analysis process.