import React, { useEffect, useState } from "react";
import axios from "axios";

type Competency = {
  id: number;
  code: string;
  name: string;
};

const CompetenciesList: React.FC = () => {
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [editCompetency, setEditCompetency] = useState<Competency | null>(null);
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCompetencies();
  }, []);

  const fetchCompetencies = async () => {
    if (!token) {
      setError("User not authenticated");
      return;
    }

    try {
      const response = await axios.get<Competency[]>(
        "http://127.0.0.1:8000/competencies",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCompetencies(response.data);
    } catch (err) {
      setError("Failed to load competencies");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this competency?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/competencies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompetencies(competencies.filter((comp) => comp.id !== id));
    } catch (err) {
      setError("Failed to delete competency");
    }
  };

  const handleEdit = (comp: Competency) => {
    setEditCompetency(comp);
    setNewCode(comp.code);
    setNewName(comp.name);
  };

  const handleUpdate = async () => {
    if (!editCompetency) return;

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/competencies/${editCompetency.id}`,
        { code: newCode, name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCompetencies(
        competencies.map((comp) =>
          comp.id === editCompetency.id ? response.data : comp
        )
      );
      setEditCompetency(null);
    } catch (err) {
      setError("Failed to update competency");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Competencies</h2>
      {error && <p className="text-red-600">{error}</p>}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Code</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {competencies.map((comp) => (
            <tr key={comp.id} className="border">
              <td className="border p-2 text-center">{comp.id}</td>
              <td className="border p-2 text-center">{comp.code}</td>
              <td className="border p-2 text-center">{comp.name}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => handleEdit(comp)}
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(comp.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editCompetency && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Competency</h3>
            <input
              type="text"
              className="border p-2 mb-2 w-full"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="Enter Code"
            />
            <input
              type="text"
              className="border p-2 mb-2 w-full"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter Name"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setEditCompetency(null)}
                className="mr-2 px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetenciesList;
