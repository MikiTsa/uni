import './App.css'
import Routing from './Routing';
import { ThemeProvider } from "./ThemeContext.jsx";

export default function App() {
  return(
    <ThemeProvider>
      <Routing />
    </ThemeProvider>
    );
}
