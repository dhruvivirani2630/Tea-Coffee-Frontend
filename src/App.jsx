import { useEffect } from "react";
import { hydrateSession } from "./store/slices/authSlice";
import { useAppDispatch } from "./store/hooks";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateSession());
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
