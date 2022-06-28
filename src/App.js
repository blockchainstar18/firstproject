import HelloWorld from './HelloWorld'
import './App.css';

// import { ThirdwebProvider } from "@3rdweb/react";
// const supportedChainIds = [1, 4, 137];
// const connectors = {
//   injected: {}
// };
function App() {
  return (
    <div className="App">

    <HelloWorld></HelloWorld>

    </div>
      //   <ThirdwebProvider
      //   connectors={connectors}
      //   supportedChainIds={supportedChainIds}
      // >
      //   <HelloWorld />
      // </ThirdwebProvider>
  );
}

export default App;
