# 🎵 MusicNest

<div align="center">

**Your Personal Music Hub**

A modern, offline-first music player built with React, TypeScript, and IndexedDB.  
Import, organize, and play your music collection - all in your browser!

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3+-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4+-646cff.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## ✨ Features

### 🎼 Music Management
- **Import Local Files**: Support for MP3, WAV, FLAC, OGG, M4A, AAC, WMA
- **Video Support**: Play MP4, MKV, AVI, WebM, MOV, WMV files
- **Smart Organization**: Automatically parses metadata from filenames
- **Playlists**: Create and manage custom playlists
- **Library Search**: Quickly find tracks by title, artist, or album

### 🎨 User Experience
- **Multiple Profiles**: Support for multiple user accounts
- **Theme Customization**: Dark/Light/System themes with purple, blue, and green accents
- **Responsive Design**: Seamless experience on desktop, tablet, and mobile
- **Offline-First**: Works completely offline with PWA support
- **Keyboard Shortcuts**: Quick controls for power users

### 🎵 Player Features
- **Full-Screen Player**: Immersive playback experience
- **Mini Player**: Compact controls while browsing
- **Playback Controls**: Play, pause, next, previous, shuffle, repeat
- **Volume Control**: Adjust volume with visual feedback
- **Sleep Timer**: Auto-stop playback after a set time
- **Track Queue**: View and manage your playback queue

### 🔒 Privacy & Security
- **100% Local**: All data stays on your device
- **No Cloud**: No external servers or data uploads
- **IndexedDB**: Efficient local storage for files and metadata

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ or **Bun** 1.0+
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/music-nest.git
   cd music-nest
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install

   # Using bun
   bun install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Open in browser**
   ```
   http://localhost:8080
   ```

### Building for Production

```bash
npm run build
# or
bun run build
```

The built files will be in the `dist/` directory.

---

## 🏗️ Tech Stack

### Core
- **React 18.3** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 5.4** - Build tool and dev server

### State Management
- **Zustand** - Lightweight state management
- **Dexie.js** - IndexedDB wrapper for data persistence

### UI & Styling
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - Beautiful, accessible components
- **Radix UI** - Unstyled, accessible primitives
- **Framer Motion** - Smooth animations
- **Lucide React** - Icon library

### Features
- **React Router** - Client-side routing
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Development
- **Vitest** - Unit testing
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 📁 Project Structure

```
music-nest/
├── src/
│   ├── components/          # React components
│   │   ├── layout/         # Layout components (Sidebar, Header, etc.)
│   │   ├── player/         # Player components (MiniPlayer, FullScreenPlayer)
│   │   ├── views/          # Page views (Home, Library, Playlists, etc.)
│   │   ├── ui/             # Reusable UI components (shadcn/ui)
│   │   ├── ErrorBoundary.tsx
│   │   └── MusicApp.tsx    # Main app component
│   ├── hooks/              # Custom React hooks
│   │   ├── useAudioPlayer.ts
│   │   ├── useLocalMusic.ts
│   │   └── use-toast.ts
│   ├── stores/             # Zustand stores
│   │   ├── playerStore.ts
│   │   ├── trackStore.ts
│   │   ├── playlistStore.ts
│   │   ├── settingsStore.ts
│   │   └── userStore.ts
│   ├── lib/                # Utilities and helpers
│   │   ├── database.ts     # IndexedDB operations
│   │   └── utils.ts
│   ├── types/              # TypeScript type definitions
│   │   └── music.ts
│   ├── constants/          # App constants
│   │   └── index.ts
│   ├── test/               # Test setup and utilities
│   └── main.tsx            # App entry point
├── public/                 # Static assets
├── .env.example            # Environment variables template
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🧪 Testing

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## 📴 Offline Mode

MusicNest is built as a **Progressive Web App (PWA)** with full offline support.

### How It Works

1. **First Visit**: The app caches all necessary files (HTML, CSS, JS, fonts, icons)
2. **Import Music**: Your music files are stored in IndexedDB as Blob objects
3. **Offline Access**: Once cached, the app works 100% offline - no internet required
4. **Automatic Sync**: When online, the app checks for updates automatically

### Offline Features

✅ **Full Music Playback** - All imported songs work offline  
✅ **Library Management** - Browse, search, organize your music  
✅ **Playlists** - Create and edit playlists offline  
✅ **Settings** - All app settings persist offline  
✅ **User Profiles** - Switch between accounts offline  

### Visual Indicators

- **🟢 Online**: Normal operation, can import new files
- **🟠 Offline Badge**: Appears in header when offline
- **Toast Notifications**: Alerts when going offline/online

### Install as App

1. Visit the site in Chrome/Edge/Safari
2. Click the install button in the address bar
3. The app will be installed on your device
4. Launch like a native app - works fully offline!

### Storage

All data is stored locally:
- **IndexedDB**: Music files, metadata, playlists (typically 1-10GB+)
- **Cache Storage**: App resources (typically 5-10MB)
- **LocalStorage**: User preferences, settings (typically <1MB)

💡 **Tip**: Your music files never leave your device. Everything is 100% local and private.

---

## 🎯 Roadmap

- [x] Basic music playback
- [x] Playlist management
- [x] Multiple user profiles
- [x] Theme customization
- [x] PWA support
- [ ] **Search & Filters** - Advanced library search
- [ ] **Lyrics Display** - Show synchronized lyrics
- [ ] **Audio Visualizer** - Visual feedback during playback
- [ ] **Import/Export** - Backup and restore library
- [ ] **Batch Operations** - Multi-select for bulk actions
- [ ] **Equalizer** - Audio EQ controls
- [ ] **Scrobbling** - Last.fm integration
- [ ] **Cover Art** - Automatic album art fetching

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful component library
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Lucide](https://lucide.dev/) for the icon set
- All open-source contributors

---

<div align="center">

**Made with ❤️ by the MusicNest team**

[Report Bug](https://github.com/yourusername/music-nest/issues) · [Request Feature](https://github.com/yourusername/music-nest/issues)

</div>
