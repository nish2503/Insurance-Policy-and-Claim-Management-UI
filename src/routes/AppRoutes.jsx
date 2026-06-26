import { Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import Unauthorized from "../pages/public/Unauthorized";
import VerifyOtp from "../pages/public/VerifyOtp";
import ForgotPassword from "../pages/public/ForgotPassword";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AgentDashboard from "../pages/agent/AgentDashboard";
import CustomerDashboard from "../pages/customer/CustomerDashboard";

import AgentCustomers from "../pages/agent/Customers";
import ReviewClaims from "../pages/agent/ReviewClaims";
import IssuePolicy from "../pages/agent/IssuePolicy";
import Policies from "../pages/agent/Policies";
import AgentPayments from "../pages/agent/Payments";

import CreateProfile from "../pages/customer/CreateProfile";
import BrowseProducts from "../pages/customer/BrowseProducts";
import Plans from "../pages/customer/Plans";
import PurchasePolicy from "../pages/customer/PurchasePolicy";
import MyPolicies from "../pages/customer/MyPolicies";
import PayPremium from "../pages/customer/PayPremium";
import RaiseClaim from "../pages/customer/RaiseClaim";
import MyClaims from "../pages/customer/MyClaims";

import ProtectedRoute from "../components/protected/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/verify-register" element={<VerifyOtp />} />
      <Route path="/forgot-password/:token?" element={<ForgotPassword />} />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Agent */}
      <Route
        path="/agent"
        element={
          <ProtectedRoute allowedRole="AGENT">
            <AgentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agent/customers"
        element={
          <ProtectedRoute allowedRole="AGENT">
            <AgentCustomers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agent/review-claims"
        element={
          <ProtectedRoute allowedRole="AGENT">
            <ReviewClaims />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agent/issue-policy"
        element={
          <ProtectedRoute allowedRole="AGENT">
            <IssuePolicy />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agent/policies"
        element={
          <ProtectedRoute allowedRole="AGENT">
            <Policies />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agent/payments"
        element={
          <ProtectedRoute allowedRole="AGENT">
            <AgentPayments />
          </ProtectedRoute>
        }
      />

      {/* Customer */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRole="CUSTOMER">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/create-profile"
        element={
          <ProtectedRoute allowedRole="CUSTOMER">
            <CreateProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/products"
        element={
          <ProtectedRoute allowedRole="CUSTOMER">
            <BrowseProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/plans/:productId"
        element={
          <ProtectedRoute allowedRole="CUSTOMER">
            <Plans />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/purchase-policy/:planId"
        element={
          <ProtectedRoute allowedRole="CUSTOMER">
            <PurchasePolicy />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/policies"
        element={
          <ProtectedRoute allowedRole="CUSTOMER">
            <MyPolicies />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/premium-payments"
        element={
          <ProtectedRoute allowedRole="CUSTOMER">
            <PayPremium />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/raise-claim"
        element={
          <ProtectedRoute allowedRole="CUSTOMER">
            <RaiseClaim />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/claims"
        element={
          <ProtectedRoute allowedRole="CUSTOMER">
            <MyClaims />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
