import React, { useLayoutEffect } from "react";
import { Route, Routes } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";
import { useLocation } from "react-router";
const Login = React.lazy(() => import("./screens/Login"));
const Dashboard = React.lazy(() => import("./screens/Dashboard"));
const ProtectedRoute = React.lazy(
  () => import("./components/common/ProtectedRoute")
);
const PublicRoute = React.lazy(() => import("./components/common/PublicRoute"));
const Buy = React.lazy(() => import("./screens/Buy"));
const ScanAndSell = React.lazy(() => import("./screens/ScanAndSell2"));
const Order = React.lazy(() => import("./screens/Order"));
const Payment = React.lazy(() => import("./screens/Payment"));
const Sell = React.lazy(() => import("./screens/Sell"));
const Support = React.lazy(() => import("./screens/Support"));
const Limit = React.lazy(() => import("./screens/Limit"));
const Transaction = React.lazy(() => import("./screens/Transaction"));
const Settings = React.lazy(() => import("./screens/Settings"));
const Refer = React.lazy(() => import("./screens/Refer"));
const GettingStarted = React.lazy(
  () => import("./screens/Support/GettingStarted")
);
const General = React.lazy(() => import("./screens/Support/General"));
const Limits = React.lazy(() => import("./screens/Support/Limits"));
const ReferAndEarn = React.lazy(() => import("./screens/Support/ReferAndEarn"));
const Trx = React.lazy(() => import("./screens/Support/Transaction"));
const DepositAndWithdraw = React.lazy(
  () => import("./screens/Support/DepositAndWithdraw")
);
const AllFaq = React.lazy(() => import("./screens/Support/AllFaq"));
const NotFound = React.lazy(() => import("./components/common/NotFound"));
const Error = React.lazy(() => import("./components/common/Error"));
const Success = React.lazy(() => import("./components/common/Success"));
const Verification = React.lazy(
  () => import("./components/common/Verification")
);
// const Dispute = React.lazy(() => import("./screens/Dispute"));
const DisputeStatus = React.lazy(() => import("./screens/DisputeStatus"));

const ConfirmSell = React.lazy(() => import("./screens/ConfirmSell"));
const OrderDetails = React.lazy(() => import("./screens/OrderDetails"));
const IncompleteOrders = React.lazy(() => import("./screens/IncompleteOrders"));
const DisputeForm = React.lazy(() => import("./screens/DisputeForm"));

const App: React.FC = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  const showError = useSelector(
    (state: RootState) => state.model.showErrorModel
  );

  const showSuccess = useSelector(
    (state: RootState) => state.model.showSuccessModel
  );

  return (
    <div>
      {showError && <Error />}
      {showSuccess && <Success />}
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center text-xl font-semibold"></div>
        }
      >
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/:id?" element={<Login />} />
            <Route path="/auth/verification" element={<Verification />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/buy" element={<Buy />} />
            <Route path="/scan" element={<ScanAndSell />} />
            <Route
              path="/confirm-sell/:inr/:usdt/:order_id"
              element={<ConfirmSell />}
            />
            <Route path="/order" element={<Order />} />
            <Route path="/order/:order_id?" element={<OrderDetails />} />
            <Route path="/payment" element={<Payment />} />

            <Route path="/sell" element={<Sell />} />
            <Route path="/support" element={<Support />} />

            <Route
              path="/support/gettingstarted"
              element={<GettingStarted />}
            />
            <Route path="/support/general" element={<General />} />
            <Route path="/support/limits" element={<Limits />} />
            <Route path="/support/refer&earn" element={<ReferAndEarn />} />
            <Route path="/support/transactions" element={<Trx />} />
            <Route
              path="/support/deposit&withdraw"
              element={<DepositAndWithdraw />}
            />
            <Route path="/support/allfaqs" element={<AllFaq />} />

            <Route path="/limit" element={<Limit />} />
            <Route path="/transaction" element={<Transaction />} />
            <Route path="/refer" element={<Refer />} />
            <Route path="/profile" element={<Settings />} />
            <Route path="/incomplete-order" element={<IncompleteOrders />} />
            {/* <Route path="/dispute" element={<Dispute />} /> */}
            <Route path="/dispute-details" element={<DisputeStatus />} />
            <Route path="/dispute-form" element={<DisputeForm />} />

            {/* <Route path="/wallet/transactions" element={<WalletTransaction />} /> */}
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Suspense>
    </div>
  );
};

export default App;
