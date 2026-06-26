import { useEffect, useState } from "react";

import { getClaims } from "../api/claimApi";

function Claims() {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    getClaims().then((res) => {
      setClaims(res.data);
    });
  }, []);

  return (
    <div className="container mt-5">
      <h2>Claims</h2>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>

            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {claims.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>

              <td>{c.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Claims;
