import { useEffect, useRef } from "react";
import { hydrateSession } from "./store/slices/authSlice";
import { useAppDispatch } from "./store/hooks";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const dispatch = useAppDispatch();
  const bootstrappedRef = useRef(false);

  useEffect(() => {
    if (bootstrappedRef.current) return;
    bootstrappedRef.current = true;
    dispatch(hydrateSession());
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
