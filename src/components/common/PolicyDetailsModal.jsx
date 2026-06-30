import Modal from "./Modal";
import StatusBadge from "./StatusBadge";

function PolicyDetailsModal({
  show,

  onClose,

  policy,
}) {
  if (!policy) return null;

  return (
    <Modal show={show} title="Policy Details" onClose={onClose}>
      <table className="table table-borderless">
        <tbody>
          <tr>
            <th>Policy ID</th>

            <td>{policy.policyId}</td>
          </tr>

          <tr>
            <th>Policy Number</th>

            <td>{policy.policyNumber}</td>
          </tr>

          <tr>
            <th>Customer</th>

            <td>{policy.customerName}</td>
          </tr>

          <tr>
            <th>Plan</th>

            <td>{policy.planName}</td>
          </tr>

          <tr>
            <th>Product Type</th>

            <td>{policy.productType}</td>
          </tr>

          <tr>
            <th>Coverage Amount</th>

            <td>₹ {policy.coverageAmount}</td>
          </tr>

          <tr>
            <th>Premium Amount</th>

            <td>₹ {policy.premiumAmount}</td>
          </tr>

          <tr>
            <th>Premium Type</th>

            <td>{policy.premiumType}</td>
          </tr>

          <tr>
            <th>Start Date</th>

            <td>{policy.startDate}</td>
          </tr>

          <tr>
            <th>End Date</th>

            <td>{policy.endDate}</td>
          </tr>

          <tr>
            <th>Total Premium Paid</th>

            <td>₹ {policy.totalPremiumPaid}</td>
          </tr>

          <tr>
            <th>Status</th>

            <td>
              <StatusBadge status={policy.policyStatus} />
            </td>
          </tr>
        </tbody>
      </table>
    </Modal>
  );
}

export default PolicyDetailsModal;