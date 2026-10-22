import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Portfolio ErrorBoundary]', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleClearCacheAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (_e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const errorMsg = this.state.error?.message || String(this.state.error || 'Unknown error');

      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0c',
          color: '#e4e4e7',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'Inter, -apple-system, sans-serif'
        }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', fontWeight: 600 }}>
            Terjadi kendala saat memuat halaman
          </h2>
          <p style={{ color: '#a1a1aa', maxWidth: 480, marginBottom: '1.25rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Aplikasi mengalami kendala teknis saat me-render komponen. Coba bersihkan cache lokal browser atau muat ulang halaman.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <button
              onClick={this.handleClearCacheAndReload}
              style={{
                padding: '0.65rem 1.25rem',
                backgroundColor: '#ffffff',
                color: '#0a0a0c',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              Bersihkan Cache & Muat Ulang
            </button>
            <button
              onClick={this.handleReload}
              style={{
                padding: '0.65rem 1.25rem',
                backgroundColor: '#27272a',
                color: '#f4f4f5',
                border: '1px solid #3f3f46',
                borderRadius: '4px',
                fontWeight: 500,
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              Muat Ulang Biasa
            </button>
          </div>

          <details style={{ textAlign: 'left', maxWidth: 640, width: '100%', background: '#121214', border: '1px solid #27272a', borderRadius: '4px', padding: '0.75rem 1rem' }}>
            <summary style={{ cursor: 'pointer', color: '#71717a', fontSize: '0.8rem', userSelect: 'none' }}>
              Detail Kendala Teknis
            </summary>
            <pre style={{
              marginTop: '0.5rem',
              color: '#f87171',
              fontSize: '0.75rem',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontFamily: 'monospace'
            }}>
              {errorMsg}
              {this.state.error?.stack ? `\n\n${this.state.error.stack}` : ''}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
