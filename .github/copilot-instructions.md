# GitHub Copilot Instructions for FutureOn Integration Frontend Template

This document provides guidelines for GitHub Copilot when assisting with this project.

## Project Overview

This is a Svelte 5 frontend integration template project that:
- Uses Svelte 5 with runes for reactive state management
- Integrates with FutureOn FieldTwin API
- Is designed to be embedded as an iframe in FieldTwin applications
- Uses Bootstrap for styling and responsive design

## Architecture

FieldTwin communicates with integrations using `window.postMessage`.
- **Host -> Integration**: FieldTwin sends events (like `select`, `loaded`, `operationSearch`) to the integration iFrame.
- **Integration -> Host**: The integration sends requests (like `selectByTag`, `operationSearchResults`, `toast`) to the parent window.

FieldTwin identifies each integration via its `customTabId` (provided in the `loaded` event). All messages sent from the integration are automatically tagged with this ID by the host, which is used to group search results, manage progress indicators, and isolate visual filters.

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
- CSS files can be dynamically loaded for theming integration
- The application shows a loading state until integration data is received

### Core Events (Host -> Integration)

#### loaded
Sent when the integration is initialized. Contains tokens, project IDs, and user info.
```javascript
{
  event: 'loaded',
  token: 'JWT_TOKEN',
  subProject: 'SUBPROJECT_ID',
  backendUrl: '...',
  canEdit: true,
  APIServerIsReady: true,
  customTabId: 'UNIQUE_INTEGRATION_ID',
  selection: [{ type: 'stagedAsset', id: '...' }]
}
```

#### select
Sent whenever the user selects items in the 3D view.
```javascript
{
  event: 'select',
  data: [{ type: 'stagedAsset', id: '...', name: '...' }],
  cursorPosition: { x, y, z }
}
```

#### operationSearch
Sent when the user presses **Enter** in the global search bar (FieldTwin Operation).
```javascript
{
  event: 'operationSearch',
  query: 'search-string'
}
```

#### operationSearchProgress
Sent by the integration to update the host on search progress. Note: If no update is received for 30 seconds, the progress indicator will be automatically hidden.
```javascript
{
  event: 'operationSearchProgress',
  data: {
    status: 'Searching assets...',
    progress: 45, // Optional, 0-100
    isComplete: false // Set to true to hide the progress indicator
  }
}
```

### Common Requests (Integration -> Host)

Integrations send messages to `window.parent`:
```javascript
window.parent.postMessage(payload, '*');
```

#### operationSearchResults
Reply to `operationSearch`. Supports hierarchical results and icons.
```javascript
{
  event: 'operationSearchResults',
  data: {
    results: [
      {
        category: 'My Category', // Foldable in the UI
        id: 'item-1',             // Required for sub-item state persistence
        html: '<b>Parent Item</b>',
        action: 'myAction',       // Optional: event sent back on click
        args: { id: 1 },          // Optional: data passed to action
        subItems: [               // Optional: nested items
          {
            id: 'sub-1',          // Optional unique ID
            html: 'Sub Asset A',
            icon: 'cube',         // 'file', 'cube', or 'circle' (default)
            action: 'focusSub',
            args: { id: 'a' }
          }
        ]
      }
    ]
  }
}
```

#### visualFilteringUpdate
Send available visual filters to be displayed as buttons next to the search bar in Operation mode.
```javascript
{
  event: 'visualFilteringUpdate',
  data: {
    filters: [
      {
        id: 'annotation',
        label: 'Annotation',
        state: false,
        subFilters: [ // Optional: turns the button into a popup menu
          { id: 'danger', label: 'Danger', state: false },
          { id: 'warning', label: 'Warning', state: false }
        ]
      }
    ]
  }
}
```

#### visualFilterToggle
Received by the integration when a user clicks a filter button or a sub-filter checkbox.
```javascript
{
  event: 'visualFilterToggle',
  data: {
    id: 'annotation',
    state: true,
    subFilterId: 'danger' // Present if a sub-filter was toggled
  }
}
```

#### selectByTag
Select items in FieldTwin by their tags.
```javascript
{
  event: 'selectByTag',
  tags: ['tag1', 'tag2']
}
```

