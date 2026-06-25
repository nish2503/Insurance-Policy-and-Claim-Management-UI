import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";

import { getProducts } from "../../api/customerApi";

function BrowseProducts() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {

    try {

      const response = await getProducts();

      setProducts(response.data.records || []);

    }
    catch (error) {

      console.log(error);

    }
    finally {

      setLoading(false);

    }

  }

  if (loading) {

    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );

  }

  return (

    <DashboardLayout>

      <h2>Insurance Products</h2>

      <div className="row">

        {
          products.map(product => (

            <div
              className="col-md-4 mb-3"
              key={product.productId}
            >

              <Card title={product.productName}>

                <p>{product.description}</p>

                <Link
                  className="btn btn-primary"
                  to={`/customer/plans/${product.productId}`}
                >
                  View Plans
                </Link>

              </Card>

            </div>

          ))
        }

      </div>

    </DashboardLayout>

  );

}

export default BrowseProducts;