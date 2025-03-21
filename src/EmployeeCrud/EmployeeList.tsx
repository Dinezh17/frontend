import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Types
interface Competency {
  id: number;
  competency_id: number;
  required_score: number;
  actual_score: number | null;
  name?: string; // Added after joining with competency data
}

interface Department {
  id: number;
  name: string;
}

enum EvaluationStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED"
}

interface Employee {
  id: number;
  emp_number: string;
  job_code: string;
  emp_name: string;
  job_role: string;
  department_id: number;
  evaluation_status: EvaluationStatus;
  last_evaluated_date: string | null;
  department: Department;
  competencies: Competency[];
}

const EmployeeList: React.FC = () => {
  // State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [competencies, setCompetencies] = useState<{[key: number]: string}>({});
  const [expandedEmployees, setExpandedEmployees] = useState<{[key: number]: boolean}>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token")
  // Fetch employees and competencies on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch competencies first
        const compResponse = await axios.get('http://127.0.0.1:8000/competencies',{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const compData = compResponse.data.reduce((acc: {[key: number]: string}, comp: {id: number, name: string}) => {
          acc[comp.id] = comp.name;
          return acc;
        }, {});
        setCompetencies(compData);
        
        // Fetch employees
        const empResponse = await axios.get('http://127.0.0.1:8000/employees',{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployees(empResponse.data);
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Toggle expanded state for an employee
  const toggleExpand = (employeeId: number) => {
    setExpandedEmployees(prev => ({
      ...prev,
      [employeeId]: !prev[employeeId]
    }));
  };

  // Calculate average score for an employee
  const calculateAverageScore = (competencies: Competency[]): string => {
    const scores = competencies
      .filter(comp => comp.actual_score !== null)
      .map(comp => comp.actual_score as number);
    
    if (scores.length === 0) return 'N/A';
    
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return average.toFixed(1);
  };

  // Format date
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Not evaluated';
    
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get status color
  const getStatusColor = (status: EvaluationStatus): string => {
    switch (status) {
      case EvaluationStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case EvaluationStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case EvaluationStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get score color based on value
  const getScoreColor = (score: number | null, required: number): string => {
    if (score === null) return 'text-gray-500';
    if (score >= required) return 'text-green-600 font-medium';
    return 'text-red-600 font-medium';
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading employees...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  if (employees.length === 0) {
    return <div className="p-6 text-center">No employees found.</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Employee List</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {employees.map(employee => {
          const isExpanded = expandedEmployees[employee.id] || false;
          const averageScore = calculateAverageScore(employee.competencies);
          
          return (
            <div 
              key={employee.id} 
              className={`border rounded-lg shadow-sm overflow-hidden transition-all duration-300 ${isExpanded ? 'bg-gray-50' : 'bg-white'}`}
            >
              {/* Header - Always visible */}
              <div 
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExpand(employee.id)}
              >
                <div>
                  <h3 className="font-bold text-lg">{employee.emp_name}</h3>
                  <p className="text-gray-600">{employee.job_role}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">
                    {averageScore !== 'N/A' ? (
                      <span className={parseFloat(averageScore) >= 7 ? 'text-green-600' : 'text-orange-500'}>
                        {averageScore}
                      </span>
                    ) : (
                      <span className="text-gray-400">{averageScore}</span>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(employee.evaluation_status)}`}>
                    {employee.evaluation_status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              {/* Expanded content */}
              {isExpanded && (
                <div className="p-4 border-t">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Employee Number</p>
                      <p className="font-medium">{employee.emp_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Job Code</p>
                      <p className="font-medium">{employee.job_code}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-medium">{employee.department.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Evaluated</p>
                      <p className="font-medium">{formatDate(employee.last_evaluated_date)}</p>
                    </div>
                  </div>
                  
                  {/* Competencies */}
                  {employee.competencies.length > 0 ? (
                    <div>
                      <h4 className="font-medium mb-2">Competencies</h4>
                      <div className="bg-white rounded border overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competency</th>
                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actual</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {employee.competencies.map(comp => (
                              <tr key={comp.id}>
                                <td className="px-4 py-2 whitespace-nowrap">
                                  {competencies[comp.competency_id] || `Competency #${comp.competency_id}`}
                                </td>
                                <td className="px-4 py-2 text-center whitespace-nowrap">
                                  {comp.required_score}
                                </td>
                                <td className={`px-4 py-2 text-center whitespace-nowrap ${getScoreColor(comp.actual_score, comp.required_score)}`}>
                                  {comp.actual_score !== null ? comp.actual_score : 'Not rated'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No competencies assigned</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmployeeList;