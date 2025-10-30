# GitHub Copilot Instructions for FutureOn Integration Frontend Template

This document provides guidelines for GitHub Copilot when assisting with this project.

## Project Overview

This is a Svelte 5 frontend integration template project that:
- Uses Svelte 5 with runes for reactive state management
- Integrates with FutureOn FieldTwin API
- Is designed to be embedded as an iframe in FieldTwin applications
- Uses Bootstrap for styling and responsive design

## Code Style and Conventions

### General Conventions

- Use camelCase for variables and functions
- Use PascalCase for component names, classes, and constructors
- Use kebab-case for file names
- Maximum line length: 100 characters
- Use 2 spaces for indentation
- Use single quotes for strings
- Always use semicolons
- Prefer const over let, avoid var
- Add trailing commas in multiline objects and arrays

### JavaScript Conventions

- Use ES6+ features where appropriate
- Use async/await instead of Promise chains when possible
- Use destructuring for objects and arrays
- Use template literals instead of string concatenation
- Export functions and classes at the end of the file
- Use default exports for service classes (like IntegrationService)
- Use named exports for utility functions

### Svelte Conventions

- This project uses Svelte 5 with the runes API
- Use the `$state()`, `$derived()`, and `$effect()` runes for state management
- Prefer runes over Svelte's older reactive syntax (`$:`) when possible
- Use `$props()` for component props definition
- Use `$derived()` for computed values
- Use `$effect()` for side effects
- Keep components small and focused on a single responsibility
- Use Svelte's built-in state management before reaching for stores
- Put component-specific styles in the same .svelte file
- Use direct attribute event handlers (e.g., `onclick`, `onchange`, `onsubmit`) instead of Svelte's directive syntax (`on:click`, `on:change`, `on:submit`)
- Apply this event handling pattern to all events (click, change, input, mouseover, etc.)

### Svelte 5 Runes Examples

```javascript
// State declaration
let count = $state(0);

// Props declaration
const { firstVar = null, secondVar = null, onCallback = () => {} } = $props();

// Derived values
let doubled = $derived(count * 2);

// Effects
$effect(() => {
  console.log(`Count changed to: ${count}`);
});

// Event handling
function handleClick() {
  count++;
}

<!-- Usage example with direct attribute event handlers -->
<button onclick={handleClick}>Increment</button>
<input onchange={(e) => console.log(e.target.value)} />
```

## JSDoc Documentation

All functions, classes, and methods should be documented using JSDoc with the following format:

```javascript
/**
 * Brief description of the function/class/method
 *
 * @param {Type} paramName - Description of the parameter
 * @param {Type} [optionalParam] - Description of the optional parameter
 * @returns {ReturnType} Description of the return value
 * @throws {ErrorType} Description of when this error is thrown
 * @example
 * // Example usage of the function/class/method
 * const result = myFunction('example');
 */
```

## Project Structure

### Frontend (Svelte)

- Components should be placed in the `/src/components/` directory
- API services should be placed in the `/src/actions/` directory
- Store files should be placed in the `/src/stores/` directory (if needed)
- Utility functions should be placed in the `/src/utils/` directory (if needed)
- Main application logic is in `/src/App.svelte`
- Global styles are in `/src/app.css`

## Testing

- Frontend tests should be placed in a `/tests/` directory
- Write tests for all new features and components
- Follow the AAA pattern (Arrange, Act, Assert) for test structure
- Test component behavior and API integration

## Logging

- Use `console.log`, `console.warn`, and `console.error` for frontend logging
- Log appropriate information at the correct log level
- Don't log sensitive information like JWT tokens
- Use console methods for debugging during development

## API Integration

- Use the IntegrationService class for all FieldTwin API interactions
- Follow RESTful principles when designing API calls
- Use consistent naming conventions for API methods
- Document all API integration methods
- Handle API errors gracefully with try-catch blocks
- Use environment variables for API base URLs

## Security Considerations

- Sanitize all user inputs
- Use HTTPS for all external communications
- Don't hardcode credentials or secrets
- Use environment variables for configuration
- Validate JWT tokens before making API calls
- Don't expose sensitive data in console logs

## Performance Considerations

- Minimize the number of API calls
- Implement appropriate caching mechanisms for API responses
- Use pagination for large data sets
- Optimize frontend assets for production
- Use Svelte's built-in reactivity efficiently
- Avoid unnecessary re-renders with proper state management

