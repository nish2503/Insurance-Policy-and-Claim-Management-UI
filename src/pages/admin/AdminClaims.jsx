import { useEffect, useState } from "react";

import {
  getClaimsPendingAdminDecision,
  getClaimById,
  viewClaimDocument,
  processClaimDecision,
} from "../../api/claimApi";

import { validateRemarks, validateForm } from "../../utils/validators";
import { getApiErrorMessage } from "../../utils/apiError";
import { useToast } from "../../context/ToastContext";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import DataTable from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import StatusFilter from "../../components/common/StatusFilter";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import BackButton from "../../components/common/BackButton";
import ClaimDetailPanel from "../../components/common/ClaimDetailPanel";
import ExportPdfButton from "../../components/common/ExportPdfButton";
import { fetchAllPages } from "../../utils/fetchAllPages";

// Claim statuses that still need a final admin decision. Claims already
// APPROVED/REJECTED are shown for audit purposes but rendered read-only
// (CLM-BR-009 — approved/rejected claims cannot be modified again).
const DECIDABLE_STATUSES = [
  "UNDER_REVIEW",
  "RECOMMENDED_APPROVAL",
  "RECOMMENDED_REJECTION",
];

function AdminClaims() {
  const toast = useToast();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedClaim, setSelectedClaim] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [decisionStatus, setDecisionStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadClaims();
  }, []);

  async function loadClaims() {
    setLoading(true);
    try {
      // CLC-RUL-004 / SRS §7.1: this endpoint already excludes SUBMITTED
      // claims that haven't been reviewed by internal staff yet — admin's
      // authority is the final decision only, not initial triage.
      const records = await fetchAllPages((page, size) =>
        getClaimsPendingAdminDecision({ page, size }),
      );
      setClaims(records);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load claims"));
    } finally {
      setLoading(false);
    }
  }

  async function openClaim(claim) {
    setShowModal(true);
    setDetailLoading(true);
    setSelectedClaim(null);
    setDecisionStatus("");
    setRemarks("");
    setTouched({});
    setFieldErrors({});

    try {
      const response = await getClaimById(claim.claimId);
      setSelectedClaim(response.data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load claim details"));
      setShowModal(false);
    } finally {
      setDetailLoading(false);
    }
  }

  function closeModal() {
    setShowModal(false);
    setSelectedClaim(null);
  }

  async function openDocument(documentId) {
    try {
      const response = await viewClaimDocument(documentId);
      window.open(response.request.responseURL, "_blank");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to open document"));
    }
  }

  const validatorMap = {
    decisionStatus: (value) =>
      value ? "" : "Please select a final decision",
    remarks: (value) => validateRemarks(value, "Remarks", 15),
  };

  function runFieldValidation(field, value) {
    const message = validatorMap[field](value);
    setFieldErrors((prev) => ({ ...prev, [field]: message }));
  }

  function handleBlur(field, value) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    runFieldValidation(field, value);
  }

  async function submitDecision() {
    const { errors, isValid } = validateForm(
      { decisionStatus, remarks },
      validatorMap,
    );

    setFieldErrors(errors);
    setTouched({ decisionStatus: true, remarks: true });

    if (!isValid) return;

    setSubmitting(true);
    try {
      await processClaimDecision(selectedClaim.claimId, {
        finalDecisionStatus: decisionStatus,
        remarks: remarks.trim(),
      });

      toast.success(
        decisionStatus === "APPROVED"
          ? "Claim approved successfully"
          : "Claim rejected successfully",
      );

      closeModal();
      loadClaims();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to submit decision"));
    } finally {
      setSubmitting(false);
    }
  }

  const visibleClaims =
    statusFilter === "ALL"
      ? claims
      : claims.filter((c) => c.claimStatus === statusFilter);

  const isDecidable =
    selectedClaim && DECIDABLE_STATUSES.includes(selectedClaim.claimStatus);

  if (loading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card title="Claims — Final Decision Queue">
        <BackButton />

        <DataTable
            emptyMessage="No Claims Awaiting Decision"
            columns={[
              { key: "claimNumber", label: "Claim No." },
              { key: "customerName", label: "Customer" },
              { key: "policyNumber", label: "Policy No." },
              { key: "claimAmount", label: "Amount", render: (r) => `₹${r.claimAmount}` },
              {
                key: "claimStatus",
                label: "Status",
                render: (row) => <StatusBadge status={row.claimStatus} />,
              },
              {
                key: "createdDate",
                label: "Submitted",
                render: (row) =>
                  row.createdDate
                    ? new Date(row.createdDate).toLocaleDateString()
                    : "—",
              },
              {
                key: "action",
                label: "Action",
                render: (row) => (
                  <Button size="sm" onClick={() => openClaim(row)}>
                    {DECIDABLE_STATUSES.includes(row.claimStatus)
                      ? "Review & Decide"
                      : "View"}
                  </Button>
                ),
              },
            ]}
            data={visibleClaims}
            searchKeys={["claimNumber", "customerName", "policyNumber"]}
            searchPlaceholder="Search claims..."
            headerActions={({ pageRows, filteredRows }) => {
              const columns = [
                { label: "Claim No.", key: "claimNumber" },
                { label: "Customer", key: "customerName" },
                { label: "Policy No.", key: "policyNumber" },
                { label: "Amount", value: (row) => `₹${Number(row.claimAmount).toLocaleString()}` },
                { label: "Status", key: "claimStatus" },
                {
                  label: "Submitted",
                  value: (row) =>
                    row.createdDate ? new Date(row.createdDate).toLocaleDateString() : "-",
                },
              ];
              const meta = {
                "Status filter": statusFilter === "ALL" ? "All (excl. Submitted)" : statusFilter,
              };

              return (
                <div className="d-flex gap-2">
                  <StatusFilter
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={[
                      { value: "ALL", label: "All (excl. Submitted)" },
                      { value: "UNDER_REVIEW", label: "Under Review" },
                      { value: "RECOMMENDED_APPROVAL", label: "Recommended Approval" },
                      { value: "RECOMMENDED_REJECTION", label: "Recommended Rejection" },
                      { value: "APPROVED", label: "Approved" },
                      { value: "REJECTED", label: "Rejected" },
                    ]}
                  />

                  <ExportPdfButton
                    title="Claims — Final Decision Queue (This Page)"
                    fileName="claims-decision-queue-page"
                    label="Export Page"
                    rows={pageRows}
                    meta={meta}
                    columns={columns}
                  />

                  <ExportPdfButton
                    title="Claims — Final Decision Queue (All)"
                    fileName="claims-decision-queue-all"
                    label="Export All"
                    rows={filteredRows}
                    meta={meta}
                    columns={columns}
                  />
                </div>
              );
            }}
          />
      </Card>

      <Modal
        show={showModal}
        onClose={closeModal}
        title={
          selectedClaim
            ? `Claim ${selectedClaim.claimNumber}`
            : "Loading Claim..."
        }
      >
        {detailLoading && <Loader />}

        {!detailLoading && selectedClaim && (
          <>
            <ClaimDetailPanel
              claim={selectedClaim}
              onViewDocument={openDocument}
            />

            {isDecidable ? (
              <div className="claim-decision-form mt-3 pt-3 border-top">
                <h6 className="mb-3">Final Decision</h6>

                <label className="form-label">
                  Decision <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${
                    touched.decisionStatus && fieldErrors.decisionStatus
                      ? "is-invalid"
                      : ""
                  }`}
                  value={decisionStatus}
                  onChange={(e) => {
                    setDecisionStatus(e.target.value);
                    if (touched.decisionStatus)
                      runFieldValidation("decisionStatus", e.target.value);
                  }}
                  onBlur={(e) => handleBlur("decisionStatus", e.target.value)}
                >
                  <option value="">-- Select Decision --</option>
                  <option value="APPROVED">Approve Claim</option>
                  <option value="REJECTED">Reject Claim</option>
                </select>
                {touched.decisionStatus && fieldErrors.decisionStatus && (
                  <div className="invalid-feedback d-block">
                    {fieldErrors.decisionStatus}
                  </div>
                )}

                <label className="form-label mt-3">
                  Remarks <span className="text-danger">*</span>
                </label>
                <textarea
                  className={`form-control ${
                    touched.remarks && fieldErrors.remarks ? "is-invalid" : ""
                  }`}
                  rows="3"
                  placeholder="Explain the basis for this decision (min. 15 characters)"
                  value={remarks}
                  onChange={(e) => {
                    setRemarks(e.target.value);
                    if (touched.remarks)
                      runFieldValidation("remarks", e.target.value);
                  }}
                  onBlur={(e) => handleBlur("remarks", e.target.value)}
                />
                {touched.remarks && fieldErrors.remarks && (
                  <div className="invalid-feedback d-block">
                    {fieldErrors.remarks}
                  </div>
                )}

                <div className="mt-3 d-flex gap-2">
                  <Button
                    variant="success"
                    disabled={submitting}
                    onClick={submitDecision}
                  >
                    {submitting ? "Submitting..." : "Submit Decision"}
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={submitting}
                    onClick={closeModal}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="alert alert-secondary mt-3">
                This claim has already reached a final status (
                {selectedClaim.claimStatus}) and cannot be modified again.
              </div>
            )}
          </>
        )}
      </Modal>
    </DashboardLayout>
  );
}

export default AdminClaims;