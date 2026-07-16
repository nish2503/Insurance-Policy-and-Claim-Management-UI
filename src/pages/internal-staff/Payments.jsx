import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import { getInternalStaffPayments } from "../../api/internalStaffApi";
import BackButton from "../../components/common/BackButton";
import ExportPdfButton from "../../components/common/ExportPdfButton";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    try {
      const res = await getInternalStaffPayments();
      setPayments(res.data.records || res.data.content || res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
      <Card title="Premium Payments">
        <BackButton />

        {payments.length ? (
          <DataTable
            columns={[
              {
                key: "paymentId",
                label: "ID",
              },
              {
                key: "policyNumber",
                label: "Policy Number",
              },
              {
                key: "customerNameCustom", // 🛠️ Injects the fresh database field configuration cleanly
                label: "Customer Name",
              },
              {
                key: "transactionReference",
                label: "Transaction Ref",
              },
              {
                key: "amountCustom",
                label: "Amount",
              },
              {
                key: "paymentMode",
                label: "Mode",
              },
              {
                key: "paymentStatusCustom",
                label: "Status",
              },
            ]}
            data={payments.map((p) => ({
              ...p,
              customerNameCustom: p.customerName || "N/A",
              amountCustom: `₹${p.amount}`,
              paymentStatusCustom: <StatusBadge status={p.paymentStatus} />,
            }))}
            searchKeys={[
              "policyNumber",
              "customerNameCustom", // Enables searching by customer names instantly
              "transactionReference",
              "paymentMode",
              "paymentStatus",
            ]}
            headerActions={
              <ExportPdfButton
                title="Premium Payments"
                rows={payments}
                columns={[
                  { label: "ID", key: "paymentId" },
                  { label: "Policy Number", key: "policyNumber" },
                  { label: "Customer Name", value: (row) => row.customerName || "N/A" },
                  { label: "Transaction Ref", key: "transactionReference" },
                  { label: "Amount", value: (row) => `₹${row.amount}` },
                  { label: "Mode", key: "paymentMode" },
                  { label: "Status", key: "paymentStatus" },
                ]}
              />
            }
          />
        ) : (
          <EmptyState message="No Payments Found" />
        )}
      </Card>
    </DashboardLayout>
  );
}

export default Payments;