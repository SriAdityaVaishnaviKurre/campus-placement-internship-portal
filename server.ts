import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Routes and Middleware Imports
import authRoutes from './backend/routes/authRoutes';
import userRoutes from './backend/routes/userRoutes';
import jobRoutes from './backend/routes/jobRoutes';
import applicationRoutes from './backend/routes/applicationRoutes';
import { errorHandler } from './backend/middleware/errorMiddleware';

dotenv.config();

export async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Enable CORS & JSON Parsing
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // --- API Routes Registration ---
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/applications', applicationRoutes);

  // Health and connection check
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      time: new Date().toISOString(),
      databaseMode: process.env.DB_HOST ? 'MySQL Connected' : 'Mock In-Memory DB Mode Cache'
    });
  });

  // --- Vite Hot Module integration for Dev, and Static serving for production ---
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Express Server] Mounting Vite development live middleware mode...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('[Express Server] Initializing production static asset configurations...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // --- Registry of central Error Middleware ---
  app.use(errorHandler);

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Express Server] Server running on port ${PORT}`);
    console.log(`[Express Server] Local access url: http://localhost:${PORT}`);
  });

  return { app, server };
}

// Automatically boot server if module loaded directly (not in standard test runner)
if (process.env.NODE_ENV !== 'test') {
  startServer().catch((err) => {
    console.error('[Error] Server starting failed:', err);
  });
}
