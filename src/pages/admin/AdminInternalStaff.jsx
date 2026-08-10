import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getUsersByRole,
  createInternalStaff,
  assignProductToUser,
  updateUser
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
import Modal from "../../components/common/Modal";
import BackButton from "../../components/common/BackButton";
import ExportPdfButton from "../../components/common/ExportPdfButton";
import { fetchAllPages } from "../../utils/fetchAllPages";

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

  const [editMode, setEditMode] = useState(false);
  const [editTargetId, setEditTargetId] = useState(null);

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
      const [staffRecords, productRecords] = await Promise.all([
        fetchAllPages((page, size) => getUsersByRole("INTERNAL_STAFF", { page, size })),
        fetchAllPages((page, size) => getActiveProducts({ page, size })),
      ]);
      setStaff(staffRecords);
      setProducts(productRecords);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load internal staff"));
    } finally {
      setLoading(false);
    }
  }

  // Baseline granular field rule definitions
  const baseValidators = {
    fullName: (v) => validateFullName(v, "Full name"),
    email: (v) => validateEmail(v, "Email"),
    mobileNumber: (v) => validateMobile(v, "Mobile number"),
  };

  function runFieldValidation(field, value) {
    if (editMode && field === "password") return;
    const rule = field === "password" ? (v) => validatePassword(v, "Password", { maxLength: 20 }) : baseValidators[field];
    if (!rule) return;
    const message = rule(value);
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
    setEditMode(false);
    setEditTargetId(null);
    setForm(emptyForm);
    setTouched({});
    setFieldErrors({});
    setShowCreateModal(true);
  }

  function openEditModal(row) {
    setEditMode(true);
    setEditTargetId(row.userId || row.id);
    setForm({
      fullName: row.fullName || "",
      email: row.email || "",
      password: "",
      mobileNumber: row.mobileNumber ? row.mobileNumber.replace("+91", "") : "",
      productId: row.assignedProductId ? String(row.assignedProductId) : "",
    });
    setTouched({});
    setFieldErrors({});
    setShowCreateModal(true);
  }

  async function submitForm(e) {
    if (e) e.preventDefault();

    // 📦 DYNAMIC PAYLOAD OBJECT CONTEXT BUILDER
    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      mobileNumber: form.mobileNumber.trim(),
    };

    // 📦 DYNAMIC VALIDATION RULES MAP (Prevents undefined parsing thread freezes)
    const activeRules = { ...baseValidators };

    if (!editMode) {
      payload.password = form.password;
      activeRules.password = (v) => validatePassword(v, "Password", { maxLength: 20 });
    }



    // Runs checking loops cleanly over exact active attributes only
    const { errors, isValid } = validateForm(payload, activeRules);
    setFieldErrors(errors);

    setTouched({
      fullName: true,
      email: true,
      mobileNumber: true,
      password: !editMode,
    });

    if (!isValid) {
      
      toast.error("Please clean up the highlighted input errors before updating.");
      return;
    }

    setSubmitting(true);

    try {
      if (editMode) {
        // Enforces country prefix clean wrapping inside backend REST operations
        const response = await updateUser(editTargetId, {
          fullName: payload.fullName,
          email: payload.email,
          mobileNumber: toE164India(payload.mobileNumber),
          assignedProductId: form.productId ? Number(form.productId) : null,
        });
        
        toast.success("Agent profile details saved successfully!");
      } else {
        await createInternalStaff({
          fullName: payload.fullName,
          email: payload.email,
          password: payload.password,
          mobileNumber: toE164India(payload.mobileNumber),
          role: "INTERNAL_STAFF",
          assignedProductId: form.productId ? Number(form.productId) : null,
        });
        toast.success("Agent user node created successfully.");
      }
      setShowCreateModal(false);
      loadAll();
    } catch (error) {
      const backendErrors = extractValidationErrors(error);
      if (Object.keys(backendErrors).length) {
        setFieldErrors((prev) => ({ ...prev, ...backendErrors }));
      }
    
      toast.error(getApiErrorMessage(error, editMode ? "Could not modify agent details." : "Unable to compile agent entry."));
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
        reassignTarget.userId || reassignTarget.id,
        reassignProductId ? Number(reassignProductId) : null,
      );
      toast.success(reassignProductId ? "Product assignment updated successfully" : "Product assignment cleared.");
      setShowReassignModal(false);
      setReassignTarget(null);
      loadAll();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to update product reassignment link."));
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

        <DataTable
            emptyMessage="No Agents Found"
            columns={[
              { key: "fullName", label: "Name" },
              { key: "email", label: "Email" },
              { key: "mobileNumber", label: "Mobile" },
              {
                key: "assignedProductName",
                label: "Assigned Product",
                render: (row) => row.assignedProductName || <span className="text-muted">Unassigned</span>,
              },
              {
                key: "activeStatus",
                label: "Status",
                render: (row) => <StatusBadge status={row.activeStatus} />,
              },
              {
                key: "action",
                label: "Actions",
                render: (row) => (
                  <div className="d-flex gap-2">
                    <Button size="sm" variant="outline-primary" onClick={() => openEditModal(row)}>
                       Edit
                    </Button>
                    <Button size="sm" variant="outline-secondary" onClick={() => openReassignModal(row)}>
                      Reassign Product
                    </Button>
                  </div>
                ),
              },
            ]}
            data={staff}
            searchKeys={["fullName", "email", "mobileNumber"]}
            searchPlaceholder="Search agents..."
            headerActions={({ pageRows, filteredRows }) => {
              const columns = [
                { label: "Name", key: "fullName" },
                { label: "Email", key: "email" },
                { label: "Mobile", key: "mobileNumber" },
                { label: "Assigned Product", value: (row) => row.assignedProductName || "Unassigned" },
                { label: "Status", value: (row) => (row.activeStatus ? "Active" : "Inactive") },
              ];

              return (
                <div className="d-flex gap-2">
                  <Button onClick={openCreateModal}>+ Create Agent</Button>

                  <ExportPdfButton title="Agents (This Page)" fileName="agents-page" label="Export Page" rows={pageRows} columns={columns} />
                  <ExportPdfButton title="Agents (All)" fileName="agents-all" label="Export All" rows={filteredRows} columns={columns} />
                </div>
              );
            }}
          />
      </Card>

      {/* Forms Management Modal Wrapper Sheet */}
      <Modal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={editMode ? "Modify Agent Details" : "Create Agent (Internal Staff)"}
      >
        <form onSubmit={submitForm} noValidate>
          <div className="mb-3">
            <label className="form-label font-weight-bold small text-muted">Full Name <span className="text-danger">*</span></label>
            <input
              className={`form-control ${touched.fullName && fieldErrors.fullName ? "is-invalid" : ""}`}
              value={form.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              onBlur={(e) => handleBlur("fullName", e.target.value)}
              placeholder="Enter full name"
            />
            {touched.fullName && fieldErrors.fullName && <div className="invalid-feedback">{fieldErrors.fullName}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label font-weight-bold small text-muted">Email Address <span className="text-danger">*</span></label>
            <input
              type="email"
              className={`form-control ${touched.email && fieldErrors.email ? "is-invalid" : ""}`}
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={(e) => handleBlur("email", e.target.value)}
              placeholder="name@company.com"
              disabled={editMode}
            />
            {editMode && (
              <div className="form-text small">
                Email is locked once an agent account exists, since it's their login ID. Deactivate and recreate the account if it must change.
              </div>
            )}
            {touched.email && fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
          </div>

          {!editMode && (
            <div className="mb-3">
              <label className="form-label font-weight-bold small text-muted">Password <span className="text-danger">*</span></label>
              <input
                type="password"
                className={`form-control ${touched.password && fieldErrors.password ? "is-invalid" : ""}`}
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={(e) => handleBlur("password", e.target.value)}
                placeholder="Enter account security password"
              />
              {touched.password && fieldErrors.password && <div className="invalid-feedback">{fieldErrors.password}</div>}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label font-weight-bold small text-muted">Mobile Number <span className="text-danger">*</span></label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted">+91</span>
              <input
                name="mobileNumber"
                className={`form-control ${touched.mobileNumber && fieldErrors.mobileNumber ? "is-invalid" : ""}`}
                value={form.mobileNumber}
                onChange={(e) => handleChange("mobileNumber", e.target.value.replace(/\D/g, "").slice(0, 10))}
                onBlur={(e) => handleBlur("mobileNumber", e.target.value)}
                placeholder="10-digit primary contact number"
              />
            </div>
            {touched.mobileNumber && fieldErrors.mobileNumber && <div className="text-danger small mt-1">{fieldErrors.mobileNumber}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label font-weight-bold small text-muted">Assign Insurance Product</label>
            <select
              className="form-select"
              value={form.productId}
              onChange={(e) => handleChange("productId", e.target.value)}
            >
              <option value="">Select a product domain catalog (Optional)</option>
              {products.map((p) => (
                <option key={p.productId || p.id} value={p.productId || p.id}>
                  {p.productName}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex justify-content-end gap-2 pt-2 border-top">
            <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="success" disabled={submitting}>
              {submitting ? "Saving changes..." : editMode ? "Save Changes" : "Create Agent"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Product Reassignment Modal Form panel layout container */}
      <Modal
        show={showReassignModal}
        onClose={() => setShowReassignModal(false)}
        title="Quick Product Reassignment"
      >
        <div className="mb-3">
          <p className="text-muted small">
            Modify product domain context for: <strong>{reassignTarget?.fullName}</strong>
          </p>
          <select
            className="form-select"
            value={reassignProductId}
            onChange={(e) => setReassignProductId(e.target.value)}
          >
            <option value="">Unassigned (organizational tag only — not an access restriction)</option>
            {products.map((p) => (
              <option key={p.productId || p.id} value={p.productId || p.id}>
                {p.productName}
              </option>
            ))}
          </select>
        </div>
        <div className="d-flex justify-content-end gap-2 pt-2 border-top">
          <Button type="button" variant="secondary" onClick={() => setShowReassignModal(false)}>
            Cancel
          </Button>
          <Button type="button" variant="primary" onClick={submitReassign} disabled={reassignSubmitting}>
            {reassignSubmitting ? "Updating link..." : "Confirm Reassignment"}
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

export default AdminInternalStaff;