#### toast
Show a notification in the main UI.
```javascript
{
  event: 'toast',
  data: {
    type: 'success', // 'success', 'info', 'warning', 'error'
    message: 'Hello World'
  }
}
```

#### getResources / getVisibleResources / getResourcesByTags
Query resources from the graph.
- **getResources**: returns full resource attributes for specific IDs.
- **getVisibleResources**: returns resources currently visible in the 3D viewport.
- **getResourcesByTags**: returns resources matching specific tag paths.
```javascript
{
  event: 'getResourcesByTags',
  data: {
    tags: ['status::active', 'sector::A'],
    resourceTypes: ['stagedAsset'],
    queryId: 'optional-correlation-id'
  }
}
```

#### Tag Annotations
Display status information or visual labels next to resources in the 3D viewport based on their tags.
```javascript
{
  event: 'updateTagsAnnotation',
  data: {
    annotations: [
      {
        pattern: 'status::alert',
        color: '#ff0000',
        text: 'Action Required',
        icon: 'warning'
      }
    ]
  }
}

// Clear annotations
{
  event: 'clearTagsAnnotation'
}
```

#### displayDocument
Open a document in the host's file viewer.
```javascript
{
  event: 'displayDocument',
  data: {
    id: 'DOCUMENT_ID',
    revisionId: 'REVISION_ID'
  }
}
```

#### getProjectData
Retrieve raw project configuration, metadata definitions, and CRS.
```javascript
{
  event: 'getProjectData'
}
```

#### computeCostUsingServer
Trigger a cost calculation on the backend for the current project.
```javascript
{
  event: 'computeCostUsingServer'
}
```

#### zoomAt / zoomOn
Control the camera.
```javascript
// zoomAt: focus on specific coordinates
{
  event: 'zoomAt',
  data: { x: 665000, y: 400000, z: 100 }
}

// zoomOn: focus on specific resources
{
  event: 'zoomOn',
  data: {
    resourceIds: ['ID1', 'ID2'],
    resourceTypes: ['stagedAsset']
  }
}
```

#### Resource Management (CRUD)
FieldTwin allows integrations to manipulate project resources (staged assets, wells, connections, etc.). These messages can be sent individually (`createResource`) or in batch (`createResources`).

##### createResource / createResources
Creates new resources in the current subproject.
- **Attributes**: Properties for the resource (e.g., `x`, `y`, `z`, `name`).
- **Volatile**: If `true`, the resource is temporary and NOT saved to the database.
- **Draggable**: If `true`, users can drag the resource in the 3D scene.
```javascript
{
  event: 'createResources',
  data: [
    {
      resourceType: 'stagedAsset',
      attributes: {
        name: 'New Asset',
        x: 665000,
        y: 400000,
        z: 0,
        stagedAssetSymbolId: '...'
      },
      volatile: false,
      draggable: true,
      projectTreeViewCustomPath: ['My Integration', 'Assets']
    }
  ]
}
```

##### updateResource / updateResources
Updates existing resources.
- **resourceId**: The UUID of the resource to update.
- **attributes**: Object containing only the properties to change.
```javascript
{
  event: 'updateResources',
  data: [
    {
      resourceType: 'stagedAsset',
      resourceId: 'UUID-123',
      attributes: {
        name: 'Updated Name',
        z: 10
      }
    }
  ]
}
```

##### deleteResource / deleteResources
Removes resources from the project.
```javascript
{
  event: 'deleteResources',
  data: [
    {
      resourceType: 'stagedAsset',
      resourceId: 'UUID-123'
    }
  ]
}
```

#### createChart / deleteChart
Display Chart.js billboards in the 3D scene.
```javascript
{
  event: 'createChart',
  data: {
    id: 'my-chart-id',
    type: 'bar',
    title: 'Sensor Data',
    datasets: [{ label: 'Temp', data: [10, 20, 30] }],
    labels: ['Jan', 'Feb', 'Mar'],
    position: { x: 100, y: 200, z: 0 }
  }
}
```

#### Create / Update Resource Attributes

When using `createResources` or `updateResources`, the `attributes` object varies by resource type:

