'use client'
import { useVideoTrack, useAudioTrack } from '@daily-co/daily-react'
import { useEffect, useRef } from 'react'

export function VideoTile({ sessionId, isLocal }: { sessionId: string, isLocal?: boolean }) {
  const videoState = useVideoTrack(sessionId)
  const audioState = useAudioTrack(sessionId)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (videoRef.current && videoState.videoTrack) {
      videoRef.current.srcObject = new MediaStream([videoState.videoTrack])
    }
  }, [videoState.videoTrack])

  useEffect(() => {
    if (audioRef.current && audioState.audioTrack && !isLocal) {
      audioRef.current.srcObject = new MediaStream([audioState.audioTrack])
    }
  }, [audioState.audioTrack, isLocal])

  if (videoState.state === 'loading') {
    return (
      <div className="w-full h-full min-h-[300px] bg-slate-900 animate-pulse rounded-2xl flex items-center justify-center text-slate-400 border border-slate-800">
        Kutilyapti...
      </div>
    )
  }

  return (
    <div className="relative w-full h-full min-h-[300px] bg-black rounded-2xl overflow-hidden shadow-lg border border-slate-800">
      <video 
        ref={videoRef} 
        autoPlay 
        muted={isLocal} 
        playsInline 
        className={`w-full h-full object-cover ${isLocal ? 'transform scale-x-[-1]' : ''}`} 
      />
      {!isLocal && <audio ref={audioRef} autoPlay />}
      
      {!videoState.videoTrack && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-slate-400">
          Kamera o&apos;chirilgan
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-md text-white text-sm backdrop-blur-md shadow-sm border border-white/10">
        {isLocal ? 'Siz' : 'Sherik'}
      </div>
    </div>
  )
}
