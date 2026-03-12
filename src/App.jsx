```jsx
import React, { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { auth, db, authReady } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { UserService } from "./services/userService.js";

import LoadingScreen from "./components/LoadingScreen.jsx";
import OnboardingSlides from "./components/OnboardingSlides.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import AdBanner from "./components/AdBanner.jsx";
import ChatbotTour from "./components/ChatbotTour/ChatbotTour.jsx";
import BackgroundShell from "./components/BackgroundShell.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import VoiceProvider from "./voice/VoiceProvider";

const Login = lazy(() => import("./views/Login.jsx"));
const Dashboard = lazy(() => import("./views/Dashboard.jsx"));
const Profile = lazy(() => import("./views/Profile.jsx"));
const Settings = lazy(() => import("./views/Settings.jsx"));
const GlobalChat = lazy(() => import("./views/GlobalChat.jsx"));
const DMChat = lazy(() => import("./views/DMChat.jsx"));
const Leaderboard = lazy(() => import("./views/Leaderboard.jsx"));
const Solo = lazy(() => import("./views/Solo.jsx"));
const Burnouts = lazy(() => import("./views/Burnouts.jsx"));
const Live = lazy(() => import("./views/Live.jsx"));
const Run = lazy(() => import("./views/Run.jsx"));
const RaffleRoom = lazy(() => import("./views/RaffleRoom.jsx"));
const WaitingForUpload = lazy(() => import("./views/WaitingForUpload.jsx"));
const AdminDashboard = lazy(() => import("./views/AdminDashboard.jsx"));
const OtherApps = lazy(() => import("./views/OtherApps.jsx"));
const MerchShop = lazy(() => import("./views/MerchShop.jsx"));
const BoxingArena = lazy(() => import("./boxing/pages/Arena.tsx"));
const Subscription = lazy(() => import("./views/Subscription.jsx"));
const FitnessDashboard = lazy(() => import("./views/FitnessDashboard.jsx"));

/* NEW GAME */
const Golf = lazy(() => import("./views/Golf.jsx"));

export default function App(){

  const navigate = useNavigate();
  const location = useLocation();

  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(true);
  const [userProfile,setUserProfile] = useState(null);
  const [checkingSetup,setCheckingSetup] = useState(true);
  const [profileLoaded,setProfileLoaded] = useState(false);

  const [showOnboarding,setShowOnboarding] = useState(false);
  const [onboardingComplete,setOnboardingComplete] = useState(false);
  const [isNewSignup,setIsNewSignup] = useState(false);

  const [initialHype,setInitialHype] = useState(false);
  const [showBot,setShowBot] = useState(false);
  const [activeGame,setActiveGame] = useState(null);

  const [theme,setTheme] = useState(()=>{
    return localStorage.getItem("theme") || "red-black";
  });

  const launchGame = (url)=>{
    setActiveGame(url);
  };

  const closeGame = ()=>{
    setActiveGame(null);
  };

  useEffect(()=>{
    window.launchGame = launchGame;
    return ()=> delete window.launchGame;
  },[]);

  useEffect(()=>{

    const body = document.body;

    body.classList.remove(
      "theme-red-black",
      "theme-white-black",
      "theme-black-white"
    );

    body.classList.add(`theme-${theme}`);

    localStorage.setItem("theme",theme);

  },[theme]);

  const cycleTheme = ()=>{
    setTheme(prev=>prev === "red-black" ? "white-black" : "red-black");
  };

  useEffect(()=>{

    if(!user) return;

    const path = location.pathname.split("/")[1] || "dashboard";

    UserService.updateHeartbeat(user.uid,path);

    const interval = setInterval(()=>{
      UserService.updateHeartbeat(user.uid,path);
    },30000);

    return ()=> clearInterval(interval);

  },[user,location.pathname]);

  useEffect(()=>{
    const timer = setTimeout(()=> setInitialHype(false),3000);
    return ()=> clearTimeout(timer);
  },[]);

  const refreshUserProfile = async(uid)=>{

    try{

      const result = await UserService.getUserProfile(uid);

      if(result.success && result.profile){
        setUserProfile(result.profile);
        return result.profile;
      }

    }catch(error){
      console.error(error);
    }

    return null;
  };

  useEffect(()=>{

    let unsubscribe = ()=>{};

    authReady.then(()=>{

      unsubscribe = onAuthStateChanged(auth, async(currentUser)=>{

        setUser(currentUser);

        if(currentUser){

          try{

            const result = await UserService.getUserProfile(currentUser.uid);

            if(result.success && result.profile){

              setUserProfile(result.profile);

              if(result.profile.hasCompletedSetup){

                setShowOnboarding(false);
                setOnboardingComplete(true);
                setIsNewSignup(false);
                setShowBot(true);

              }else{

                setShowOnboarding(true);
                setIsNewSignup(true);

              }

            }

          }catch(error){
            console.error(error);
          }

        }

        setProfileLoaded(true);
        setLoading(false);
        setCheckingSetup(false);

      });

    });

    return ()=> unsubscribe();

  },[]);

  useEffect(()=>{

    if(!user?.uid){
      setUserProfile(null);
      return;
    }

    const ref = doc(db,"users",user.uid);

    const unsub = onSnapshot(ref,(snap)=>{

      if(snap.exists()){
        setUserProfile(snap.data());
      }else{
        setUserProfile(null);
      }

    });

    return ()=> unsub();

  },[user?.uid]);

  const skipLoading = ()=>{
    setInitialHype(false);
    setLoading(false);
    setCheckingSetup(false);
    setProfileLoaded(true);
  };

  if(loading || checkingSetup || !profileLoaded || initialHype){
    return <LoadingScreen onSkip={skipLoading}/>;
  }

  if(user && showOnboarding && !onboardingComplete){
    return <OnboardingSlides onComplete={()=> setOnboardingComplete(true)}/>;
  }

  return(

    <BackgroundShell>

      {(!userProfile || userProfile.subscriptionStatus !== "active") && <AdBanner/>}

      {user && (
        <Navbar
          user={user}
          userProfile={userProfile}
          theme={theme}
          cycleTheme={cycleTheme}
        />
      )}

      <ThemeProvider theme={theme}>

        <VoiceProvider userProfile={userProfile}>

          <Suspense fallback={<div style={{padding:20}}>LOADING…</div>}>

            <Routes>

              <Route path="/" element={user ? <Navigate to="/dashboard"/> : <Navigate to="/login"/>} />

              <Route path="/login" element={!user ? <Login/> : <Navigate to="/dashboard"/>} />

              <Route path="/dashboard" element={<ProtectedRoute user={user} userProfile={userProfile}><Dashboard user={user}/></ProtectedRoute>} />

              <Route path="/profile" element={<ProtectedRoute user={user} userProfile={userProfile}><Profile user={user} userProfile={userProfile}/></ProtectedRoute>} />

              <Route path="/settings" element={<ProtectedRoute user={user} userProfile={userProfile}><Settings userProfile={userProfile}/></ProtectedRoute>} />

              <Route path="/solo" element={<ProtectedRoute user={user} userProfile={userProfile}><Solo user={user} userProfile={userProfile}/></ProtectedRoute>} />

              <Route path="/burnouts" element={<ProtectedRoute user={user} userProfile={userProfile}><Burnouts user={user} userProfile={userProfile}/></ProtectedRoute>} />

              <Route path="/live" element={<ProtectedRoute user={user} userProfile={userProfile}><Live user={user} userProfile={userProfile}/></ProtectedRoute>} />

              <Route path="/run" element={<ProtectedRoute user={user} userProfile={userProfile}><Run user={user} userProfile={userProfile}/></ProtectedRoute>} />

              <Route path="/raffle" element={<ProtectedRoute user={user} userProfile={userProfile}><RaffleRoom user={user} userProfile={userProfile}/></ProtectedRoute>} />

              <Route path="/fitness" element={<ProtectedRoute user={user} userProfile={userProfile}><FitnessDashboard user={user} userProfile={userProfile}/></ProtectedRoute>} />

              <Route path="/leaderboard" element={<ProtectedRoute user={user} userProfile={userProfile}><Leaderboard user={user}/></ProtectedRoute>} />

              <Route path="/chat" element={<ProtectedRoute user={user} userProfile={userProfile}><GlobalChat user={user} userProfile={userProfile}/></ProtectedRoute>} />

              <Route path="/dm" element={<ProtectedRoute user={user} userProfile={userProfile}><DMChat user={user} userProfile={userProfile}/></ProtectedRoute>} />

              <Route path="/shop" element={<ProtectedRoute user={user} userProfile={userProfile}><MerchShop/></ProtectedRoute>} />

              <Route path="/other-apps" element={<ProtectedRoute user={user} userProfile={userProfile}><OtherApps/></ProtectedRoute>} />

              <Route path="/subscription" element={<ProtectedRoute user={user} userProfile={userProfile}><Subscription user={user} userProfile={userProfile}/></ProtectedRoute>} />

              <Route path="/boxing" element={<ProtectedRoute user={user} userProfile={userProfile}><BoxingArena/></ProtectedRoute>} />

              {/* NEW RIVALIS GOLF MODE */}
              <Route
                path="/golf"
                element={
                  <ProtectedRoute user={user} userProfile={userProfile}>
                    <Golf user={user} userProfile={userProfile}/>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin-control"
                element={
                  <AdminRoute>
                    <AdminDashboard userProfile={userProfile}/>
                  </AdminRoute>
                }
              />

            </Routes>

          </Suspense>

        </VoiceProvider>

      </ThemeProvider>

    </BackgroundShell>

  );

}

const botStyles = {

  botTrigger:{
    position:"fixed",
    bottom:"85px",
    right:"20px",
    background:"var(--accent-color,#FF0000)",
    color:"#FFF",
    border:"none",
    borderRadius:"50%",
    width:"50px",
    height:"50px",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    fontWeight:"bold",
    cursor:"pointer",
    boxShadow:"0 0 15px var(--accent-color,#FF0000)",
    zIndex:10001,
    fontSize:"20px"
  },

  botContainer:{
    position:"fixed",
    bottom:"145px",
    right:"20px",
    width:"350px",
    height:"500px",
    zIndex:10001,
    boxShadow:"0 0 30px rgba(0,0,0,0.5)"
  }

};
```
