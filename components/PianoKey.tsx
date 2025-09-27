import { motion } from "framer-motion"

interface PianoKeyProps {
  note: string
  isActive: boolean
  onClick: () => void
  isSharp: boolean
}

export default function PianoKey({ note, isActive, onClick, isSharp }: PianoKeyProps) {
  return (
    <motion.div
      className={`
        ${isSharp ? "w-8 h-32 bg-black text-white -mx-4 z-10" : "w-12 h-48 bg-white"} 
        border border-gray-300 flex items-end justify-center pb-2 cursor-pointer
      `}
      animate={{
        backgroundColor: isActive
          ? isSharp
            ? "rgb(134, 239, 172)"
            : "rgb(187, 247, 208)"
          : isSharp
            ? "rgb(0, 0, 0)"
            : "rgb(255, 255, 255)",
      }}
      transition={{ duration: 0.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {note.replace("#", "♯")}
    </motion.div>
  )
}
