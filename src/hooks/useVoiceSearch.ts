import { useState, useCallback, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

export type VoiceSearchState = 'idle' | 'listening' | 'processing' | 'done' | 'error';

interface UseVoiceSearchReturn {
  state: VoiceSearchState;
  transcript: string;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  clearTranscript: () => void;
  speak: (text: string) => Promise<void>;
}

/**
 * Custom hook for voice search functionality
 * Note: This is a mock implementation. In production, integrate with:
 * - expo-speech for text-to-speech
 * - expo-av for audio recording
 * - A speech-to-text service (Google Speech-to-Text, Azure Speech, etc.)
 */
export const useVoiceSearch = (): UseVoiceSearchReturn => {
  const [state, setState] = useState<VoiceSearchState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(console.error);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const startListening = useCallback(async () => {
    try {
      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        setState('error');
        return;
      }

      // Set audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      setState('listening');
      setTranscript('');

      // Mock: In production, start actual recording
      // For now, simulate with a timeout
      timeoutRef.current = setTimeout(() => {
        // Simulate receiving transcript after 3 seconds
        setState('processing');
        
        // Mock transcript - in production, this would come from speech-to-text API
        setTimeout(() => {
          const mockTranscripts = [
            'Search for groundnut oil',
            'Show me electronics',
            'Find fashion items',
            'I want to buy shoes',
          ];
          const randomTranscript = mockTranscripts[
            Math.floor(Math.random() * mockTranscripts.length)
          ];
          
          setTranscript(randomTranscript);
          setState('done');
          
          // Auto-reset to idle after 2 seconds
          setTimeout(() => {
            setState('idle');
          }, 2000);
        }, 1000);
      }, 3000);

      // In production, start actual recording:
      // const { recording } = await Audio.Recording.createAsync(
      //   Audio.RecordingOptionsPresets.HIGH_QUALITY
      // );
      // recordingRef.current = recording;
    } catch (error) {
      console.error('Error starting voice recording:', error);
      setState('error');
    }
  }, []);

  const stopListening = useCallback(async () => {
    try {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        recordingRef.current = null;
      }

      if (state === 'listening' || state === 'processing') {
        setState('processing');
        
        // In production, process the recorded audio here
        // For mock, simulate processing
        setTimeout(() => {
          setState('done');
          setTimeout(() => {
            setState('idle');
          }, 2000);
        }, 1000);
      }
    } catch (error) {
      console.error('Error stopping voice recording:', error);
      setState('error');
    }
  }, [state]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setState('idle');
  }, []);

  const speak = useCallback(async (text: string) => {
    try {
      await Speech.speak(text, {
        language: 'en',
        pitch: 1.0,
        rate: 1.0,
      });
    } catch (error) {
      console.error('Error speaking text:', error);
    }
  }, []);

  return {
    state,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
    speak,
  };
};



