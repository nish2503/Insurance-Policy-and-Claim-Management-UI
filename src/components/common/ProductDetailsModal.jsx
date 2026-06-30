import Modal from "./Modal";
import StatusBadge from "./StatusBadge";

function ProductDetailsModal({
  show,

  onClose,

  product,
}) {
  if (!product) return null;

  return (
    <Modal show={show} onClose={onClose} title="Product Details">
      <table className="table table-borderless customer-details-table">
        <tbody>
          <tr>
            <th>ID</th>

            <td>{product.productId}</td>
          </tr>

          <tr>
            <th>Name</th>

            <td>{product.productName}</td>
          </tr>

          <tr>
            <th>Description</th>

            <td>{product.description}</td>
          </tr>

          <tr>
            <th>Status</th>

            <td>
              <StatusBadge
                status={product.activeStatus ? "ACTIVE" : "INACTIVE"}
              />
            </td>
          </tr>

          <tr>
            <th>Created</th>

            <td>{product.createdDate}</td>
          </tr>

          <tr>
            <th>Updated</th>

            <td>{product.lastModifiedDate}</td>
          </tr>
        </tbody>
      </table>
    </Modal>
  );
}

export default ProductDetailsModal;
