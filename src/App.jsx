import "react-image-crop/dist/ReactCrop.css";
import Switch from "./Switch";
import AuthContext, { AuthProvider } from "./context/AuthProvider";
import SideNav from "./comps/SideNav";
import Navbar from "./comps/Navbar";
import { useContext, useState } from "react";
import * as Sentry from "@sentry/react";

function App() {
  const { auth } = useContext(AuthContext);
  // const [theme, setTheme] = useState("cupcake");
  // const toggleTheme = () => {
  //   setTheme((prevTheme) => (prevTheme === "cupcake" ? "synthwave" : "cupcake"));
  // };

  Sentry.init({
    dsn: "https://72141b97137444f7a66dfd07df5e2656@o4507861137883141.ingest.de.sentry.io/4507861157085264",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    tracePropagationTargets: [
      "localhost",
      /^https:\/\/chatify-api.up.railway.app\.io\/api/,
    ],
    profilesSampleRate: 0.0, // Adjust or comment out if not using profiling
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });

  return (
    <AuthProvider>
      {/* <Layout> */}
      <Navbar />
      <SideNav />
      <Switch />
      {/* </Layout> */}
    </AuthProvider>
  );
}

export default App;
