
export default function WaveBarSpinner({ text = 'Loading Items...' }) {
  
  const bars = Array.from({ length: 6 });

  return (
    <div style={styles.container}>
      
      <div style={styles.barWrapper}>
        {bars.map((_, index) => (
          <div
            key={index}
            className="animate-wave-bar"
            style={{
              ...styles.bar,
            
              animationDelay: `${-1.2 + (index * 0.15)}s`
            }}
          />
        ))}
      </div>

      
      {text && (
        <p className="animate-pulse" style={styles.loadingText}>
          {text}
        </p>
      )}
    </div>
  );
}


const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    backgroundColor: 'transparent'
  },
  barWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: '6px',
    windth:'30px',
    height: '60px',
    marginBottom: '1rem'
  },
  bar: {
    width: '8px',
    height: '40px',
    backgroundColor: '#1e00ff',
    borderRadius: '9999px',
  },
  loadingText: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#2563eb',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    fontFamily: 'monospace',
    marginTop: '0.5rem'
  }
};