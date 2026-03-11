export default function createVoiceCommands(
  navigate,
  setCommandText,
  setCommandStatus,
  helpers = {}
){

  const { speak } = helpers

  function run(label,action){

    setCommandText(label)
    setCommandStatus("Executing")

    action()

    setTimeout(()=>{

      setCommandText("")
      setCommandStatus("")

    },1200)

  }

  return [

    {
      command:["open dashboard","dashboard","home"],
      action:()=>run("Open dashboard",()=>navigate("/dashboard"))
    },

    {
      command:["open solo","start solo","solo mode"],
      action:()=>run("Open solo",()=>navigate("/solo"))
    },

    {
      command:["open burnouts","start burnouts","burnouts"],
      action:()=>run("Open burnouts",()=>navigate("/burnouts"))
    },

    {
      command:[
        "open live",
        "live battle",
        "start live",
        "live competition"
      ],
      action:()=>run("Open live",()=>navigate("/live"))
    },

    {
      command:["leaderboard","open leaderboard"],
      action:()=>run("Open leaderboard",()=>navigate("/leaderboard"))
    },

    {
      command:["profile","open profile"],
      action:()=>run("Open profile",()=>navigate("/profile"))
    },

    {
      command:["settings","open settings"],
      action:()=>run("Open settings",()=>navigate("/settings"))
    },

    {
      command:["open chat","chat"],
      action:()=>run("Open chat",()=>navigate("/chat"))
    },

    {
      command:["friends","open friends"],
      action:()=>run("Open friends",()=>navigate("/friends"))
    },

    {
      command:["messages","open messages"],
      action:()=>run("Open messages",()=>navigate("/messages"))
    },

    {
      command:["admin","admin panel"],
      action:()=>run("Open admin",()=>navigate("/admin"))
    },

    {
      command:["motivate me","give me motivation"],
      action:()=>{

        run("Motivation",()=>{

          if(speak){

            speak("Push harder. You are built for this.")

          }

        })

      }
    }

  ]

}
