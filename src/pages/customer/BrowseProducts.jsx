import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";

import { getProducts } from "../../api/customerApi";
import BackButton from "../../components/common/BackButton";
import { fetchAllPages } from "../../utils/fetchAllPages";

function BrowseProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const records = await fetchAllPages((page, size) => getProducts({ page, size }));
      setProducts(records);
    } catch (error) {
      console.error("Failed to load products registry logs: ", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <BackButton />
        <Loader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="d-flex align-items-center gap-3 mb-4">
        <BackButton />
        <h2 className="mb-0 font-weight-bold text-main" style={{ letterSpacing: "-0.01em" }}>
          Explore Insurance Plans
        </h2>
      </div>

      <div className="row g-4">
        {products.map((product) => (
          <div className="col-md-6 col-lg-4" key={product.productId || product.id}>
            <Card title={product.productName}>
              <p className="text-muted small mb-3" style={{ minHeight: "44px", lineHeight: "1.4" }}>
                {product.description || "Comprehensive risk coverage parameters configured for personal asset protection."}
              </p>

              {/* 📊 DYNAMIC PAYMENT INTERVAL METADATA INFOBAR
              <div className="alert alert-light py-2 px-3 border rounded mb-3 small d-flex align-items-center gap-2">
                <i className="bi bi-calendar-check text-primary"></i>
                <span>
                  <strong>Payment Options Available:</strong> Annual, Quarterly, Monthly, or One-time.
                </span>
              </div> */}

              <Link
                className="btn btn-primary w-100 font-weight-bold shadow-sm py-2"
                to={`/customer/plans/${product.productId || product.id}`}
              >
                View Available Plans ➔
              </Link>
            </Card>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default BrowseProducts;