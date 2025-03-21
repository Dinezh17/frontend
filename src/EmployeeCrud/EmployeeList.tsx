// src/components/EmployeeList.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

// src/types.ts
export interface Competency {
  id: number;
  employee_id: number;
  competency_id: number;
  required_score: number;
  actual_score: number | null;
}

export interface Employee {
  id: number;
  emp_number: string;
  job_code: string;
  emp_name: string;
  job_role: string;
  department_id: number;
  evaluation_status: string;
  last_evaluated_date: string | null;
}

const EmployeeList: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [competencies, setCompetencies] = useState<Competency[]>([]);
    const [expandedEmployeeId, setExpandedEmployeeId] = useState<number | null>(null);

    useEffect(() => {
        // Fetch employees and competencies data
        axios.get<Employee[]>("http://localhost:8000/employees")
            .then((response) => {
                setEmployees(response.data);
            })
            .catch((error) => {
                console.error("Error fetching employees:", error);
            });

        axios.get<Competency[]>("http://localhost:8000/employee-competencies")
            .then((response) => {
                setCompetencies(response.data);
            })
            .catch((error) => {
                console.error("Error fetching competencies:", error);
            });
    }, []);

    const toggleExpand = (employeeId: number) => {
        setExpandedEmployeeId((prev) => (prev === employeeId ? null : employeeId));
    };

    const getCompetenciesForEmployee = (employeeId: number) => {
        return competencies.filter((comp) => comp.employee_id === employeeId);
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Employee List</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                {employees.map((employee) => (
                    <div
                        key={employee.id}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "16px",
                            cursor: "pointer",
                            backgroundColor: expandedEmployeeId === employee.id ? "#f9f9f9" : "#fff",
                        }}
                        onClick={() => toggleExpand(employee.id)}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>{employee.emp_name}</h3>
                            <span style={{ fontSize: "14px", color: "#666" }}>ID: {employee.id}</span>
                        </div>
                        {expandedEmployeeId === employee.id && (
                            <div style={{ marginTop: "16px" }}>
                                <p><strong>Employee Number:</strong> {employee.emp_number}</p>
                                <p><strong>Job Code:</strong> {employee.job_code}</p>
                                <p><strong>Job Role:</strong> {employee.job_role}</p>
                                <p><strong>Department ID:</strong> {employee.department_id}</p>
                                <p><strong>Evaluation Status:</strong> {employee.evaluation_status}</p>
                                <p><strong>Last Evaluated Date:</strong> {employee.last_evaluated_date || "N/A"}</p>
                                <h4 style={{ fontSize: "16px", fontWeight: "bold", marginTop: "16px" }}>Competencies</h4>
                                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "8px" }}>
                                    <thead>
                                        <tr style={{ backgroundColor: "#f1f1f1" }}>
                                            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Competency ID</th>
                                            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Required Score</th>
                                            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Actual Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getCompetenciesForEmployee(employee.id).map((comp) => (
                                            <tr key={comp.id}>
                                                <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>{comp.competency_id}</td>
                                                <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>{comp.required_score}</td>
                                                <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>{comp.actual_score || "N/A"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmployeeList;