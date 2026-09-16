/**
 * Centralized API base URL configuration:
 * - Development: defaults to http://localhost:5000
 * - Production (Vercel): defaults to '' (same-origin relative /api routes)
 * - Can be overridden via VITE_API_URL environment variable
 */
export const API_BASE = (import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== '')
  ? import.meta.env.VITE_API_URL
  : (import.meta.env.PROD ? '' : 'http://localhost:5000');
