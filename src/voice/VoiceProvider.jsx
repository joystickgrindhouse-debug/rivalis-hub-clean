import React, {
  createContext,
  useEffect,
  useState,
  useRef
} from "react"

import { useNavigate, useLocation } from "react-router-dom"

import WakeWordEngine from "./WakeWordEngine"
import createVoiceCommands from "./VoiceCommands"

export const VoiceContext = createContext()

export default function VoiceProvider({ children, userProfile }) {

  const navigate = useNavigate()
  const location = useLocation()

  const synthRef = useRef(window.speechSynthesis)

  const tapCounter = useRef(0)
  const tapTimer = useRef(null)

  const [voiceActive,setVoiceActive] = useState(false)

  const [commandText,setCommandText] = useState("")
  const [commandStatus,setCommandStatus] = useState("")

  const ttsEnabled = userProfile?.ttsEnabled ?? false
  const voiceEnabled = userProfile?.voiceEnabled ?? false

  /* -------------------------
     TEXT TO SPEECH
  ------------------------- */

  const speak = (text)=>{

    if(!ttsEnabled) return
    if(!text) return

    const synth = synthRef.current
    if(!synth) return

    synth.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    utterance.rate = 1
    utterance.pitch = 1
    utterance.volume = 1

    synth.speak(utterance)

  }

  const stop = ()=>{

    const synth = synthRef.current
    if(!synth) return

    synth.cancel()

  }

  /* -------------------------
     INIT COMMAND SYSTEM
  ------------------------- */

  useEffect(()=>{

    const commands = createVoiceCommands(
      navigate,
      setCommandText,
      setCommandStatus,
      { speak, stop }
    )

    WakeWordEngine.init(commands)

  },[navigate])

  /* -------------------------
     WAKE WORD SETTING
  ------------------------- */

  useEffect(()=>{

    if(userProfile?.wakeWord){

      WakeWordEngine.setWakeWord(userProfile.wakeWord)

    }

  },[userProfile])

  /* -------------------------
     START / STOP LISTENER
  ------------------------- */

  useEffect(()=>{

    if(!voiceEnabled){

      WakeWordEngine.stop()
      return

    }

    if(voiceActive){

      WakeWordEngine.start()

    }

    return ()=>WakeWordEngine.stop()

  },[voiceActive,voiceEnabled])

  /* -------------------------
     AUTO SCREEN READER
  ------------------------- */

  useEffect(()=>{

    if(!ttsEnabled) return

    const timeout = setTimeout(()=>{

      const main = document.querySelector("main") || document.body

      if(!main) return

      const text = main.innerText

      if(text){

        speak(text.slice(0,600))

      }

    },700)

    return ()=>clearTimeout(timeout)

  },[location.pathname])

  /* -------------------------
     5 TAP ACTIVATION
  ------------------------- */

  useEffect(()=>{

    const handleTap = (e)=>{

      if(e.clientX < 120 && e.clientY < 120){

        tapCounter.current += 1

        if(tapTimer.current){
          clearTimeout(tapTimer.current)
        }

        tapTimer.current = setTimeout(()=>{

          tapCounter.current = 0

        },1000)

        if(tapCounter.current >= 5){

          setVoiceActive(prev=>!prev)

          tapCounter.current = 0

        }

      }

    }

    window.addEventListener("click",handleTap)

    return ()=>window.removeEventListener("click",handleTap)

  },[])

  /* -------------------------
     CONTEXT
  ------------------------- */

  return(

    <VoiceContext.Provider
      value={{

        voiceActive,
        commandText,
        commandStatus,

        speak,
        stop

      }}
    >

      {children}

    </VoiceContext.Provider>

  )

}
