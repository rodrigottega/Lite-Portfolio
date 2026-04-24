import React, { useState, useEffect } from 'react';

const IMAGES_TO_PRELOAD = [
  'https://cdn.jsdelivr.net/gh/rodrigottega/assets@main/comp_CLink%E2%84%A2%20End%20Users%20Experience.png',
  'https://cdn.jsdelivr.net/gh/rodrigottega/assets@main/fixed_comp_Desktop%20Platform.png',
  'https://cdn.jsdelivr.net/gh/rodrigottega/assets@main/comp_Advanced.png',
  'https://cdn.jsdelivr.net/gh/rodrigottega/assets@main/comp_Basic.png',
  'https://cdn.jsdelivr.net/gh/rodrigottega/assets@main/comp_Voice.png',
  'https://cdn.jsdelivr.net/gh/rodrigottega/assets@main/comp_New%20Conv.png',
  'https://cdn.jsdelivr.net/gh/rodrigottega/assets@main/Advanced%20AI%20Agent%20Configuration.png',
  'https://cdn.jsdelivr.net/gh/rodrigottega/assets@main/Basic%20AI%20Agent%20Configuration.png',
  'https://cdn.jsdelivr.net/gh/rodrigottega/assets@main/Voice%20AI%20Agent%20Configuration.png',
  'https://cdn.jsdelivr.net/gh/rodrigottega/assets@main/New%20Conversations%20Sending%20Flow.png'
];

export const LoadingScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    let isFinished = false;
    let imagesDone = false;
    let timeDone = false;
    let loaded = 0;
    
    let animationFrameId: number;
    const startTime = Date.now();
    const MIN_TIME = 4000;
    const MAX_TIME = 5000;

    const finish = () => {
      if (!isFinished) {
        isFinished = true;
        setDisplayProgress(100);
        setTimeout(onFinish, 150);
      }
    };

    const updateProgress = () => {
      if (isFinished) return;
      const elapsed = Date.now() - startTime;
      
      // Calculate progress that smoothly reaches 99% over MIN_TIME
      let targetProgress = Math.min(99, Math.floor((elapsed / MIN_TIME) * 100));
      setDisplayProgress(targetProgress);

      if (elapsed < MIN_TIME) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        timeDone = true;
        if (imagesDone) {
          finish();
        } else {
          animationFrameId = requestAnimationFrame(updateProgress);
        }
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    const maxTimeout = setTimeout(() => {
      finish();
    }, MAX_TIME);

    IMAGES_TO_PRELOAD.forEach(src => {
      const img = new Image();
      const handleImageDone = () => {
        loaded++;
        if (loaded === IMAGES_TO_PRELOAD.length) {
          imagesDone = true;
          if (timeDone) {
            finish();
          }
        }
      };
      
      img.onload = handleImageDone;
      img.onerror = handleImageDone;
      img.src = src;
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(maxTimeout);
    };
  }, [onFinish]);

  return (
    <div style={styles.container}>
      <div style={styles.avatarWrapper}>
        <div style={styles.bubble}>
          <span style={styles.bubbleText}>Let me show you how I work 😎...</span>
        </div>
        <img 
          src="https://cdn.jsdelivr.net/gh/rodrigottega/assets@main/avatar_me.png" 
          alt="Avatar" 
          style={styles.avatar} 
        />
      </div>

      <div style={styles.progressBarContainer}>
        <div style={styles.labelWrapper}>
          <span style={styles.labelLeft}>Almost there...</span>
          <span style={styles.labelRight}>{displayProgress}%</span>
        </div>
        <div style={styles.progressBarTrack}>
          <div 
            style={{
              ...styles.progressBarFill,
              width: `${displayProgress}%`
            }}
          />
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    inset: 0,
    backgroundColor: '#181B1F',
    zIndex: 99999,
    gap: '32px'
  },
  avatarWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '124px',
    height: '124px',
  },
  avatar: {
    width: '124px',
    height: '124px',
    borderRadius: '50%',
    objectFit: 'cover',
    backgroundColor: '#FFFFFF',
    zIndex: 0
  },
  bubble: {
    position: 'absolute',
    left: '97px',
    top: '-14px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '12px 8px',
    gap: '10px',
    width: '137px',
    height: '64px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px 8px 8px 0px',
    zIndex: 1,
    boxSizing: 'border-box'
  },
  bubbleText: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '20px',
    color: '#181B1F',
    textAlign: 'center'
  },
  progressBarContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '8px',
    width: '288px',
  },
  labelWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  labelLeft: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '14px',
    color: '#E9EDF2'
  },
  labelRight: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '12px',
    color: '#BEC5CC'
  },
  progressBarTrack: {
    position: 'relative',
    width: '100%',
    height: '4px',
    backgroundColor: '#353B42',
    borderRadius: '9999px',
    overflow: 'hidden'
  },
  progressBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: '9999px',
    transition: 'width 0.2s ease-out'
  }
};
