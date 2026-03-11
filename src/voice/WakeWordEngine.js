let recognition = null
let commands = []
let wakeWord = "rivalis"

let isRunning = false

function normalize(text){

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g,"")
    .trim()

}

function matchCommand(transcript){

  const cleaned = normalize(transcript)

  for(const cmd of commands){

    for(const phrase of cmd.command){

      if(cleaned.includes(normalize(phrase))){

        console.log("VOICE COMMAND MATCHED:", phrase)

        cmd.action()

        return true

      }

    }

  }

  console.log("No command matched:", cleaned)

  return false

}

function processTranscript(transcript){

  const cleaned = normalize(transcript)

  console.log("VOICE HEARD:", cleaned)

  if(
    !cleaned.includes(wakeWord) &&
    !cleaned.includes("rival")
  ){
    return
  }

  const commandPart = cleaned
    .replace(wakeWord,"")
    .replace("rival","")
    .trim()

  if(!commandPart){

    console.log("Wake word detected")

    return
  }

  console.log("Processing command:", commandPart)

  matchCommand(commandPart)

}

function createRecognition(){

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition

  if(!SpeechRecognition){

    console.warn("SpeechRecognition not supported")

    return null

  }

  const rec = new SpeechRecognition()

  rec.continuous = true
  rec.interimResults = false
  rec.lang = "en-US"

  rec.onresult = (event)=>{

    const resultIndex = event.resultIndex
    const transcript = event.results[resultIndex][0].transcript

    processTranscript(transcript)

  }

  rec.onerror = (err)=>{

    console.warn("Voice error:",err)

  }

  rec.onend = ()=>{

    if(isRunning){

      try{

        rec.start()

      }catch(e){

        console.warn("Restart failed:",e)

      }

    }

  }

  return rec

}

const WakeWordEngine = {

  init(commandList){

    commands = commandList

    if(!recognition){

      recognition = createRecognition()

    }

  },

  start(){

    if(!recognition) return

    if(isRunning) return

    isRunning = true

    try{

      recognition.start()

      console.log("Voice engine started")

    }catch(e){

      console.warn("Voice start error:",e)

    }

  },

  stop(){

    if(!recognition) return

    isRunning = false

    try{

      recognition.stop()

      console.log("Voice engine stopped")

    }catch(e){

      console.warn("Voice stop error:",e)

    }

  },

  setWakeWord(word){

    if(!word) return

    wakeWord = normalize(word)

    console.log("Wake word set to:", wakeWord)

  }

}

export default WakeWordEngine
