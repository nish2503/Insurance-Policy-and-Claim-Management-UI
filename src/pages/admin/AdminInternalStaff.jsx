import { useEffect, useState } from "react";

import {
  getUsersByRole,
  createInternalStaff,
  assignProductToUser,
} from "../../api/userApi";
import { getActiveProducts } from "../../api/productApi";

import {
  validateFullName,
  validateEmail,
  validatePassword,
  validateMobile,
  validateForm,
  toE164India,
} from "../../utils/validators";
import { getApiErrorMessage, extractValidationErrors } from "../../utils/apiError";
import { useToast } from "../../context/ToastContext";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import DataTable from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import BackButton from "../../components/common/BackButton";
import ExportPdfButton from "../../components/common/ExportPdfButton";

const emptyForm = {
  fullName: "",
  email: "",
  password: "",
  mobileNumber: "",
  productId: "",
};

function AdminInternalStaff() {
  const toast = useToast();

  const [staff, setStaff] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [showReassignModal, setShowReassignModal] = useState(false);
  const [reassignTarget, setReassignTarget] = useState(null);
  const [reassignProductId, setReassignProductId] = useState("");
  const [reassignSubmitting, setReassignSubmitting] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [staffRes, productsRes] = await Promise.all([
        getUsersByRole("INTERNAL_STAFF", { size: 100 }),
        getActiveProducts(),
      ]);

      setStaff(staffRes.data.records || []);
      setProducts(productsRes.data.records || []);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load internal staff"));
    } finally {
      setLoading(false);
    }
  }

  const validatorMap = {
    fullName: (v) => validateFullName(v, "Full name"),
    email: (v) => validateEmail(v, "Email"),
    password: (v) => validatePassword(v, "Password"),
    mobileNumber: (v) => validateMobile(v, "Mobile number"),
  };

  function runFieldValidation(field, value) {
    const message = validatorMap[field](value);
    setFieldErrors((prev) => ({ ...prev, [field]: message }));
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) runFieldValidation(field, value);
  }

  function handleBlur(field, value) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    runFieldValidation(field, value);
  }

  function openCreateModal() {
    setForm(emptyForm);
    setTouched({});
    setFieldErrors({});
    setShowCreateModal(true);
  }

  async function submitCreate() {
    const { errors, isValid } = validateForm(
      {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        mobileNumber: form.mobileNumber,
      },
      validatorMap,
    );

    setFieldErrors(errors);
    setTouched({
      fullName: true,
      email: true,
      password: true,
      mobileNumber: true,
    });

    if (!isValid) return;

    setSubmitting(true);
    try {
      await createInternalStaff({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        mobileNumber: toE164India(form.mobileNumber),
        role: "INTERNAL_STAFF",
        assignedProductId: form.productId ? Number(form.productId) : null,
      });

      toast.success("Agent created successfully");
      setShowCreateModal(false);
      loadAll();
    } catch (error) {
      const backendErrors = extractValidationErrors(error);
      if (Object.keys(backendErrors).length) {
        setFieldErrors((prev) => ({ ...prev, ...backendErrors }));
      }
      toast.error(getApiErrorMessage(error, "Unable to create agent"));
    } finally {
      setSubmitting(false);
    }
  }

  function openReassignModal(row) {
    setReassignTarget(row);
    setReassignProductId(row.assignedProductId ? String(row.assignedProductId) : "");
    setShowReassignModal(true);
  }

  async function submitReassign() {
    setReassignSubmitting(true);
    try {
      await assignProductToUser(
        reassignTarget.userId,
        reassignProductId ? Number(reassignProductId) : null,
      );

      toast.success(
        reassignProductId
          ? "Product reassigned successfully"
          : "Product assignment cleared",
      );

      setShowReassignModal(false);
      setReassignTarget(null);
      loadAll();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to reassign product"));
    } finally {
      setReassignSubmitting(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card title="Agents (Internal Staff)">
        <BackButton />

        {staff.length > 0 ? (
          <DataTable
            columns={[
              { key: "fullName", label: "Name" },
              { key: "email", label: "Email" },
              { key: "mobileNumber", label: "Mobile" },
              {
                key: "assignedProductName",
                label: "Assigned Product",
                render: (row) =>
                  row.assignedProductName ? (
                    row.assignedProductName
                  ) : (
                    <span className="text-muted">Unassigned</span>
                  ),
              },
              {
                key: "activeStatus",
                label: "Status",
                render: (row) => <StatusBadge status={row.activeStatus} />,
              },
              {
                key: "action",
                label: "Action",
                render: (row) => (
                  <Button size="sm" onClick={() => openReassignModal(row)}>
                    Reassign Product
                  </Button>
                ),
              },
            ]}
            data={staff}
            searchKeys={["fullName", "email", "mobileNumber"]}
            searchPlaceholder="Search agents..."
            headerActions={
              <div className="d-flex gap-2">
                <Button onClick={openCreateModal}>+ Create Agent</Button>

                <ExportPdfButton
                  title="Agents (Internal Staff)"
                  rows={staff}
                  columns={[
                    { label: "Name", key: "fullName" },
                    { label: "Email", key: "email" },
                    { label: "Mobile", key: "mobileNumber" },
                    {
                      label: "Assigned Product",
                      value: (row) => row.assignedProductName || "Unassigned",
                    },
                    {
                      label: "Status",
                      value: (row) => (row.activeStatus ? "Active" : "Inactive"),
                    },
                  ]}
                />
              </div>
            }
          />
        ) : (
          <EmptyState message="No Agents Found" />
        )}
      </Card>

      {/* Create Agent */}
      <Modal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Agent (Internal Staff)"
      >
        <label className="form-label">
          Full Name <span className="text-danger">*</span>
        </label>
        <input
          className={`form-control ${
            touched.fullName && fieldErrors.fullName ? "is-invalid" : ""
          }`}
          value={form.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          onBlur={(e) => handleBlur("fullName", e.target.value)}
        />
        {touched.fullName && fieldErrors.fullName && (
          <div className="invalid-feedback d-block">{fieldErrors.fullName}</div>
        )}

        <label className="form-label mt-3">
          Email <span className="text-danger">*</span>
        </label>
        <input
          type="email"
          className={`form-control ${
            touched.email && fieldErrors.email ? "is-invalid" : ""
          }`}
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={(e) => handleBlur("email", e.target.value)}
        />
        {touched.email && fieldErrors.email && (
          <div className="invalid-feedback d-block">{fieldErrors.email}</div>
        )}

        <label className="form-label mt-3">
          Password <span className="text-danger">*</span>
        </label>
        <input
          type="password"
          className={`form-control ${
            touched.password && fieldErrors.password ? "is-invalid" : ""
          }`}
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          onBlur={(e) => handleBlur("password", e.target.value)}
        />
        {touched.password && fieldErrors.password && (
          <div className="invalid-feedback d-block">{fieldErrors.password}</div>
        )}

        <label className="form-label mt-3">
          Mobile Number <span className="text-danger">*</span>
        </label>
        <input
          className={`form-control ${
            touched.mobileNumber && fieldErrors.mobileNumber ? "is-invalid" : ""
          }`}
          placeholder="10 digit number"
          value={form.mobileNumber}
          onChange={(e) => handleChange("mobileNumber", e.target.value)}
          onBlur={(e) => handleBlur("mobileNumber", e.target.value)}
        />
        {touched.mobileNumber && fieldErrors.mobileNumber && (
          <div className="invalid-feedback d-block">
            {fieldErrors.mobileNumber}
          </div>
        )}

        <label className="form-label mt-3">Assigned Product (optional)</label>
        <select
          className="form-select"
          value={form.productId}
          onChange={(e) => handleChange("productId", e.target.value)}
        >
          <option value="">-- Unassigned --</option>
          {products.map((p) => (
            <option key={p.productId} value={p.productId}>
              {p.productName}
            </option>
          ))}
        </select>

        <div className="mt-4 d-flex gap-2">
          <Button disabled={submitting} onClick={submitCreate}>
            {submitting ? "Creating..." : "Create Agent"}
          </Button>
          <Button
            variant="secondary"
            disabled={submitting}
            onClick={() => setShowCreateModal(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>

      {/* Reassign Product */}
      <Modal
        show={showReassignModal}
        onClose={() => setShowReassignModal(false)}
        title={
          reassignTarget
            ? `Reassign Product — ${reassignTarget.fullName}`
            : "Reassign Product"
        }
      >
        {reassignTarget && (
          <>
            <label className="form-label">Assigned Product</label>
            <select
              className="form-select"
              value={reassignProductId}
              onChange={(e) => setReassignProductId(e.target.value)}
            >
              <option value="">-- Unassigned --</option>
              {products.map((p) => (
                <option key={p.productId} value={p.productId}>
                  {p.productName}
                </option>
              ))}
            </select>

            <p className="text-muted mt-2" style={{ fontSize: "0.85rem" }}>
              Reassigning only affects new claims/policies going forward —
              this agent's in-flight claim reviews are not retroactively
              moved.
            </p>

            <div className="mt-3 d-flex gap-2">
              <Button
                disabled={reassignSubmitting}
                onClick={submitReassign}
              >
                {reassignSubmitting ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="secondary"
                disabled={reassignSubmitting}
                onClick={() => setShowReassignModal(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </Modal>
    </DashboardLayout>
  );
}

export default AdminInternalStaff;