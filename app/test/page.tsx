export default function TestPage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Test Page - Static Content</h1>
      <p>If you can see this, Next.js is working!</p>
      <p>Time: {new Date().toISOString()}</p>
      <a href="/dashboard" style={{ color: 'blue', textDecoration: 'underline' }}>
        Go to Dashboard
      </a>
    </div>
  );
}