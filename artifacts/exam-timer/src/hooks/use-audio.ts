import { useRef, useCallback, useEffect } from 'react';
import { SoundId, getSoundOption } from '@/lib/sound-library';

export function useAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const htmlAudioRef = useRef<HTMLAudioElement | null>(null);

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  const playTone = useCallback(
    (frequency: number, type: OscillatorType, duration: number, startTimeOffset = 0) => {
      if (!audioContextRef.current) return;
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime + startTimeOffset);

      gain.gain.setValueAtTime(0, ctx.currentTime + startTimeOffset);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + startTimeOffset + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTimeOffset + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startTimeOffset);
      osc.stop(ctx.currentTime + startTimeOffset + duration);
    },
    [],
  );

  const playChime = useCallback(() => {
    initAudio();
    playTone(880, 'sine', 0.5);
  }, [initAudio, playTone]);

  const playHighBell = useCallback(() => {
    initAudio();
    playTone(10000, 'sine', 0.35, 0);
    playTone(10000, 'sine', 0.35, 0.18);
  }, [initAudio, playTone]);

  const playDoubleBell = useCallback(() => {
    initAudio();
    playTone(660, 'sine', 0.6, 0);
    playTone(990, 'sine', 0.8, 0.2);
  }, [initAudio, playTone]);

  const playFile = useCallback((src: string) => {
    try {
      // Stop any currently playing preview to avoid overlap
      if (htmlAudioRef.current) {
        htmlAudioRef.current.pause();
        htmlAudioRef.current.currentTime = 0;
      }
      const audio = new Audio(src);
      audio.volume = 0.9;
      htmlAudioRef.current = audio;
      void audio.play().catch(() => {
        /* autoplay restrictions — user must interact first */
      });
    } catch {
      // ignore
    }
  }, []);

  const stopFile = useCallback(() => {
    if (htmlAudioRef.current) {
      htmlAudioRef.current.pause();
      htmlAudioRef.current.currentTime = 0;
    }
  }, []);

  const playSound = useCallback(
    (sound: SoundId) => {
      const opt = getSoundOption(sound);
      if (opt.kind === 'file' && opt.src) {
        playFile(opt.src);
        return;
      }
      if (sound === 'highBell') playHighBell();
      else if (sound === 'doubleBell') playDoubleBell();
      else playChime();
    },
    [playChime, playHighBell, playDoubleBell, playFile],
  );

  useEffect(() => {
    const handleInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [initAudio]);

  return { playChime, playHighBell, playDoubleBell, playSound, stopFile, initAudio };
}
