import { useEffect, useState } from "react";

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

import {
  getInternalStaffClaims,
  reviewClaim,
  getClaimDetails,
  viewClaimDocument,
} from "../../api/internalStaffApi";

import { validateRemarks, validateForm } from "../../utils/validators";
import { getApiErrorMessage } from "../../utils/apiError";
import { useToast } from "../../context/ToastContext";

const REVIEWABLE_STATUSES = ["SUBMITTED", "UNDER_REVIEW"];

function ReviewClaims() {
  const toast = useToast();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ACTIONABLE");

  const [selectedClaim, setSelectedClaim] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [decision, setDecision] = useState("");
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
      const response = await getInternalStaffClaims({ size: 100 });
      setClaims(
        response.data.records || response.data.content || response.data || [],
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load claims"));
    } finally {
      setLoading(false);
    }
  }

  async function openReview(claim) {
    setShowModal(true);
    setDetailLoading(true);
    setSelectedClaim(null);
    setDecision("");
    setRemarks("");
    setTouched({});
    setFieldErrors({});

    try {
      const response = await getClaimDetails(claim.claimId);
      setSelectedClaim(response.data);
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "This claim is locked or currently being processed by another internal staff member",
        ),
      );
      setShowModal(false);
      loadClaims();
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
    decision: (value) => (value ? "" : "Please select a recommendation"),
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

  async function submitReview() {
    if (!selectedClaim) return;

    const { errors, isValid } = validateForm(
      { decision, remarks },
      validatorMap,
    );

    setFieldErrors(errors);
    setTouched({ decision: true, remarks: true });

    if (!isValid) return;

    setSubmitting(true);
    try {
      await reviewClaim(selectedClaim.claimId, {
        recommendedStatus: decision,
        remarks: remarks.trim(),
      });

      toast.success(
        decision === "RECOMMENDED_APPROVAL"
          ? "Approval recommended successfully"
          : "Rejection recommended successfully",
      );

      closeModal();
      loadClaims();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to submit recommendation"));
    } finally {
      setSubmitting(false);
    }
  }

  // "ACTIONABLE" (the default) reproduces the queue's original behavior —
  // only claims an agent can actually do something with. The other options
  // let an agent look up claims they've already handled without changing
  // what shows up by default.
  const visibleClaims =
    statusFilter === "ALL"
      ? claims
      : statusFilter === "ACTIONABLE"
        ? claims.filter((claim) => REVIEWABLE_STATUSES.includes(claim.claimStatus))
        : claims.filter((claim) => claim.claimStatus === statusFilter);

  const isReviewable =
    selectedClaim && REVIEWABLE_STATUSES.includes(selectedClaim.claimStatus);

  if (loading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card title="Review Claims Queue">
        <BackButton />

        <DataTable
            emptyMessage="No Claims Match This Filter"
            columns={[
              { key: "claimNumber", label: "Claim No." },
              { key: "customerName", label: "Customer" },
              { key: "policyNumber", label: "Policy No." },
              {
                key: "claimAmount",
                label: "Amount",
                render: (r) => `₹${r.claimAmount}`,
              },
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
                render: (row) =>
                  REVIEWABLE_STATUSES.includes(row.claimStatus) ? (
                    <Button size="sm" onClick={() => openReview(row)}>
                      {row.claimStatus === "UNDER_REVIEW"
                        ? "Resume Review"
                        : "Start Review"}
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => openReview(row)}>
                      View
                    </Button>
                  ),
              },
            ]}
            data={visibleClaims}
            searchKeys={["claimNumber", "customerName", "policyNumber"]}
            searchPlaceholder="Search claims..."
            headerActions={
              <div className="d-flex gap-2">
                <StatusFilter
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    { value: "ACTIONABLE", label: "Needs Action (default)" },
                    { value: "ALL", label: "All Statuses" },
                    { value: "SUBMITTED", label: "Submitted" },
                    { value: "UNDER_REVIEW", label: "Under Review" },
                    { value: "RECOMMENDED_APPROVAL", label: "Recommended Approval" },
                    { value: "RECOMMENDED_REJECTION", label: "Recommended Rejection" },
                    { value: "APPROVED", label: "Approved" },
                    { value: "REJECTED", label: "Rejected" },
                  ]}
                />

                <ExportPdfButton
                  title="Review Claims Queue"
                  rows={visibleClaims}
                  meta={{ "Status filter": statusFilter }}
                  columns={[
                    { label: "Claim No.", key: "claimNumber" },
                    { label: "Customer", key: "customerName" },
                    { label: "Policy No.", key: "policyNumber" },
                    { label: "Amount", value: (row) => `₹${row.claimAmount}` },
                    { label: "Status", key: "claimStatus" },
                    {
                      label: "Submitted",
                      value: (row) =>
                        row.createdDate
                          ? new Date(row.createdDate).toLocaleDateString()
                          : "-",
                    },
                  ]}
                />
              </div>
            }
          />
      </Card>

      <Modal show={showModal} onClose={closeModal} title="Claim Review">
        {detailLoading ? (
          <Loader />
        ) : selectedClaim ? (
          <>
            <ClaimDetailPanel claim={selectedClaim} onViewDocument={openDocument} />

            {isReviewable ? (
              <div className="mt-3 pt-3 border-top">
                <div className="mb-3">
                  <label className="form-label font-weight-bold small text-muted">
                    Recommendation *
                  </label>
                  <select
                    className={`form-select ${touched.decision && fieldErrors.decision ? "is-invalid" : ""}`}
                    value={decision}
                    onChange={(e) => {
                      setDecision(e.target.value);
                      if (touched.decision) runFieldValidation("decision", e.target.value);
                    }}
                    onBlur={(e) => handleBlur("decision", e.target.value)}
                  >
                    <option value="">Select a recommendation</option>
                    <option value="RECOMMENDED_APPROVAL">Recommend Approval</option>
                    <option value="RECOMMENDED_REJECTION">Recommend Rejection</option>
                  </select>
                  {touched.decision && fieldErrors.decision && (
                    <div className="invalid-feedback d-block">{fieldErrors.decision}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label font-weight-bold small text-muted">
                    Remarks *
                  </label>
                  <textarea
                    rows="3"
                    className={`form-control ${touched.remarks && fieldErrors.remarks ? "is-invalid" : ""}`}
                    value={remarks}
                    onChange={(e) => {
                      setRemarks(e.target.value);
                      if (touched.remarks) runFieldValidation("remarks", e.target.value);
                    }}
                    onBlur={(e) => handleBlur("remarks", e.target.value)}
                    placeholder="Explain your recommendation (min. 15 characters)..."
                  />
                  {touched.remarks && fieldErrors.remarks && (
                    <div className="invalid-feedback d-block">{fieldErrors.remarks}</div>
                  )}
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="success"
                    disabled={submitting}
                    onClick={submitReview}
                  >
                    {submitting ? "Submitting..." : "Submit Recommendation"}
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
                This claim is at status ({selectedClaim.claimStatus}) and is
                view-only from this queue — only Admin can take further action
                on it.
              </div>
            )}
          </>
        ) : null}
      </Modal>
    </DashboardLayout>
  );
}

export default ReviewClaims;