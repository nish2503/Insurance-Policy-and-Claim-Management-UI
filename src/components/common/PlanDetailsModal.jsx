import Modal from "./Modal";
import StatusBadge from "./StatusBadge";

function PlanDetailsModal({
  show,

  onClose,

  plan,
}) {
  if (!plan) return null;

  return (
    <Modal show={show} onClose={onClose} title="Plan Details">
      <table className="table table-borderless customer-details-table">
        <tbody>
          <tr>
            <th>ID</th>

            <td>{plan.planId}</td>
          </tr>

          <tr>
            <th>Plan Name</th>

            <td>{plan.planName}</td>
          </tr>

          <tr>
            <th>Product</th>

            <td>{plan.productName}</td>
          </tr>

          <tr>
            <th>Coverage Range</th>

            <td>
              ₹ {Number(plan.minCoverageAmount).toLocaleString()} – ₹ {Number(plan.maxCoverageAmount).toLocaleString()}
            </td>
          </tr>

          <tr>
            <th>Rate</th>

            <td>₹ {plan.ratePerUnit} per ₹50,000 of coverage, per year</td>
          </tr>

          <tr>
            <th>Annual Payment Discount</th>

            <td>{plan.annualDiscountPercent ?? 0}%</td>
          </tr>

          <tr>
            <th>One-Time Payment Discount</th>

            <td>{plan.oneTimeDiscountPercent ?? 0}%</td>
          </tr>

          <tr>
            <th>Duration</th>

            <td>{plan.duration} Years</td>
          </tr>

          <tr>
            <th>Terms</th>

            <td>{plan.termsAndConditions}</td>
          </tr>

          <tr>
            <th>Status</th>

            <td>
              <StatusBadge status={plan.activeStatus ? "ACTIVE" : "INACTIVE"} />
            </td>
          </tr>

          <tr>
            <th>Created</th>

            <td>{plan.createdDate}</td>
          </tr>

          <tr>
            <th>Updated</th>

            <td>{plan.lastModifiedDate}</td>
          </tr>
        </tbody>
      </table>
    </Modal>
  );
}

export default PlanDetailsModal;