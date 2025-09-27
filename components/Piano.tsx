"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import PianoKey from "./PianoKey"
import { happinessAnthem, marioBrosTheme, pokemonBattleTheme } from "../lib/songs"

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
const octaves = [3, 4, 5]
const audioContext =
  typeof window !== "undefined" ? new (window.AudioContext || (window as any).webkitAudioContext)() : null

// Piano note frequencies (A4 = 440Hz as reference)
const getFrequency = (note: string) => {
  const [noteName, octaveStr] = [note.slice(0, -1), note.slice(-1)]
  const octave = Number.parseInt(octaveStr)

  if (isNaN(octave)) return 440 // Return A4 as fallback

  const noteIndex = notes.indexOf(noteName)
  if (noteIndex === -1) return 440 // Return A4 as fallback

  // Calculate semitones from A4 (A4 = 440Hz)
  const A4Index = notes.indexOf("A")
  const semitonesDiff = noteIndex - A4Index + (octave - 4) * 12

  // Calculate frequency using equal temperament formula
  return 440 * Math.pow(2, semitonesDiff / 12)
}

export default function Piano() {
  const [activeKeys, setActiveKeys] = useState<string[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState<string[]>([])

  const playNote = useCallback((note: string) => {
    if (!audioContext) return

    // Create audio components
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    const compressor = audioContext.createDynamicsCompressor()

    // Configure compressor for better piano-like sound
    compressor.threshold.setValueAtTime(-24, audioContext.currentTime)
    compressor.knee.setValueAtTime(30, audioContext.currentTime)
    compressor.ratio.setValueAtTime(12, audioContext.currentTime)
    compressor.attack.setValueAtTime(0.003, audioContext.currentTime)
    compressor.release.setValueAtTime(0.25, audioContext.currentTime)

    // Configure oscillator
    oscillator.type = "triangle" // Use triangle wave for more piano-like sound
    oscillator.frequency.setValueAtTime(getFrequency(note), audioContext.currentTime)

    // Configure envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.7, audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5)

    // Connect audio nodes
    oscillator.connect(gainNode)
    gainNode.connect(compressor)
    compressor.connect(audioContext.destination)

    // Start and stop the note
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 1.5)

    setActiveKeys((prev) => [...prev, note])
    setTimeout(() => setActiveKeys((prev) => prev.filter((key) => key !== note)), 200)
  }, [])

  const playSong = useCallback(
    (song: string[], speed = 200) => {
      setIsPlaying(true)
      setCurrentSong(song)
      song.forEach((note, index) => {
        setTimeout(() => {
          if (note !== " ") playNote(note)
          if (index === song.length - 1) {
            setIsPlaying(false)
            setCurrentSong([])
          }
        }, index * speed)
      })
    },
    [playNote],
  )

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()
      if (notes.includes(key)) {
        playNote(key + "4")
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [playNote])

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="w-full flex flex-wrap justify-center">
        {octaves.map((octave) =>
          notes.map((note) => (
            <PianoKey
              key={`${note}${octave}`}
              note={`${note}${octave}`}
              isActive={activeKeys.includes(`${note}${octave}`)}
              onClick={() => playNote(`${note}${octave}`)}
              isSharp={note.includes("#")}
            />
          )),
        )}
      </div>
      <div className="flex space-x-4 flex-wrap justify-center">
        <Button onClick={() => playSong(happinessAnthem, 300)} disabled={isPlaying}>
          <Play className="mr-2 h-4 w-4" /> Play Happiness Anthem
        </Button>
        <Button onClick={() => playSong(marioBrosTheme)} disabled={isPlaying}>
          <Play className="mr-2 h-4 w-4" /> Play Mario Bros Theme
        </Button>
        <Button onClick={() => playSong(pokemonBattleTheme, 125)} disabled={isPlaying}>
          <Play className="mr-2 h-4 w-4" /> Play Pokémon Battle Theme
        </Button>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: isPlaying ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="text-sm text-gray-500"
      >
        Now playing:{" "}
        {isPlaying
          ? currentSong === happinessAnthem
            ? "Happiness Anthem"
            : currentSong === marioBrosTheme
              ? "Mario Bros Theme"
              : "Pokémon Battle Theme"
          : ""}
      </motion.p>
    </div>
  )
}
