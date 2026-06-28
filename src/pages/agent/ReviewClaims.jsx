import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import DataTable from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import BackButton from "../../components/common/BackButton";
import DashboardLayout from "../../components/layout/DashboardLayout";

import DataTable from "../../components/common/DataTable";

import Button from "../../components/common/Button";

import StatusBadge from "../../components/common/StatusBadge";

import Loader from "../../components/common/Loader";

import EmptyState from "../../components/common/EmptyState";

import Card from "../../components/common/Card";

import {
  getAgentClaims,
  reviewClaim,
  getClaimDetails,
  getClaimHistory,
  viewClaimDocument,
} from "../../api/agentApi";

function ReviewClaims() {
  const [claims, setClaims] = useState([]);

    const [loading,setLoading] = useState(true);

  const [selectedClaim, setSelectedClaim] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [decision, setDecision] = useState("");

  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    loadClaims();
  }, []);

  async function loadClaims() {
    try {
      const response = await getAgentClaims();

      setClaims(response.data.records || []);
    } catch (error) {
      console.log("Loading claims error", error);
    } finally {
      setLoading(false);
    }
  }

  async function openReview(claim) {
    try {
      const details = await getClaimDetails(claim.claimId);

      const history = await getClaimHistory(claim.claimId);

      console.log("CLAIM DETAILS", details.data);

      console.log("CLAIM HISTORY", history.data);

      setSelectedClaim({
        ...claim,

        documents: details.data.documents || [],

        history: history.data.records || history.data || [],

        policyCoverageAmount: details.data.policyCoverageAmount,

        remainingCoverageAmount: details.data.remainingCoverageAmount,
      });

      setShowModal(true);
    } catch (error) {
      console.log("Open review error", error);
    }
  }

 async function openDocument(documentId){

 try{

 const response =
 await viewClaimDocument(documentId);


 window.open(response.request.responseURL,"_blank");


 }catch(error){

 console.log(error);

 }

}

  async function submitReview() {
    if (!decision) {
      alert("Select recommendation");

      return;
    }

    if (!remarks) {
      alert("Enter remarks");

      return;
    }

    const request = {
      recommendedStatus: decision,

      remarks: remarks,
    };

    try {
      await reviewClaim(
        selectedClaim.claimId,

        request,
      );

      alert("Claim reviewed successfully");

      setShowModal(false);

      setDecision("");

      setRemarks("");

      setSelectedClaim(null);

      loadClaims();
    } catch (error) {
      console.log("Review error", error);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  const pendingClaims = claims.filter(
    (claim) => claim.claimStatus === "SUBMITTED",
  );

  return (
    <DashboardLayout>
      <Card title="Review Claims">
        <BackButton />

        {pendingClaims.length > 0 ? (
          <DataTable
            columns={[
              {
                key: "claimNumber",

                label: "Claim",
              },

              {
                key: "customerName",

                label: "Customer",
              },

              {
                key: "claimAmount",

                label: "Amount",
              },

              {
                key: "claimStatus",

                label: "Status",

                render: (row) => <StatusBadge status={row.claimStatus} />,
              },

              {
                key: "action",

                label: "Action",

                render: (row) => (
                  <Button onClick={() => openReview(row)}>Review</Button>
                ),
              },
            ]}
            data={pendingClaims}
          />
        ) : (
          <EmptyState message="No Pending Claims" />
        )}
      </Card>

      <Modal
        show={showModal}
        onClose={() => {
          setShowModal(false);

          setSelectedClaim(null);
        }}
        title="Claim Review"
      >
        {selectedClaim && (
          <>
            <h6>Customer :{selectedClaim.customerName}</h6>

            <p>Policy :{selectedClaim.policyNumber}</p>

            <p>Claim Amount :{selectedClaim.claimAmount}</p>

            <p>Coverage :{selectedClaim.policyCoverageAmount}</p>

            <p>Remaining :{selectedClaim.remainingCoverageAmount}</p>

            <h6>Documents</h6>

            {selectedClaim.documents.length > 0 ? (
              selectedClaim.documents.map((doc) => (
                <div key={doc.documentId}>
                  <Button onClick={() => openDocument(doc.documentId)}>
                    {doc.documentName}
                    
                  </Button>
                </div>
              ))
            ) : (
              <p>No documents submitted</p>
            )}

            <h6>Claim History</h6>

            {selectedClaim.history.length > 0 ? (
              selectedClaim.history.map((item, index) => (
                <div key={index}>
                  <p>
                    {item.previousStatus}

                    {" → "}

                    {item.newStatus}
                  </p>

                  <p>{item.remarks}</p>

                  <hr />
                </div>
              ))
            ) : (
              <p>No history available</p>
            )}

            <h6>Recommendation</h6>

            <select
              className="form-control mb-3"
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
            >
              <option value="">Select</option>

              <option value="RECOMMENDED_APPROVAL">Recommend Approval</option>

              <option value="RECOMMENDED_REJECTION">Recommend Rejection</option>
            </select>

            <textarea
              className="form-control mb-3"
              placeholder="Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <Button onClick={submitReview}>Submit Review</Button>
          </>
        )}
      </Modal>
    </DashboardLayout>
  );
}

export default ReviewClaims;