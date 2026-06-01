import { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number; // ms per character
  className?: string;
  onComplete?: () => void;
}

export function Typewriter({
  text,
  speed = 20,
  className = '',
  onComplete,
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const textRef = useRef(text);
  const onCompleteRef = useRef(onComplete);

  // Update refs to avoid re-triggering effects
  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setDisplayedText('');
    setIsFinished(false);
    let index = 0;
    const currentText = text;

    if (!currentText) {
      setIsFinished(true);
      onCompleteRef.current?.();
      return;
    }

    const interval = setInterval(() => {
      index++;
      setDisplayedText(currentText.slice(0, index));

      if (index >= currentText.length) {
        clearInterval(interval);
        setIsFinished(true);
        onCompleteRef.current?.();
      }
    }, speed);

    return () => {
      clearInterval(interval);
    };
  }, [text, speed]);

  // Allow clicking the text to bypass the typewriter effect and show immediately
  const handleBypass = () => {
    if (!isFinished) {
      setDisplayedText(text);
      setIsFinished(true);
      onCompleteRef.current?.();
    }
  };

  return (
    <div
      onClick={handleBypass}
      className={`cursor-pointer select-none font-mono ${className}`}
      title="Click to skip typewriter animation"
    >
      <span>{displayedText}</span>
      {!isFinished && (
        <span className="inline-block w-2.5 h-4 ml-1 bg-hud-cyan animate-blink align-middle" />
      )}
    </div>
  );
}
