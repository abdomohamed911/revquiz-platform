import React from 'react';
import { useNavigate } from 'react-router-dom';

function FacultySelectionPage() {
  const navigate = useNavigate();

  const faculties = [
    { name: "Engineering", path: "/courses/engineering", icon: "🧠" },
    { name: "Business", path: "/courses/business", icon: "🏆" },
    { name: "Medicine", path: "/courses/medicine", icon: "📚" },
    { name: "Arts", path: "/courses/arts", icon: "🎓" },
    { name: "Science", path: "/courses/science", icon: "🧠" }
  ];

  return (
    <div className="page">
      <h2>Select Your Faculty</h2>
      <div className="grid">
        {faculties.map((fac, index) => (
          <div key={index} className="card" onClick={() => navigate(fac.path)}>
            <div style={{ fontSize: '2rem' }}>{fac.icon}</div>
            <h3>{fac.name}</h3>
          </div>
        ))}
      </div>
      <button onClick={() => navigate(-1)}>← Back</button>
    </div>
  );
}

export default FacultySelectionPage;
