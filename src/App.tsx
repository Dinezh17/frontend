import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import CreateCompetency from "./CompetencyCrud/CreateCompetencies";
import CompetenciesList from "./CompetencyCrud/CompetenciesList";
import CreateEmployee from "./EmployeeCrud/EmployeeCreate";
import EmployeeList from "./EmployeeCrud/EmployeeList";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/CreateCompetency" element={<CreateCompetency />} /> 
        <Route path="/CreateEmployee" element={<CreateEmployee />} />
        <Route path="/CompetenciesList" element={<CompetenciesList />} /> 
        
        
        <Route path="/list" element={<EmployeeList />} /> 
      </Routes>
    </Router>
  );
}

export default App;