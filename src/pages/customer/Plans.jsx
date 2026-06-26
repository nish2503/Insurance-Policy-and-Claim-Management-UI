import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";

import {
  getPlansByProduct
} from "../../api/customerApi";
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
        <BackButton/>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card title="Available Plans">
        <h2>Choose Insurance Plan</h2>

        <div className="row">
          {plans.map((plan) => (
            <div className="col-md-4 mb-3" key={plan.planId}>
              <div className="card p-3">
                <h4>{plan.planName}</h4>

                <p>Premium: ₹{plan.premiumAmount}</p>

                <p>Coverage: ₹{plan.coverageAmount}</p>

                <p>
                  Duration:
                  {plan.duration} Years
                </p>

                <Link
                  className="btn btn-success"
                  to={`/customer/purchase-policy/${plan.planId}`}
                >
                  Buy Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
}

export default Plans;
