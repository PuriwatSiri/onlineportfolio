import { useAppSelector, useAppDispatch } from '../hooks'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchPaymentById, fetchMyPayments } from '@/store/slices/paymentsSlice'
import { getCurrentUser } from '@/store/slices/authSlice'

export default function PaymentReview() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  // if navigation passed payment object
  const passed: any = (location.state as any)?.payment;

  const [localItem, setLocalItem] = useState<any>(passed || null);
  const storedItem = useAppSelector(s => s.payments.items.find(p => p._id === localItem?._id));

  const item = storedItem || localItem;

  // refresh if item changed or passed
  useEffect(() => {
    if (!item && passed) setLocalItem(passed);
    // if we still don't have an item, fetch user's payments and pick the latest
    if (!item) {
      dispatch(fetchMyPayments()).then((res: any) => {
        const arr = res.payload;
        if (arr && arr.length) {
          setLocalItem(arr[0]);
        }
      });
    }
  }, [item, passed, dispatch]);

  // polling every 5 seconds while status pending
  useEffect(() => {
    let interval: any;
    if (item && item._id && item.status === 'pending') {
      interval = setInterval(async () => {
        try {
          const updated: any = await dispatch(fetchPaymentById(item._id)).unwrap();
          if (updated.status !== item.status) {
            setLocalItem(updated);
            // when approved or rejected, reload user profile to update expiration
            if (updated.status === 'approved') {
              dispatch(getCurrentUser());
              alert('ชำระเงินได้รับการยืนยันแล้ว แพ็กเกจของคุณถูกต่ออายุ');
            } else if (updated.status === 'rejected') {
              alert('ชำระเงินถูกปฏิเสธ กรุณาติดต่อผู้ดูแล');
            }
          }
        } catch (err) {
          console.error('poll error', err);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [item, dispatch]);

  const renderMessage = () => {
    if (!item) return <div className="alert">No payment information available.</div>;
    const status = item.status;
    if (status === 'pending') {
      return <div className="alert alert-info">รอการยืนยันจากผู้ดูแล...</div>;
    }
    if (status === 'approved') {
      return <div className="alert alert-success">ชำระเงินได้รับการยืนยันแล้ว! 🎉</div>;
    }
    if (status === 'rejected') {
      return <div className="alert alert-error">ชำระเงินถูกปฏิเสธ กรุณาติดต่อผู้ดูแล</div>;
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
            {item.package_id && (item.package_id.package_name) && (
              <p>Package: {item.package_id.package_name}</p>
            )}
            <p>Submission Time: {new Date(item.created_at || item.createdAt).toLocaleString()}</p>
            <p>Transfer Time: {item.transfer_time || item.transferTime}</p>
            {item.payment_slip && (
              <p>
                Slip: <a href={item.payment_slip.startsWith('http') ? item.payment_slip : `http://localhost:5000/${item.payment_slip}`} target="_blank" rel="noreferrer" className="underline text-blue-600">ดูสลิป</a>
              </p>
            )}
            <p className="text-sm opacity-60">** ระบบจะอัปเดตสถานะโดยอัตโนมัติเมื่อผู้ดูแลยืนยัน **</p>
          </div>
        </div>
      )}
    </div>
  )
}
