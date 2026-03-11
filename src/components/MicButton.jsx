import React from "react"
import { startListening } from "../voice/VoiceController"
import handleVoiceCommand from "../voice/CommandRouter"

export default function MicButton(){

  function speak(){

    startListening(handleVoiceCommand)

  }

  return(

    <button
      onClick={speak}
      style={{
        position:"fixed",
        bottom:20,
        right:20,
        background:"#ef4444",
        border:"none",
        borderRadius:"50%",
        width:60,
        height:60,
        fontSize:24,
        color:"#fff",
        cursor:"pointer",
        zIndex:9999
      }}
    >
      🎤
    </button>

  )

}
