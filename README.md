# StarGrad - All-in-One Utility App

A modern React application built with Vite, Supabase, and Tailwind CSS, featuring multiple productivity tools including password generation, time tracking, and budget management.

## 🚀 Features

- **Password Generator**: Create secure passwords with customizable options
- **Time Tracker**: Track work sessions with detailed logging
- **Budget Dashboard**: Manage accounts and track financial transactions
- **User Authentication**: Secure login/signup with Supabase
- **Responsive Design**: Beautiful UI that works on all devices

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (Authentication, Database)
- **Animation**: Framer Motion
- **Icons**: React Icons
- **Routing**: React Router DOM

## ⚡ Performance Optimizations

This project includes several performance optimizations:

### Bundle Optimizations
- **Code Splitting**: Vendor, Supabase, icons, and animation libraries are split into separate chunks
- **Tree Shaking**: Unused code is automatically removed during build
- **Minification**: Production builds are minified with Terser
- **Console Removal**: Console logs are stripped from production builds

### React Optimizations
- **Memoized Context**: AuthContext uses `useMemo` to prevent unnecessary re-renders
- **Reusable Components**: Common UI patterns extracted into reusable components
- **Lazy Loading**: Components can be easily converted to lazy-loaded modules

### Code Quality
- **Error Boundaries**: Proper error handling throughout the application
- **TypeScript Ready**: Project structure supports easy TypeScript migration
- **ESLint Configuration**: Consistent code style and error prevention

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SalihEfehanDemir/StarGrad.git
   cd StarGrad
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase Database**
   
   Create the following tables in your Supabase project:

   **Accounts Table:**
   ```sql
   CREATE TABLE accounts (
     id SERIAL PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id),
     name TEXT NOT NULL,
     type TEXT NOT NULL,
     balance NUMERIC DEFAULT 0,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

   **Transactions Table:**
   ```sql
   CREATE TABLE transactions (
     id SERIAL PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id),
     account_id INTEGER REFERENCES accounts(id),
     title TEXT NOT NULL,
     subtitle TEXT,
     amount NUMERIC NOT NULL,
     date TIMESTAMP DEFAULT NOW(),
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

   **Enable Row Level Security (RLS):**
   ```sql
   ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
   ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

   -- Accounts policies
   CREATE POLICY "Users can view own accounts" ON accounts FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert own accounts" ON accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own accounts" ON accounts FOR UPDATE USING (auth.uid() = user_id);

   -- Transactions policies  
   CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own transactions" ON transactions FOR UPDATE USING (auth.uid() = user_id);
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:analyze` - Build with bundle analysis
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run clean` - Clean build artifacts and cache

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/             # Custom React hooks
├── layouts/           # Layout components
├── pages/             # Page components
│   ├── home/         # Homepage
│   └── tools/        # Tool pages
├── constants/         # App constants and configuration
└── supabaseClient.js  # Supabase configuration
```

## 🎨 Customization

### Styling
The app uses Tailwind CSS with custom color scheme defined in `tailwind.config.js`. Key colors:
- Primary Blue: `#3b82f6`
- Cyan: `#06b6d4` 
- Amber: `#eab308`
- Dark Background: `#0e0e10`

### Adding New Tools
1. Create a new component in `src/pages/tools/`
2. Add the route to `src/App.jsx`
3. Update the tools array in `src/pages/home/HomePage.jsx`

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure environment variables in Netlify dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [React Icons](https://react-icons.github.io/react-icons/) for the icon library 