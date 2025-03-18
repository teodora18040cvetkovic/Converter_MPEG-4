import Compress from "./components/Compress";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <div className="title">Convert to MPEG-4 Audio</div>
      <Router>
        <Routes>
          <Route path="/" element={<Compress />} />
          <Route path="/compress" element={<Compress />} />
        </Routes>
      </Router>
      {/* <div className="footer">diplomski rad </div> */}
    </div>
  );
}

export default App;
