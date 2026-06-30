import { useEffect, useState } from "react";

import Modal from "./Modal";
import Button from "./Button";

const PRODUCT_TYPES = [
  "HEALTH",
  "MOTOR",
  "LIFE",
  "TRAVEL",
];

function ProductFormModal({
  show,

  onClose,

  onSubmit,

  product,
}) {
  const [form, setForm] = useState({

  productName: "",

  productType: PRODUCT_TYPES[0],

  description: "",

  activeStatus: true,

});

  useEffect(() => {
    if (product) {
      setForm({
        productName: product.productName || "",

        productType: product.productType || PRODUCT_TYPES[0],

        description: product.description || "",

        activeStatus: product.activeStatus,
      });
    } else {
      setForm({
        productName: "",

        productType: PRODUCT_TYPES[0],

        description: "",

        activeStatus: true,
      });
    }
  }, [product, show]);

  function handleChange(e) {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit(form);
  }

  return (
    <Modal
      show={show}
      onClose={onClose}
      title={product ? "Edit Product" : "Add Product"}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Product Name</label>

          <input
            className="form-control"
            name="productName"
            value={form.productName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">

  <label className="form-label">
    Product Type
  </label>

  <select
    className="form-select"
    name="productType"
    value={form.productType}
    onChange={handleChange}
  >

    {PRODUCT_TYPES.map(type => (

      <option
        key={type}
        value={type}
      >
        {type.charAt(0) + type.slice(1).toLowerCase()}
      </option>

    ))}

  </select>

</div>

        <div className="mb-3">
          <label className="form-label">Description</label>

          <textarea
            rows="4"
            className="form-control"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-check mb-3">

<input

type="checkbox"

className="form-check-input"

name="activeStatus"

checked={form.activeStatus}

onChange={(e)=>

setForm({

...form,

activeStatus:e.target.checked

})

}

/>

<label className="form-check-label">

Active Product

</label>

</div>

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit">
            {product ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ProductFormModal;