##### Common Attributes (All Types)
- `name`: (String) Display name of the resource.
- `description`: (String) Text description.
- `tags`: (Array<String>) Custom tags for filtering/grouping.
- `visible`: (Boolean) Visibility in the 3D scene.
- `isInactive`: (Boolean) Whether the resource is considered "active" in calculations or operations.

##### StagedAsset (Equipment/Assets)
- `initialState`: (Object) Contains spatial data.
    - `x`, `y`, `z`: (Number) Global coordinates.
    - `rotation`: (Number) Heading/rotation in degrees.
- `status`: (String) Operational status (e.g., "Planned", "Installed").
- `vendorAttributes`: (Object) Custom data specific to the asset type.
- `operatorTags`, `supplierTags`: (Array<String>) Specialized tag arrays.

##### Well
- `x`, `y`: (Number) Global coordinates (Wells are often vertical, so `z` is derived).
- `radius`: (Number) Visual radius of the wellhead.
- `color`: (String) Hex color (e.g., "#FF0000").
- `kind`: (String) Relationship ID to a `WellType`.

##### Connection (Pipelines/Cables)
- `fromCoordinate`, `toCoordinate`: (Object) `{ x, y, z }` defining start and end.
- `intermediaryPoints`: (Array<Object>) Points between start/end: `[{ x, y, z, added: true }]`.
- `params`: (Object) Visual parameters, e.g., `{ width: 5 }`.
- `status`: (String) Operational status.

##### Shape (Zones/Areas)
- `x`, `y`, `z`: (Number) Anchor position.
- `rotation`: (Object) `{ x, y, z }` rotation in radians.
- `scale`: (Number) Uniform scale factor.
- `color`: (String) Hex color.
- `shapeType`: (String) One of: `Sphere`, `Box`, `Line`, `Polygon`, `Cylinder`.
- `linePoints`: (Array<Object>) For `Line` or `Polygon` types.

##### Overlay (Labels/Annotations)
- `x`, `y`, `z`: (Number) Coordinate position.
- `text`: (String) Content of the overlay.
- `width`, `height`: (Number) Dimensions of the overlay box.

#### exportToGLTF / exportToGeoJSON
Trigger data exports. `exportToGLTF` returns a `Blob`.
```javascript
{
  event: 'exportToGLTF'
}
```

#### updateTagStyles
Apply dynamic styling (colors/icons) to tags in the File Viewer or 3D view.
```javascript
{
  event: 'updateTagStyles',
  data: {
    tagStyles: [
      { pattern: 'status::active', color: '#00ff00' },
      { pattern: 'type::valve', icon: 'valve-icon.svg' }
    ]
  }
}
```

#### clearSelection
Clear current selection in the host.
```javascript
{
  event: 'clearSelection'
}
```

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

##### StagedAssets: `/API/v1.10/:projectId/subProject/:subProjectId/stagedAssets`

**Request Headers:**
- `Authorization: Bearer {JWT_TOKEN}` (required)

**Response Structure:**
Each staged asset contains:

**Core Properties:**
- `id`: Unique identifier
- `asset`: Asset definition (detailed structure below)
- `name`: Asset name
- `description`: Asset description
- `source`: Data source
- `tags`: Array of tag strings
- `operatorTags`: Array of operator tag strings
- `supplierTags`: Array of supplier tag strings

**Asset Definition Structure:**
The `asset` property contains the template/definition this staged asset is based on:
- `_id`: Unique asset definition ID
- `name`: Asset definition name
- `category`: Primary asset category
- `subCategory`: Secondary categorization
- `type`: Asset type identifier
- `subType`: Asset sub-type identifier
- `description`: Asset definition description
- `shared`: Boolean indicating if asset is shared across accounts
- `imageUrl`: URL to preview image for this asset
- `model3dUrl`: URL to 3D model for this asset

**Asset Parameters:**
- `params`: Asset-specific parameters object
  - `width`: Asset width dimension
  - `height`: Asset height dimension
  - `scale`: Default scale multiplier
  - `top`: Top offset for image centering
  - `left`: Left offset for image centering

