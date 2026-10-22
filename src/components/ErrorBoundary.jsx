import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Portfolio ErrorBoundary]', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
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
          fontFamily: 'Inter, sans-serif'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 500 }}>
            Terjadi kendala saat memuat tampilan
          </h2>
          <p style={{ color: '#a1a1aa', maxWidth: 460, marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Halaman mengalami kendala teknis saat memuat komponen. Silakan muat ulang halaman.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: '0.65rem 1.5rem',
              backgroundColor: '#f4f4f5',
              color: '#121214',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Muat Ulang Halaman
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
