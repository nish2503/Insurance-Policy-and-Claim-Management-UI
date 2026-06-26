import { useEffect, useState } from "react";

import { getCustomers } from "../api/customerApi";

function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getCustomers().then((res) => {
      setCustomers(res.data);
    });
  }, []);

  return (
    <div className="container mt-5">
      <h2>Customers</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>

            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>

              <td>{c.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Customers;
