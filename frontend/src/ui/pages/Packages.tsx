import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../hooks'
import { fetchPackages } from '@/store/slices/packagesSlice'
import { fetchMyPayments } from '@/store/slices/paymentsSlice'

const formatExpiryDate = (dateString: string | undefined | null): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { 
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

const planStyles: { [key: string]: string } = {
  'Free': 'bg-gray-200 text-gray-800',
  'Starter': 'bg-green-100 text-green-900',
  'Pro': 'bg-yellow-100 text-yellow-900',
};

export default function PackagesPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector(s => s.packages.items)
  const user = useAppSelector(s => s.auth.currentUser)
  const payments = useAppSelector(s => s.payments.items)

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(fetchPackages());
    // load any existing payments by this user
    dispatch(fetchMyPayments());
  }, [dispatch, user, navigate]);

  const pendingPayment = payments && Array.isArray(payments) ? payments.find(p => p.status === 'pending') : null;

  const handleSelectPackage = (pkgId: string) => {
    if (!user) {
      alert('Please log in before selecting a package');
      navigate('/login');
      return;
    }
    if (pendingPayment) {
      alert('You have a pending payment already. Please wait for confirmation.');
      navigate('/payment-review');
      return;
    }
    navigate('/checkout', { state: { packageId: pkgId } });
  };

  // determine current plan (treat free package as default when user has none)
  const currentPlan = items.find(p => (p.id || p._id) === user?.packageId) 
    || ((!user?.packageId) && items.find(p => p.price === 0));
  const expiryDate = formatExpiryDate(user?.packageExpire);

 return (
    <div className="p-8 bg-white min-h-screen">
      <div className="flex justify-between items-start mb-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Packages</h2>
          <button 
            className="btn btn-outline btn-info btn-sm bg-white" 
            onClick={() => (document.getElementById('payment_status_modal') as HTMLDialogElement)?.showModal()}
          >
          View Payment Status
          </button>
        </div>
        
        {currentPlan && (
          <div className="text-right">
            <p className="text-lg text-gray-700 font-medium">Current Plan : {currentPlan.package_name}</p>
            {expiryDate && <p className="text-sm text-gray-500">Expired on : {expiryDate}</p>}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {items.map(p => {
          const isCurrentPlan = user?.packageId
            ? ((p.id || p._id) === user.packageId)
            : p.price === 0;
          const pkgId = p.id || p._id; 
          
          if (!pkgId) return null;

          const subtitle = p.price === 0 
            ? `${p.duration} Days` 
            : `${p.price} THB / ${p.duration} Days`;

          const style = planStyles[p.package_name] || 'bg-gray-50 border border-gray-200';
          const border = isCurrentPlan ? 'ring-2 ring-offset-2 ring-black' : '';

          return (
            <div 
              key={pkgId} 
              className={`rounded-2xl p-6 flex flex-col transition-transform hover:-translate-y-1 shadow-sm ${style} ${border}`}
              style={{ minHeight: '350px' }} 
            >
              <h2 className="text-3xl font-bold mb-2">{p.package_name}</h2>
              <p className="text-lg mb-6 opacity-80 font-medium">{subtitle}</p>
              
              <div className="flex-1">
                <p className="font-semibold mb-2">Features:</p>
                <ul className="list-disc list-inside space-y-2 text-sm opacity-90">
                    <li>{p.package_detail}</li>
                </ul>
              </div>
              
              <div className="mt-6 pt-6 border-t border-black/10"> 
                {isCurrentPlan ? (
                  <button 
                    className="btn w-full bg-gray-800 text-white hover:bg-black normal-case cursor-default"
                    disabled
                  >
                    Your current plan
                  </button>
                ) : (
                  <button 
                    onClick={() => handleSelectPackage(pkgId)}
                    className="btn bg-black text-white hover:bg-gray-800 w-full normal-case shadow-md border-none"
                  >
                    Choose {p.package_name}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <dialog id="payment_status_modal" className="modal">
        <div className="modal-box w-11/12 max-w-4xl bg-white">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-xl mb-6">Payment History & Status</h3>
          
          <div className="overflow-x-auto">
            <table className="table w-full border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 font-bold text-gray-700">Payment ID</th>
                  <th className="py-3 px-4 font-bold text-gray-700">Submission Date</th>
                  <th className="py-3 px-4 font-bold text-gray-700">Package</th>
                  <th className="py-3 px-4 font-bold text-gray-700">Paide Amount (Baht)</th>
                  <th className="py-3 px-4 font-bold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments && payments.length > 0 ? (
                  payments.map((p: any, index: number) => {
                    const dateToFormat = p.createdAt || p.created_at || new Date().toISOString();
                    return (
                      <tr key={index} className="hover:bg-gray-50">

                        <td className="font-mono text-xs font-semibold text-gray-600">
                          {p.paymentId || p._id}
                        </td>

                        <td>
                          {new Date(dateToFormat).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>

                        <td className="font-medium">{p.package_id?.package_name || '-'}</td>
                        <td className="font-bold text-green-600">฿{p.amount}</td>
                        <td>
                          <span className={`badge ${
                            p.status === 'approved' ? 'badge-success text-white' : 
                            p.status === 'rejected' ? 'badge-error text-white' : 
                            'badge-warning'
                          }`}>
                            {p.status === 'pending' ? 'Pending' : 
                             p.status === 'approved' ? 'Approved' : 'Rejected'}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">You have no payment history.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

    </div>
  )
}