import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Form from "./pages/Form.jsx";
import ProblemsDashboard from "./pages/ProblemsDashboard.jsx";

function App() {
  return (
    <Router>
      <div>
        {/* Navigation Links */}
        <nav style={{ padding: "10px 80px" }}>
          <h1 style={{ fontSize:"30px" }}>Ballon System</h1>
        </nav>

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/problems-dashboard" element={<ProblemsDashboard />} />
          <Route path="/*" element={<div style={{maxWidth:"350px", margin:"auto"}}><h1>Page Not Found</h1></div>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
