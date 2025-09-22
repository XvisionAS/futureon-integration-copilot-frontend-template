# FutureOn Integration Copilot Frontend Template

This repository demonstrates how to use GitHub Copilot for frontend integration development with the FieldTwin API. It provides a Svelte 5 frontend template designed to be embedded as an iframe in FieldTwin applications, along with comprehensive Copilot instructions and example PRDs.

## 🎯 Purpose

This template serves as a demonstration of:
- How to structure frontend integrations for FieldTwin
- How to write effective PRDs (Product Requirements Documents) for GitHub Copilot
- How to configure Copilot instructions for consistent code generation
- Best practices for Svelte 5 with runes and FieldTwin API integration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- VS Code with GitHub Copilot extension
- FieldTwin account and API access

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd futureon-integration-copilot-frontend-template

# Install dependencies
npm install

# The .env file is automatically created with the default API URL
# You can modify it if needed for your environment
cat .env

# Start development server
npm run dev
```

### Development

```bash
# Development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
├── .github/
│   └── copilot-instructions.md    # GitHub Copilot configuration
├── prd/
│   └── metadata-compare-integration.md  # Example PRD for Copilot
├── src/
│   ├── actions/
│   │   └── IntegrationService.js  # FieldTwin API service
│   ├── components/
│   │   └── ConnectionList.svelte  # Example component
│   ├── App.svelte                 # Main application
│   └── main.js                    # Application entry point
└── package.json
```

## 🤖 GitHub Copilot Integration

### Copilot Instructions

The repository includes comprehensive Copilot instructions in `.github/copilot-instructions.md` that guide code generation for:
- Svelte 5 with runes syntax
- FieldTwin API integration patterns
- Bootstrap 5 styling conventions
- Component structure and naming

### Example PRD

The `prd/metadata-compare-integration.md` file demonstrates how to write effective Product Requirements Documents that Copilot can use to generate appropriate code. It focuses on user requirements rather than technical implementation details.

## 🛠 Technology Stack

- **Frontend**: Svelte 5 with runes
- **Build Tool**: Vite
- **Styling**: Bootstrap 5 + svelte-bootstrap-icons
- **HTTP Client**: Axios
- **API**: FieldTwin API integration

## 🔧 FieldTwin Integration

This template is designed to be embedded as an iframe in FieldTwin applications:

- Receives JWT tokens and project data via window messages
- Integrates with FieldTwin API for data fetching
- Supports dynamic CSS theming
- Handles iframe communication patterns

### Environment Configuration

The `.env` file contains the FieldTwin API base URL:
```bash
VITE_FIELDAP_API_BASE_URL=http://futureon-backend.lvh.me
```

You can modify it in the `.env` file if you need to point to a different FieldTwin API endpoint.

## 📚 How to Use This Template

1. **Study the Copilot Instructions**: Review `.github/copilot-instructions.md` to understand the coding conventions
2. **Examine the Example PRD**: Look at `prd/metadata-compare-integration.md` to see how to write requirements
3. **Create Your Own PRD**: Write a PRD for your specific integration needs
4. **Use Copilot**: Let GitHub Copilot generate code based on your PRD and the existing patterns
5. **Iterate**: Refine your requirements and regenerate code as needed

## 🎨 Example Integration

The current implementation shows:
- Connection listing from FieldTwin API
- Basic iframe integration setup
- Window message handling for FieldTwin communication
- Responsive Bootstrap UI

## 📖 Documentation

- [FieldTwin API Documentation](https://api.fieldtwin.com/)
- [Svelte 5 Documentation](https://svelte.dev/docs)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)

## 🤝 Contributing

This template is designed for demonstration and learning purposes. Feel free to:
- Use it as a starting point for your own integrations
- Modify the Copilot instructions for your team's needs
- Create additional example PRDs
- Improve the existing code patterns

## 📄 License

This project is provided as a template for educational and demonstration purposes.
