import { useEffect, useState } from "react";

import { getProducts } from "../api/productApi";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await getProducts();

    setProducts(res.data);
  }

  return (
    <div className="container mt-5">
      <h2>Products</h2>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>

            <th>Name</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>

              <td>{p.productName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Products;
