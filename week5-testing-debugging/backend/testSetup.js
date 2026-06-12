// Backend Test Initialization Setup
process.env.NODE_ENV = 'test';
process.env.PORT = '4000'; // Isolate testing port
process.env.JWT_SECRET = 'cyber-placement-secure-crypt-key-2026';

// Prevent connecting to real database by ensuring NO MySQL host is declared in testing
delete process.env.DB_HOST;
delete process.env.DB_USER;
delete process.env.DB_PASSWORD;

console.log('[Jest Setup] Test environment variables loaded. Fallback Database mode active.');
