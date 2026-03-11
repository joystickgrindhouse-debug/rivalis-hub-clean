export default function handleVoiceCommand(command, navigate){

  console.log("VOICE COMMAND:", command)

  if(command.includes("dashboard") || command.includes("home")){
    navigate("/dashboard")
    return
  }

  if(command.includes("solo")){
    navigate("/solo")
    return
  }

  if(command.includes("burnouts")){
    navigate("/burnouts")
    return
  }

  if(command.includes("live")){
    navigate("/live")
    return
  }

  if(command.includes("leaderboard")){
    navigate("/leaderboard")
    return
  }

  if(command.includes("settings")){
    navigate("/settings")
    return
  }

  if(command.includes("profile")){
    navigate("/profile")
    return
  }

  if(command.includes("chat")){
    navigate("/chat")
    return
  }

  console.log("No command matched:", command)

}
