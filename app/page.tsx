export default function HomePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        VistaFeed AI
      </h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '3rem', color: '#6b7280' }}>
        Your AI-Powered YouTube Companion
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', maxWidth: '600px', width: '100%', padding: '0 1rem' }}>
        <a href="/test" style={{
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          textAlign: 'center',
          textDecoration: 'none',
          color: '#1f2937',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧪</div>
          <div style={{ fontWeight: '600' }}>Test Page</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Basic functionality test</div>
        </a>
        
        <a href="/api/health" style={{
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          textAlign: 'center',
          textDecoration: 'none',
          color: '#1f2937',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏥</div>
          <div style={{ fontWeight: '600' }}>API Health</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Check API status</div>
        </a>
        
        <a href="/simple-dashboard" style={{
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          textAlign: 'center',
          textDecoration: 'none',
          color: '#1f2937',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
          <div style={{ fontWeight: '600' }}>Simple Dashboard</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Basic dashboard view</div>
        </a>
        
        <a href="/dashboard" style={{
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          textAlign: 'center',
          textDecoration: 'none',
          color: '#1f2937',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚀</div>
          <div style={{ fontWeight: '600' }}>Full Dashboard</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Complete experience</div>
        </a>
      </div>
      
      <div style={{ marginTop: '3rem', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', maxWidth: '600px' }}>
        <p style={{ color: '#92400e', fontSize: '0.875rem' }}>
          ⚠️ Note: Some features may not work due to database configuration issues. The API is functional at /api/health.
        </p>
      </div>
    </div>
  );
}