**Asset Socket Definitions:**
- `sockets2d`: Array of available socket definitions on the asset
  - `name`: Socket identifier
  - `x`, `y`, `z`: Socket position relative to asset center
  - `type`: Socket type definition
    - `id`: Socket type ID
    - `name`: Socket type name
    - `category`: Socket category
    - `color`: Socket color code
    - `symbol`: Socket symbol representation
    - `params`: Socket parameters (e.g., width)
  - `types`: Array of compatible socket type IDs

**Positioning & State:**
- `initialState`: Position and rendering state
  - `x`, `y`, `z`: Position coordinates
  - `rotation`: Rotation in degrees around Z-axis
  - `scale`: Scale multiplier
  - `opacity`: Transparency (0-1)
  - `label-offset-x`, `label-offset-y`: Label positioning

**Connections:**
- `connectionsAsFrom`: Object with connection IDs originating from this asset
- `connectionsAsTo`: Object with connection IDs terminating at this asset

**Sockets:**
- `havePerAssetSockets`: Boolean indicating custom socket configuration
- `sockets2d`: Array of socket instances on this specific staged asset
  - `name`: Socket identifier
  - `x`, `y`, `z`: Socket position relative to asset center
  - `type`: Socket type definition with category, color, symbol
  - `types`: Array of compatible socket types

**Cost Information:**
- `costObject`: Cost calculation details
  - `value`: Simple cost value
  - `costByLength`: Boolean for length-based costing
  - `costPerLengthUnit`: Cost per unit length
  - `entries`: Array of detailed cost entries

**Well Connection:**
- `well`: Connected well information (if applicable)
  - `name`: Well name
  - `x`, `y`: Well head position
  - `path`: Array of well path points [x,y,z,depth,pitch,yaw]

**MetaData:**
- `metaData`: Array of metadata objects
  - `id`: Metadata identifier
  - `name`: Display name
  - `type`: Data type (string, numerical, boolean)
  - `value`: Metadata value
  - `option`: Additional options (e.g., units for numerical)

**Virtual Asset Properties:**
- `virtual`: Boolean indicating if this is a virtual asset
- `virtualAsset`: Virtual asset information (if applicable)
  - `id`: Virtual asset ID
  - `name`: Virtual asset name
  - `global`: Boolean for global availability
  - `account`: Account identifier
  - `clonedFroms`: Array of parent virtual asset IDs
  - `canDragInDesign`: Boolean for design interaction
  - `type`: Virtual asset type

**Local Account Metadata:**
- `LocalAccountType`: ID of local type for localAccountMetaData
- `localAccountMetaData`: Array of account-specific metadata
  - `id`: Metadata identifier (deprecated)
  - `value`: Metadata value
  - `option`: Additional options (e.g., units)
  - `definitionId`: Metadata definition ID
  - `metaDatumId`: Metadata datum ID
  - `metaDataLinkId`: Metadata link ID
  - `valueBis`: Asset ID for asset-type metadata
  - `valueTer`: Socket name for asset-type metadata

**Clone Information:**
- `clonedFroms`: Array of parent object IDs (if cloned)

**Foreign Asset Properties:**
- `isForeign`: Boolean indicating if from external subProject
- `getFrom`: URL to retrieve from external subProject
- `getFromSubProject`: URL to external subProject source

##### Connections: `/API/v1.10/:projectId/subProject/:subProjectId/connections`

**Request Headers:**
- `Authorization: Bearer {JWT_TOKEN}` (required)
- `sample-every`: Optional sampling interval
- `raw-intermediary`: Boolean for raw intermediate points
- `simplify`: Boolean for path simplification

**Response Structure:**
Each connection contains:

**Core Properties:**
- `id`: Unique identifier
- `description`: Connection description
- `source`: Data source
- `tags`: Array of tag strings
- `operatorTags`: Array of operator tag strings
- `supplierTags`: Array of supplier tag strings

**Connection Points:**
- `from`: Source object details
  - Full asset information including sockets, positioning, metadata
- `to`: Destination object details  
  - Full asset information including sockets, positioning, metadata
- `fromSocket`: Source socket name
- `toSocket`: Destination socket name
- `fromCoordinate`: Source coordinates {x, y, z}
- `toCoordinate`: Destination coordinates {x, y, z}

