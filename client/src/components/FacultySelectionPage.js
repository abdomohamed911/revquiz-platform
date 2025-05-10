import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";

function FacultySelectionPage() {
  const navigate = useNavigate();
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/faculties")
      .then((res) => {
        setFaculties(res.data.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load faculties");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading faculties...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="page">
      <h2>Select Your Faculty</h2>
      <div className="grid">
        {faculties.map((fac) => (
          <div
            key={fac._id}
            className="card"
            onClick={() => navigate(`${fac.name}/courses/`)}
          >
            <div style={{ fontSize: "2rem" }}>🏫</div>
            <h3>{fac.name}</h3>
          </div>
        ))}
      </div>
      <button onClick={() => navigate(-1)}>← Back</button>
    </div>
  );
}

export default FacultySelectionPage;
