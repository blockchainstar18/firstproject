import HelloWorld from './HelloWorld'
import AboutUs from './AboutUs'
import {
  BrowserRouter,
  Switch,
  Route,
  Routes,
  Link
} from "react-router-dom";
import './App.css';

// import { ThirdwebProvider } from "@3rdweb/react";
// const supportedChainIds = [1, 4, 137];
// const connectors = {
//   injected: {}
// };
function App() {
  return (
    <div>
       <BrowserRouter>
          <Routes>
            <Route path="/" element={<HelloWorld />} />
            <Route path="/aboutus" element={<AboutUs />} />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