**Path & Geometry:**
- `intermediaryPoints`: Array of intermediate path points
  - `x`, `y`, `z`: Point coordinates
  - `added`: Boolean indicating if point was auto-generated
  - `doNotHeightSample`: Boolean for height sampling control
- `length`: Arc length of connection
- `sampledLength`: Sampled length (when sampling enabled)
- `sampled`: Array of sampled points with x, y, z coordinates

**Visual Properties:**
- `params`: Rendering parameters
  - `type`: Connection type ID
  - `label`: Connection name
  - `width`: Connection radius (default 0.5m)
  - `color`: Hex color code
  - `showFlow`: Boolean for flow direction display
- `renderOrder`: Rendering order
- `showLabel`: Boolean for label visibility
- `showLength`: Boolean for length display
- `opacity`: Transparency (0-1)
- `straight`: Boolean for straight vs curved rendering

**Connection Type Definition:**
- `definition`: Connection type details
  - `name`: Type name
  - `category`: Category information with id and name
  - `color`: Default color
  - `symbol`: Short identifier
  - `params`: Type-specific parameters

**Cost Information:**
- `costObject`: Cost calculation details (same structure as staged assets)

**MetaData:**
- `metaData`: Array of metadata objects (same structure as staged assets)

##### Wells: `/API/v1.10/:projectId/subProject/:subProjectId/wells`

**Request Headers:**
- `Authorization: Bearer {JWT_TOKEN}` (required)

**Response Structure:**
Each well contains:

**Core Properties:**
- `id`: Unique identifier
- `name`: Well name
- `description`: Well description
- `source`: Data source
- `tags`: Array of tag strings

**Positioning:**
- `x`: X position of well head
- `y`: Y position of well head  
- `z`: Z position of well head
- `color`: Rendering color (HTML hex format)
- `radius`: Visual representation size
- `radiusViewDependant`: Boolean for zoom-dependent sizing

**Well Type:**
- `kind`: Well type object
  - `id`: Well type identifier
  - `name`: Well type name
  - `global`: Boolean for global availability
  - `account`: Account identifier

**Well Paths:**
- `wellBores`: Array of well bore paths
  - `id`: Well bore identifier
  - `name`: Well bore name
  - `path`: Array of path points with coordinates and directional data
    - `x`, `y`, `z`: Position coordinates
    - `depth`: Optional depth value
    - `incl`: Optional inclination
    - `az`: Optional azimuth
- `activeWellBores`: Currently active well bore (same structure as wellBores)

**Additional Features:**
- `visible`: Boolean for visibility
- `canBeDrag`: Boolean for interactive dragging
- `casingShoes`: Array of casing shoe positions
  - `offset`: Position along well length (0 to well length)
- `referenceLevel`: Reference level for the well

**MetaData:**
- `metaData`: Array of metadata objects
  - `id`: Metadata identifier
  - `name`: Display name
  - `type`: Data type
  - `value`: Metadata value with nested object structure
  - `metadatumId`: Metadata definition ID
  - `definitionId`: Definition identifier
  - `cost`: Cost information
  - `costPerLength`: Boolean for length-based costing

##### Shapes: `/API/v1.10/:projectId/subProject/:subProjectId/shapes`

**Common Shape Properties:**
- `name`: Shape name
- `description`: Shape description
- `source`: Data source
- `shapeType`: Geometry type (Box, Sphere, Triangle, Circle, Rectangle, Cone, Cylinder, Ring, Torus, Polygon, FlatTube, Tube)
- `visible`: Boolean for visibility
- `opacity`: Transparency (0-1)
- `x`, `y`, `z`: Position coordinates
- `scale`: Scale multiplier (0.1-100)
- `rotation`: Object with x, y, z rotation in degrees

**Visual Properties:**
- `color`: HTML/CSS3 color format
- `outlineColor`: Outline color
- `outlineOpacity`: Outline transparency (0-1)
- `outlineRender`: Boolean for outline rendering
- `shadingEnabled`: Boolean for shading
- `textureEnabled`: Boolean for texture

**Label Properties:**
- `labelVisible`: Boolean for label visibility
- `labelX`, `labelY`: Label offset coordinates
- `labelZAlign`: Boolean for top alignment
- `labelSize`: Label font size
- `labelColor`: Label color

