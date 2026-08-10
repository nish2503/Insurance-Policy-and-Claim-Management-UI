import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { initSessionSync } from "./utils/sessionSync";

function App() {
  // Detects another tab logging in/out (localStorage is shared across
  // tabs on the same origin) and resyncs this tab instead of letting it
  // silently keep sending requests under a stale, now-wrong token/role.
  useEffect(() => {
    initSessionSync();
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