## When Adding New Dependencies

- Discuss major dependencies before adding them
- Document why a new dependency is needed
- Keep dependencies up to date
- Consider the size and maintenance status of dependencies

## Development and Deployment

- The project uses Vite for development and building
- Run `npm run dev` for local development
- Run `npm run build` to create production build
- The application is designed to be embedded as an iframe in FieldTwin
- Use environment variables for API configuration
- The project includes nginx configuration for production deployment

## FieldTwin Integration

- The application listens for `window` messages to receive JWT tokens and project data
- Use `window.loadedEvent` or `window.postMessage` for communication with parent FieldTwin application
- The app expects data in the format: `{ event: 'loaded', token: 'jwt', project: 'projectId', subProject: 'subProjectId', cssUrl: 'url', cssThemeUrl: 'url' }`
- CSS files can be dynamically loaded for theming integration
- The application shows a loading state until integration data is received

### FieldTwin API Authentication

All FieldTwin API requests require authentication using JWT tokens:

- **JWT Token Header**: Add the JWT token to the `Authorization` header as `Bearer $JWT_TOKEN`
- **Example**: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Alternative**: Some endpoints support the legacy `token` header (but `Authorization` and `token` headers are mutually exclusive)
- **Base URL**: `https://api.fieldtwin.com`
- **API Documentation**: Available at https://api.fieldtwin.com/

### FieldTwin Data Structure

A FieldTwin SubProject contains several types of objects, each with their own endpoints:

#### Core Object Types

1. **StagedAssets**: Physical assets placed on the design canvas
2. **Connections**: Pipes, cables, and other connections between assets
3. **Shapes**: Geometric shapes and annotations
4. **Layers**: Layer definitions for organizing objects
5. **Wells**: Well definitions and locations
6. **Wellbore Segments**: Detailed well path segments

#### API Endpoints for SubProject Data

Base pattern: `/API/v1.10/:projectId/subProject/:subProjectId/{endpoint}`

- **StagedAssets**: `/API/v1.10/:projectId/subProject/:subProjectId/stagedAssets`
- **Connections**: `/API/v1.10/:projectId/subProject/:subProjectId/connections`
- **Shapes**: `/API/v1.10/:projectId/subProject/:subProjectId/shapes`
- **Layers**: `/API/v1.10/:projectId/subProject/:subProjectId/layers`
- **Wells**: `/API/v1.10/:projectId/subProject/:subProjectId/wells`
- **Wellbore Segments**: `/API/v1.10/:projectId/subProject/:subProjectId/wellBore/:wellBoreId/wellBoreSegments/`

#### MetaData Structure

All object types contain a `metaData` array with the following structure:
- `id`: Unique identifier for the metadata entry
- `name`: Display name of the metadata field
- `vendorId`: Vendor-specific identifier
- `type`: Data type (e.g., "string", "numerical", "boolean")
- `value`: The actual metadata value
- `options`: Additional options (e.g., units for numerical values)

Users commonly query objects by `name` or `vendorId` fields in the metadata.

#### Definition and Type Endpoints

These endpoints provide schema and type information:

- **Asset Definitions**: `/API/v1.10/assets`
- **Connection Definitions**: `/API/v1.10/connections`
- **Connection Categories**: `/API/v1.10/connectionCategories`
- **Connection Types**: `/API/v1.10/connectionTypes`
- **Shape Types**: `/API/v1.9/wellBoreTypes`
- **Layer Types**: `/API/v1.9/layerTypes`
- **Well Types**: `/API/v1.10/wellTypes`
- **Well Bore Types**: `/API/v1.10/wellBoreTypes`
- **Well Bore Segment Types**: `/API/v1.10/wellBoreSegmentTypes`

#### Example API Request

```javascript
// Using axios with JWT authentication
const response = await axios.get(
  `https://api.fieldtwin.com/API/v1.10/${projectId}/subProject/${subProjectId}/stagedAssets`,
  {
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
    }
  }
);

// Filter by metadata name
const asset = response.data.find(item => 
  item.metaData.some(meta => meta.name === 'Asset Name')
);
```

## Key Dependencies

- **Svelte 5**: Modern reactive framework with runes
- **Bootstrap 5**: CSS framework for responsive design
- **Axios**: HTTP client for API requests
- **svelte-bootstrap-icons**: Icon library
- **Vite**: Build tool and development server