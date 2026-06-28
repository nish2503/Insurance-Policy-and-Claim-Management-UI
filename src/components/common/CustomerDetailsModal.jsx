import Modal from "./Modal";
import StatusBadge from "./StatusBadge";

function CustomerDetailsModal({
  show,

  onClose,

  customer,
}) {
  if (!show || !customer) return null;

  return (
    <Modal show={show} title="Customer Details" onClose={onClose}>
      <table className="table table-borderless mb-0 customer-details-table">
        <tbody>
            <tr>
  <th>Customer ID</th>
  <td>{customer.customerId}</td>
</tr>
          <tr>
            <th>Name</th>

            <td>{customer.fullName}</td>
          </tr>

          <tr>
            <th>Email</th>

            <td>{customer.email}</td>
          </tr>

          <tr>
            <th>Mobile</th>

            <td>{customer.mobileNumber}</td>
          </tr>

          <tr>
            <th>DOB</th>

            <td>{customer.dateOfBirth}</td>
          </tr>

          <tr>
            <th>Address</th>

            <td>{customer.address}</td>
          </tr>

          <tr>
            <th>City</th>

            <td>{customer.city}</td>
          </tr>

          <tr>
            <th>State</th>

            <td>{customer.state}</td>
          </tr>

          <tr>
            <th>Pincode</th>

            <td>{customer.pinCode}</td>
          </tr>

          <tr>
            <th>Nominee</th>

            <td>{customer.nomineeName}</td>
          </tr>

          <tr>
            <th>Relation</th>

            <td>{customer.nomineeRelation}</td>
          </tr>

          <tr>
            <th>Status</th>

            <td>
              <StatusBadge status={customer.activeStatus} />
            </td>
          </tr>
        </tbody>
      </table>
    </Modal>
  );
}

export default CustomerDetailsModal;