**Positioning Behavior:**
- `stickToBathy`: Boolean for bathymetry attachment
- `doNotCrossBathy`: Boolean to prevent going below bathymetry
- `assetAlignment`: Alignment method ("Center")

**Connection Snapping (FlatTube/Tube only):**
- `connection`: Connection ID to snap to
- `connectionOffset`: Offset along connection
- `connectionLength`: Length along connection
- `connectionRadius`: Radius when snapped
- `connectionRelativeToEnd`: Boolean for end-relative positioning
- `connectionCoversEntire`: Boolean for full connection coverage

**Shape-Specific Dimensions:**
- **Sphere:** `sphereRadius`
- **Box:** `boxWidth`, `boxHeight`, `boxDepth`
- **Circle:** `circleRadius`
- **Rectangle:** `rectangleWidth`, `rectangleHeight`
- **Cone:** `coneRadius`, `coneHeight`
- **Cylinder:** `cylinderRadiusTop`, `cylinderRadiusBottom`, `cylinderHeight`
- **Ring:** `ringInnerRadius`, `ringOuterRadius`
- **Torus:** `torusRadius`, `torusThickness`
- **Triangle:** `triangleWidth`, `triangleHeight`

**Advanced Features:**
- `useAsLight`: Boolean for light source functionality
- `lightIntensity`: Light intensity (0.01-1)
- `useAsDepthMask`: Boolean for depth masking
- `invertClippingMask`: Boolean for inverted clipping

##### Layers: `/API/v1.10/:projectId/subProject/:subProjectId/layers`

**Core Properties:**
- `name`: Layer name
- `description`: Layer description
- `source`: Data source
- `kind`: Layer type identifier
- `url`: Resource location (bucket-name/path-to-file format)

**Positioning & Transform:**
- `x`, `y`, `z`: Position offsets
- `rotation`: Rotation in degrees
- `scale`: Scale multiplier
- `visible`: Boolean for visibility
- `opacity`: Transparency (0-1)

**Height Sampling:**
- `heightSample`: Boolean for height sampling on other layers
- `heightSamplerLayerId`: Reference layer ID for height sampling

**Gradient Rendering:**
- `isGradient`: Boolean for gradient bitmap generation
- `gradientPalette`: Array of gradient color stops
  - `a`: Value for color step
  - `c`: HTML color format (#RRGGBBAA)

**Seabed Texturing:**
- `seaBedTextureName`: Predefined texture name (rocksDiffuse, sandsDiffuse, etc.)
- `useSeabedColor`: Boolean for custom color instead of texture
- `seabedColor`: HTML color when using custom color

**MetaData:**
- `metaData`: Array of metadata objects (structure varies by layer type)

##### Wellbore Segments: `/API/v1.10/:projectId/subProject/:subProjectId/wellBore/:wellBoreId/wellBoreSegments/`

**Core Properties:**
- `name`: Segment name
- `description`: Segment description
- `source`: Data source
- `kind`: Wellbore segment type ID
- `tags`: Array of tag strings

**Positioning:**
- `startOffset`: Start position along wellbore
- `length`: Segment length
- `relativeToEnd`: Boolean for end-relative positioning
- `visible`: Boolean for visibility

**Visual Properties:**
- `thickness`: Segment thickness
- `opacity`: Transparency
- `labelColor`: Label color
- `labelVisible`: Boolean for label visibility
- `labelSize`: Label font size
- `labelOffsetX`, `labelOffsetY`: Label positioning

**MetaData:**
- `metaData`: Array of metadata objects (same structure as other objects)


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

## API Reference

The FieldTwin API follows the OpenAPI 3.0 specification:
- **OpenAPI 3.0 JSON**: [https://api-qa.fieldtwin.com/oas3.json](https://api-qa.fieldtwin.com/oas3.json)
- **Online Documentation**: [https://api.fieldtwin.com](https://api.fieldtwin.com)

## Integration Guidelines

1. Always check `event.data.event` in your message listener.
2. Use `APIServerIsReady` from the `loaded` event or `apiPodIsReady` event before calling the API.
3. Keep the UI consistent with FieldTwin styles by using the `cssUrl` provided in the `loaded` event.
