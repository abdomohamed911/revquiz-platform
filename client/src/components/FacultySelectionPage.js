import React from 'react';
import { useNavigate } from 'react-router-dom';

function FacultySelectionPage() {
  const navigate = useNavigate();

  const faculties = [
    { name: "Engineering", path: "/faculties/engineering/courses", icon: "🧠" },
    { name: "Business", path: "/faculties/business/courses", icon: "🏆" },
    { name: "Medicine", path: "/faculties/medicine/courses", icon: "📚" },
    { name: "Arts", path: "/faculties/arts/courses", icon: "🎓" },
    { name: "Science", path: "/faculties/science/courses", icon: "🧠" }
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
