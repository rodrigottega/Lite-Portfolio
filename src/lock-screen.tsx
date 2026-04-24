import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const ACCESS_CODE = "7799";

const LockScreen = ({ onUnlock }: { onUnlock: () => void }) => {
  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    // Always take the last character
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError(false);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every(d => d !== '')) {
      const entered = newCode.join('');
      if (entered === ACCESS_CODE) {
        onUnlock();
      } else {
        setError(true);
        setTimeout(() => {
          setCode(['', '', '', '']);
          inputRefs.current[0]?.focus();
          setError(false);
        }, 800);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      e.preventDefault();
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted) {
      const newCode = ['', '', '', ''];
      for (let i = 0; i < pasted.length; i++) {
        newCode[i] = pasted[i];
      }
      setCode(newCode);
      
      if (pasted.length === 4) {
        if (pasted === ACCESS_CODE) {
          onUnlock();
        } else {
          setError(true);
          setTimeout(() => {
            setCode(['', '', '', '']);
            inputRefs.current[0]?.focus();
            setError(false);
          }, 800);
        }
      } else {
        inputRefs.current[pasted.length]?.focus();
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <i className="ri-lock-2-line" style={styles.icon}></i>
        <h2 style={styles.title}>Protected Portfolio</h2>
        <p style={styles.subtitle}>Please enter the access code.</p>
        
        <div style={styles.inputContainer}>
          {code.map((digit, idx) => (
            <input
              key={idx}
              ref={el => inputRefs.current[idx] = el}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onFocus={handleFocus}
              onPaste={handlePaste}
              style={{
                ...styles.input,
                borderColor: error ? '#FF4D4D' : (digit ? '#181B1F' : '#D5DBE0'),
                boxShadow: error ? '0 0 0 2px rgba(255, 77, 77, 0.2)' : 'none'
              }}
            />
          ))}
        </div>
        <p style={styles.errorText}>{error ? 'Invalid code. Try again.' : ''}</p>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 99999,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '48px',
    backgroundColor: '#FAFBFC',
    border: '1px solid #D5DBE0',
    borderRadius: '24px',
    boxShadow: '0px 10px 24px rgba(137, 150, 163, 0.1)',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center'
  },
  icon: {
    fontSize: '48px',
    color: '#181B1F',
    marginBottom: '16px'
  },
  title: {
    fontFamily: 'Georgia, serif',
    fontSize: '24px',
    color: '#181B1F',
    marginBottom: '8px',
    fontWeight: 400
  },
  subtitle: {
    fontFamily: 'Geist, sans-serif',
    fontSize: '16px',
    color: '#6B7682',
    marginBottom: '32px'
  },
  inputContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px'
  },
  input: {
    width: '56px',
    height: '64px',
    fontSize: '24px',
    textAlign: 'center',
    border: '2px solid #D5DBE0',
    borderRadius: '12px',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    color: '#181B1F',
    backgroundColor: '#FFFFFF',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  },
  errorText: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    color: '#FF4D4D',
    minHeight: '20px',
    fontWeight: 500
  }
};

function initLockScreen() {
  if (sessionStorage.getItem("portfolio-unlocked") === "true") {
    document.documentElement.classList.remove('locked');
    return;
  }

  const rootDiv = document.createElement('div');
  rootDiv.id = 'lock-screen-root';
  document.body.appendChild(rootDiv);

  const handleUnlock = () => {
    sessionStorage.setItem("portfolio-unlocked", "true");
    document.documentElement.classList.remove('locked');
    setTimeout(() => {
      document.body.removeChild(rootDiv);
    }, 50);
  };

  const root = createRoot(rootDiv);
  root.render(<LockScreen onUnlock={handleUnlock} />);
}

if (typeof window !== 'undefined') {
  initLockScreen();
}
