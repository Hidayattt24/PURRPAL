# CAPSTONE DBS - PURRPAL

## Development Setup

### Prerequisites
- Node.js >= 18.0.0
- npm (Node Package Manager)

### Package Manager
This project uses `npm` as the package manager. Please do not use other package managers (yarn, pnpm, etc) to avoid dependency conflicts.

### Installation Steps

1. Clone the repository:
```bash
git clone [repository-url]
cd PURRPAL
```

2. Install dependencies for each service:

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Install chatbot dependencies
cd ../chatbot
npm install
```

3. Start development servers:

```bash
# Start frontend
cd frontend
npm run dev

# Start backend (in a new terminal)
cd backend
npm run dev

# Start chatbot (in a new terminal)
cd chatbot
npm run dev
```

### Important Notes
- Always use `npm install` to install new dependencies
- Make sure to commit package-lock.json when adding/updating dependencies
- Run `npm run lint` before committing to ensure code quality 
