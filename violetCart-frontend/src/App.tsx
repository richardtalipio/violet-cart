import { BrowserRouter } from 'react-router-dom';;
import {AppRoutes} from "./routes/AppRoutes.tsx";

export function App() {
  return (
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
  );
}

export default App;