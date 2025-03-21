import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import CreateCompetency from "./CompetencyCrud/CreateCompetencies";
import CompetenciesList from "./CompetencyCrud/CompetenciesList";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/CreateCompetency" element={<CreateCompetency />} /> 
        
        <Route path="/C" element={<CompetenciesList />} /> 
      </Routes>
    </Router>
  );
}

export default App;