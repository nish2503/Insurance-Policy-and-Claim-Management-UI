import { useEffect, useState } from "react";

import Modal from "./Modal";
import Button from "./Button";

import { getProducts } from "../../api/productApi";

const PREMIUM_TYPES = ["ONE_TIME", "ANNUAL"];

function PlanFormModal({
  show,

  onClose,

  onSubmit,

  plan,
}) {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    productId: "",

    planName: "",

    coverageAmount: "",

    premiumAmount: "",

    premiumType: PREMIUM_TYPES[0],

    duration: "",

    termsAndConditions: "",

    activeStatus: true,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const res = await getProducts();

      setProducts(res.data.records || []);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (plan) {
      setForm({
        productId: "",

        planName: plan.planName,

        coverageAmount: plan.coverageAmount,

        premiumAmount: plan.premiumAmount,

        premiumType: plan.premiumType,

        duration: plan.duration,

        termsAndConditions: plan.termsAndConditions,

        activeStatus: plan.activeStatus,
      });
    } else {
      setForm({
        productId: "",

        planName: "",

        coverageAmount: "",

        premiumAmount: "",

        premiumType: PREMIUM_TYPES[0],

        duration: "",

        termsAndConditions: "",

        activeStatus: true,
      });
    }
  }, [plan, show]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,

      [name]: type === "checkbox" ? checked : value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit(form);
  }

  return (
    <Modal
      show={show}
      title={plan ? "Edit Plan" : "Add Plan"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Product</label>

          {plan ? (
            <input className="form-control" value={plan.productName} readOnly />
          ) : (
            <select
              className="form-select"
              name="productId"
              value={form.productId}
              onChange={handleChange}
              required
            >
              <option value="">Select Product</option>

              {products.map((product) => (
                <option key={product.productId} value={product.productId}>
                  {product.productName}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Plan Name</label>

          <input
            className="form-control"
            name="planName"
            value={form.planName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Coverage Amount</label>

            <input
              type="number"
              className="form-control"
              name="coverageAmount"
              value={form.coverageAmount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Premium Amount</label>

            <input
              type="number"
              className="form-control"
              name="premiumAmount"
              value={form.premiumAmount}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Premium Type</label>

            <select
              className="form-select"
              name="premiumType"
              value={form.premiumType}
              onChange={handleChange}
            >
              {PREMIUM_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Duration (Years)</label>

            <input
              type="number"
              className="form-control"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Terms & Conditions</label>

          <textarea
            rows="4"
            className="form-control"
            name="termsAndConditions"
            value={form.termsAndConditions}
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
            onChange={handleChange}
          />

          <label className="form-check-label">Active Plan</label>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit">{plan ? "Update Plan" : "Add Plan"}</Button>
        </div>
      </form>
    </Modal>
  );
}

export default PlanFormModal;
