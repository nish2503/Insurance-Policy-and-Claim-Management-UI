import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";

import { getPlansByProduct } from "../../api/customerApi";
import { calculatePremium } from "../../utils/premiumFormula";
import BackButton from "../../components/common/BackButton";
import { fetchAllPages } from "../../utils/fetchAllPages";

function Plans() {
  const { productId } = useParams();

  const [plans, setPlans] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, [productId]);

  async function loadPlans() {
    try {
      const records = await fetchAllPages((page, size) =>
        getPlansByProduct(productId, { page, size }),
      );

      setPlans(records);
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
        {plans.map((plan) => {
          // "Starting from" reference figure only — informational, computed
          // at this plan's minimum coverage under its default frequency.
          // The actual premium a customer pays is always quoted by the
          // server on the purchase page once they pick their own coverage
          // amount and frequency.
          const startingFromPremium = calculatePremium({
            coverageAmount: plan.minCoverageAmount,
            ratePerUnit: plan.ratePerUnit,
            duration: plan.duration,
            premiumType: plan.premiumType,
            annualDiscountPercent: plan.annualDiscountPercent,
            oneTimeDiscountPercent: plan.oneTimeDiscountPercent,
          });

          const frequencySuffix = {
            MONTHLY: "/month",
            QUARTERLY: "/quarter",
            ANNUAL: "/year",
            ONE_TIME: " one-time",
          }[plan.premiumType] || "/year";

          return (
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
                  <strong>Starting from:</strong>{" "}
                  {startingFromPremium !== null ? `₹${startingFromPremium.toLocaleString()}${frequencySuffix}` : "—"}
                </p>
                <p className="mb-4 text-muted">
                  <strong>Coverage:</strong> ₹{Number(plan.minCoverageAmount).toLocaleString()} – ₹{Number(plan.maxCoverageAmount).toLocaleString()}
                </p>

                <Link
                  className="btn btn-success mt-auto w-100 font-weight-bold shadow-sm py-2"
                  to={`/customer/purchase-policy/${plan.planId || plan.id}`}
                >
                  Choose this Plan ➔
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );


}

export default Plans;