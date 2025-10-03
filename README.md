# WLNX Control Panel (React)

Modern React TypeScript interface for WLNX API data visualization. Built with the latest technologies for optimal performance and developer experience.

## 🚀 Tech Stack

- **React 18.3+** - Latest React with concurrent features
- **TypeScript 5.6+** - Strict type safety
- **Vite 5+** - Lightning-fast dev server & HMR
- **TanStack Query v5** - Powerful data fetching, caching, and synchronization
- **Zustand** - Lightweight state management
- **React Router v6** - Modern routing
- **Tailwind CSS 3.4+** - Utility-first styling
- **Lucide React** - Beautiful icons
- **date-fns** - Modern date utilities

## ✨ Features

### Dashboard
- 👥 **Users Management** - View all users with session counts and activity
- 📊 **Session Tracking** - Browse user sessions with detailed information
- 🔍 **Session Details** - Deep dive into transcriptions, summaries, and wellness data
- 🗑️ **Delete Operations** - Remove individual sessions or all user sessions

### Prompts Configuration
- 📝 **Conversation Stages** - Create and manage interview stages
- 💬 **Prompts Management** - Configure prompts for each stage
- ✏️ **Inline Editing** - Edit prompts and stages directly
- 🔄 **Active/Inactive Toggle** - Control which prompts are active

### Coaches Configuration
- 👨‍⚕️ **Coach Profiles** - Manage coach configurations
- 📋 **Prompt Content** - Configure coach-specific prompts
- ⚡ **Quick Actions** - Create, edit, and delete coaches

### System Features
- 🔄 **Auto-refresh** - Real-time data updates every 5 seconds
- 🏥 **Health Monitoring** - Server and bot status indicators
- ⌨️ **Keyboard Shortcuts** - ESC to close panels
- 📱 **Responsive Design** - Works on all screen sizes
- 🎨 **Modern UI** - Clean, professional interface
- ⚡ **Optimistic Updates** - Instant UI feedback
- 🔍 **Smart Caching** - Efficient data management

## 📦 Installation

```bash
# Install dependencies
npm install
```

## 🛠️ Configuration

Create a `.env` file in the root directory (copy from `.env.example`):

```env
VITE_API_URL=http://localhost:3000
VITE_BOT_HEALTH_URL=http://localhost:3002
```

## 🚀 Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

The development server includes:
- ⚡ Hot Module Replacement (HMR)
- 🔍 React Query Devtools
- 📊 TypeScript type checking

## 🏗️ Build

```bash
# Type check
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## 📁 Project Structure

```
src/
├── app/                      # Application setup
│   ├── App.tsx              # Root component
│   ├── router.tsx           # Route configuration
│   ├── providers.tsx        # Global providers
│   └── pages/               # Page components
│       ├── dashboard-page.tsx
│       ├── prompts-page.tsx
│       └── coaches-page.tsx
├── features/                # Feature modules
│   ├── users/
│   │   ├── api/            # API hooks
│   │   └── components/     # Feature components
│   ├── sessions/
│   ├── prompts/
│   ├── coaches/
│   └── health/
├── shared/                  # Shared code
│   ├── api/                # API client
│   ├── components/         # Reusable components
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilities
│   ├── store/              # Zustand stores
│   └── types/              # TypeScript types
└── ui/                     # UI components
    ├── button.tsx
    ├── card.tsx
    ├── badge.tsx
    ├── input.tsx
    └── textarea.tsx
```

## 🎯 Architecture Highlights

### Data Fetching with TanStack Query
- Automatic caching and background refetching
- Optimistic updates for better UX
- Smart query invalidation
- Built-in loading and error states

### State Management with Zustand
- Minimal boilerplate
- TypeScript-first
- Used for UI state (panels, selections)
- Server state handled by TanStack Query

### Feature-Based Organization
- Each feature is self-contained
- Easy to find and modify code
- Scalable architecture
- Clear separation of concerns

## 🔧 API Endpoints

The application expects the following endpoints:

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:email/sessions` - Get user sessions
- `DELETE /api/users/:email/sessions` - Delete all user sessions

### Sessions
- `GET /api/sessions/:id` - Get session details
- `DELETE /api/sessions/:id` - Delete session

### Prompts
- `GET /api/prompts/configuration` - Get full configuration
- `GET /api/prompts/stages` - Get all stages
- `POST /api/prompts/stages` - Create stage
- `PUT /api/prompts/stages/:id` - Update stage
- `DELETE /api/prompts/stages/:id` - Delete stage
- `GET /api/prompts` - Get all prompts
- `POST /api/prompts` - Create prompt
- `PUT /api/prompts/:id` - Update prompt
- `DELETE /api/prompts/:id` - Delete prompt

### Coaches
- `GET /api/coaches` - Get all coaches
- `POST /api/coaches` - Create coach
- `PUT /api/coaches/:id` - Update coach
- `DELETE /api/coaches/:id` - Delete coach

### Health
- `GET /api/health` - API server health
- `GET /health` (Bot Health URL) - Bot health

## 🎨 Customization

### Styling
The application uses Tailwind CSS with a custom design system. Colors and spacing can be customized in:
- `tailwind.config.js` - Tailwind configuration
- `src/index.css` - CSS variables and global styles

### API Configuration
Update the API URLs in `.env` file or modify the defaults in `src/shared/api/client.ts`.

### Refresh Intervals
Adjust polling intervals in the query hooks:
- Users/Sessions: 5 seconds (in `use-users.ts`, `use-sessions.ts`)
- Health: 30 seconds (in `use-health.ts`)
- Prompts/Coaches: No auto-refresh (manual only)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The `dist/` directory will contain the production build.

### Deploy to Netlify/Vercel
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "3000"]
```

## 📝 Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks

### State Management
- Use TanStack Query for server state
- Use Zustand for UI state
- Avoid prop drilling with context when needed
- Keep state as local as possible

### Performance
- Lazy load routes if needed
- Optimize re-renders with React.memo
- Use proper keys in lists
- Debounce expensive operations

## 🐛 Troubleshooting

### API Connection Issues
- Check if the API server is running
- Verify `.env` configuration
- Check browser console for CORS errors

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check TypeScript errors: `npm run type-check`

## 📄 License

MIT

## 👤 Author

Nikita Gorelov

---

**Migrated from vanilla TypeScript to modern React stack for better maintainability, performance, and developer experience.**
