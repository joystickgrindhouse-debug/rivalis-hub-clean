let recognition = null

function normalize(text){

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g,"")
    .trim()

}

export function startListening(onCommand){

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition

  if(!SpeechRecognition){

    alert("Voice recognition not supported on this device")
    return

  }

  recognition = new SpeechRecognition()

  recognition.lang = "en-US"
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  recognition.onresult = (event)=>{

    const transcript = event.results[0][0].transcript

    console.log("VOICE:", transcript)

    onCommand(normalize(transcript))

  }

  recognition.start()

}

export function stopListening(){

  if(recognition){

    recognition.stop()

  }

}
