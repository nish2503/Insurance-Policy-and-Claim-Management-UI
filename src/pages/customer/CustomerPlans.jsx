import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";

import { getPlansByProduct } from "../../api/customerApi";
import BackButton from "../../components/common/BackButton";

function Plans() {
  const { productId } = useParams();

  const [plans, setPlans] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, [productId]);

  async function loadPlans() {
    try {
      const response = await getPlansByProduct(productId);

      setPlans(response.data.records || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <Loader />
        <BackButton />
      </DashboardLayout>
    );
  }
    return (
    <DashboardLayout>
      <div className="d-flex align-items-center gap-3 mb-4">
        <BackButton />
        <h2 className="mb-0 font-weight-bold text-main" style={{ letterSpacing: "-0.01em" }}>
          Select an Insurance Plan
        </h2>
      </div>

      <div className="row g-4">
        {plans.map((plan) => (
          <div className="col-md-6 col-lg-4" key={plan.planId || plan.id}>
            <div className="card h-100 p-4 shadow-sm border rounded-3 bg-panel-custom">
              <h4 className="font-weight-bold text-primary mb-3">{plan.planName}</h4>

              {/* 📊 DYNAMIC INLINE PAYMENT FREQUENCY BADGES */}
              <div className="mb-3 d-flex flex-wrap gap-2">
                <span className="badge bg-primary px-2 py-1 small">
                  ⏱️ {plan.premiumType || plan.premiumInterval || "Annual Payment"}
                </span>
                <span className="badge bg-secondary px-2 py-1 small">
                  📅 {plan.duration} Years Term
                </span>
              </div>

              {/* Simple Humanistic Grid Layout info text blocks */}
              <p className="mb-2 text-muted">
                <strong>Premium Due:</strong> ₹{Number(plan.premiumAmount).toLocaleString()}
              </p>
              <p className="mb-4 text-muted">
                <strong>Total Coverage:</strong> ₹{Number(plan.coverageAmount).toLocaleString()}
              </p>

              <Link
                className="btn btn-success mt-auto w-100 font-weight-bold shadow-sm py-2"
                to={`/customer/purchase-policy/${plan.planId || plan.id}`}
              >
                Choose this Plan ➔
              </Link>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );


}

export default Plans;
