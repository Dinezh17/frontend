import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ✅ Define Form Schema
const competencySchema = yup.object().shape({
  code: yup.string().required("Code is required"),
  name: yup.string().required("Name is required"),
});

// ✅ Define Form Data Type
type CompetencyForm = {
  code: string;
  name: string;
};

const CreateCompetency: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ Setup Form Handling
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompetencyForm>({
    resolver: yupResolver(competencySchema),
  });

  // ✅ Handle Form Submission
  const onSubmit = async (data: CompetencyForm) => {
    setMessage(null);
    setError(null);

    try {
      const token = localStorage.getItem("token"); // Assume token is stored after login
      const response = await axios.post(
        "http://127.0.0.1:8000/competencies",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(`Competency "${response.data.name}" created successfully!`);
      reset();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to create competency");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Create Competency</h2>

      {/* ✅ Success / Error Messages */}
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* ✅ Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Code Input */}
        <div>
          <label className="block font-medium">Code:</label>
          <input
            {...register("code")}
            className="border p-2 w-full rounded"
            placeholder="Enter competency code"
          />
          <p className="text-red-500 text-sm">{errors.code?.message}</p>
        </div>

        {/* Name Input */}
        <div>
          <label className="block font-medium">Name:</label>
          <input
            {...register("name")}
            className="border p-2 w-full rounded"
            placeholder="Enter competency name"
          />
          <p className="text-red-500 text-sm">{errors.name?.message}</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Competency
        </button>
      </form>
    </div>
  );
};

export default CreateCompetency;
