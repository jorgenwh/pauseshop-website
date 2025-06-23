# PauseShop Project Structure

This document explains the organization of the PauseShop codebase.

## Directory Structure

```
src/
├── assets/                    # Static assets like images, icons
├── components/                # Shared/reusable components
│   ├── ui/                    # Basic UI components (atoms)
│   ├── feedback/              # Feedback components
│   └── layout/                # Layout components
├── features/                  # Feature-based components and logic
│   ├── image-upload/          # Image upload feature
│   │   ├── components/        # Components specific to this feature
│   │   ├── hooks/             # Hooks specific to this feature
│   │   └── index.ts           # Export public API of the feature
│   └── product-display/       # Product display feature
│       ├── components/
│       └── index.ts
├── lib/                       # Utilities and helpers
│   ├── api/                   # API related code
│   ├── constants.ts           # Application constants
│   ├── types.ts               # Shared TypeScript types
│   └── utils.ts               # Utility functions
├── pages/                     # Page components
├── styles/                    # Global styles
├── app.tsx                    # Main app component
└── main.tsx                   # Entry point
```

## Features

### Image Upload
The image upload feature handles everything related to uploading and processing images:
- File selection and validation
- Image preview
- Tips for taking screenshots
- Image processing and API communication

### Product Display
The product display feature handles everything related to displaying products:
- Product cards
- Product lists
- Amazon link generation

## Shared Components

### UI Components
Basic UI components that can be reused across the application:
- Buttons
- Inputs
- Cards

### Feedback Components
Components for providing feedback to the user:
- Error messages
- Success messages
- Loading indicators

## Library

### API
API-related code:
- API client for communication with the backend
- Endpoint configuration
- Request and response types

### Constants
Application constants:
- Colors
- Text content
- Configuration values

### Types
TypeScript type definitions:
- Product interface
- API request/response types
- Component prop types

### Utils
Utility functions:
- Image conversion
- URL construction
- Helper functions

## Best Practices

1. **Imports**: Use index files to simplify imports
2. **Component Props**: Define prop types for each component
3. **Feature Isolation**: Keep feature-specific code within its feature directory
4. **Shared Code**: Move reusable code to the appropriate shared directory
5. **Constants**: Use constants for values that are used in multiple places