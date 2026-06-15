import { useEffect, useState } from "react";

function CustomerServices() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/get_services/")
      .then(res => res.json())
      .then(data => setServices(data));
  }, []);

  return (
    <div>
      <h1>Our Services</h1>

      {services.map((s) => (
        <div key={s.id}>
          <h2>{s.name}</h2>
          <p>{s.description}</p>
        </div>
      ))}
    </div>
  );
}

export default CustomerServices;