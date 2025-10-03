# Quick Start Guide

Get up and running with WLNX Control Panel React in 5 minutes!

## 🚀 Prerequisites

- Node.js 20+ installed
- npm or yarn package manager
- WLNX API server running (optional for demo mode)

## 📦 Installation

```bash
# Navigate to project directory
cd wlnx-control-panel-react

# Install dependencies (already done)
npm install
```

## ⚙️ Configuration

The application is pre-configured with default settings. To customize:

```bash
# Copy environment template (optional)
cp .env.example .env

# Edit .env file
# VITE_API_URL=http://localhost:3000
# VITE_BOT_HEALTH_URL=http://localhost:3002
```

## 🎯 Start Development Server

```bash
# Start the dev server
npm run dev

# Server will start at http://localhost:3001
# (Port 3000 was in use, so Vite chose 3001)
```

## 🌐 Access the Application

Open your browser and navigate to:
- **Local**: http://localhost:3001
- **Network**: http://192.168.1.149:3001 (accessible from other devices)

## 🎨 What You'll See

### Dashboard (Default Page)
- **Users List** - All users with session counts
- **Click a user** - Opens sessions panel on the right
- **Click a session** - Opens session details panel
- **Delete buttons** - Remove sessions (hover to see)

### Prompts Configuration
- Click "Prompts" in the navigation
- **Stages** - Conversation stages for the bot
- **Prompts** - Individual prompts per stage
- **Add/Edit/Delete** - Full CRUD operations

### Coaches Configuration
- Click "Coaches" in the navigation
- **Coach Profiles** - Manage coach information
- **Prompt Content** - Configure coach prompts
- **Active Toggle** - Enable/disable coaches

### Health Status
- Top right corner shows:
  - **API Server** - Green = online, Red = offline
  - **Bot** - Green = online, Red = offline
- Click to manually refresh status

## 🔧 Common Tasks

### Refresh All Data
Click the refresh icon (↻) in the top right corner

### Close Panels
- Click the X button
- Press ESC key
- Click outside the panel

### View Session Details
1. Click a user in the dashboard
2. Sessions panel opens
3. Click a session
4. Details panel opens with full information

### Manage Prompts
1. Go to Prompts page
2. Click "Add Stage" to create a stage
3. Click "Add Prompt" to create a prompt
4. Click edit icon to modify
5. Click eye icon to toggle active/inactive
6. Click trash icon to delete

### Manage Coaches
1. Go to Coaches page
2. Click "Add Coach"
3. Fill in name, description, and prompt content
4. Click "Save"
5. Edit or delete as needed

## 🐛 Troubleshooting

### API Server Not Running
- The app will show "Offline" status
- Demo data will be displayed (if implemented)
- Some features may not work

### Port Already in Use
- Vite will automatically choose another port
- Check the terminal output for the actual port

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

### TypeScript Errors
```bash
# Run type check
npm run type-check

# Check for errors in IDE
```

## 📱 Mobile Access

The application is fully responsive:
1. Find your network IP in terminal output
2. Open http://YOUR_IP:3001 on mobile device
3. Make sure you're on the same network

## 🔥 Hot Features to Try

1. **Auto-refresh** - Data updates every 5 seconds automatically
2. **Keyboard shortcuts** - Press ESC to close panels
3. **Optimistic updates** - UI updates instantly before API response
4. **Query devtools** - See all API calls in the bottom-left panel
5. **Responsive design** - Resize browser to see mobile layout

## 🎓 Learning the Codebase

### Key Files to Explore
```
src/
├── app/App.tsx                    # Start here
├── features/users/                # Users feature
├── shared/api/client.ts           # API client
├── shared/store/ui-store.ts       # UI state
└── ui/                            # Reusable components
```

### Adding a New Feature
1. Create folder in `src/features/your-feature/`
2. Add API hooks in `api/use-your-feature.ts`
3. Create components in `components/`
4. Add route in `src/app/router.tsx`
5. Add navigation in `src/shared/components/layout.tsx`

## 📚 Next Steps

- Read [README.md](./README.md) for full documentation
- Check [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) to understand the architecture
- Review [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for details

## 🆘 Need Help?

- Check browser console for errors
- Check terminal for server errors
- Review TypeScript errors in IDE
- Check API server is running
- Verify environment variables

## 🎉 You're Ready!

The application is now running and ready to use. Explore the features, modify the code, and build something amazing!

---

**Happy coding! 🚀**
