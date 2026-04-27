import { useAppSelector, useAppDispatch } from "../hooks";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  fetchPaymentById,
  fetchMyPayments,
} from "@/store/slices/paymentsSlice";
import { getCurrentUser } from "@/store/slices/authSlice";

export default function PaymentReview() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const passed: any = (location.state as any)?.payment;

  const [localItem, setLocalItem] = useState<any>(passed || null);
  const storedItem = useAppSelector((s) =>
    s.payments.items.find((p) => p._id === localItem?._id),
  );

  const item = storedItem || localItem;

  useEffect(() => {
    if (!item && passed) setLocalItem(passed);
    if (!item) {
      dispatch(fetchMyPayments()).then((res: any) => {
        const arr = res.payload;
        if (arr && arr.length) {
          setLocalItem(arr[0]);
        }
      });
    }
  }, [item, passed, dispatch]);

  useEffect(() => {
    let interval: any;
    if (item && item._id && item.status === "pending") {
      interval = setInterval(async () => {
        try {
          const updated: any = await dispatch(
            fetchPaymentById(item._id),
          ).unwrap();
          if (updated.status !== item.status) {
            setLocalItem(updated);
            if (updated.status === "approved") {
              dispatch(getCurrentUser());
              alert(
                "Payment has been confirmed. Your package has been renewed.",
              );
            } else if (updated.status === "rejected") {
              alert("Payment rejected. Please contact the administrator.");
            }
          }
        } catch (err) {
          console.error("poll error", err);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [item, dispatch]);

  const renderMessage = () => {
    if (!item)
      return <div className="alert">No payment information available.</div>;
    const status = item.status;
    if (status === "pending") {
      return <div className="alert alert-info">Pending</div>;
    }
    if (status === "approved") {
      return <div className="alert alert-success">Approved</div>;
    }
    if (status === "rejected") {
      return <div className="alert alert-error">Rejected</div>;
    }
    return null;
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Payment Review</h1>
      {renderMessage()}
      {item && (
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">
              Status: <span className="badge">{item.status}</span>
            </h3>
            <p>Amount: {item.amount} Baht</p>
            {item.package_id && item.package_id.package_name && (
              <p>Package: {item.package_id.package_name}</p>
            )}
            <p>
              Submission Time:{" "}
              {new Date(item.created_at || item.createdAt).toLocaleString()}
            </p>
            <p>Transfer Time: {item.transfer_time || item.transferTime}</p>
            {item.payment_slip && (
              <p>
                Slip:{" "}
                <a
                  href={
                    item.payment_slip.startsWith("http")
                      ? item.payment_slip
                      : `https://onlineportfolio-4i6c.onrender.com/${item.payment_slip}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-blue-600"
                >
                  View Slip
                </a>
              </p>
            )}
            <p className="text-sm opacity-60">
              Status will update automatically upon admin approval.{" "}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
