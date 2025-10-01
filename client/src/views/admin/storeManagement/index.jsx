import { useEffect, useMemo, useState } from "react";
// import api from "../api"; // axios instance with baseURL -> /api
import { FiSearch, FiPlus, FiUpload, FiTrash2 } from "react-icons/fi";
import { format, differenceInDays } from "date-fns";
import PrimaryActionButton from "../../../components/UI/PrimaryActionButton";

/**
 * StoreManagementPage
 * - Receive items to store
 * - Show store stock list with filters + search
 * - Transfer a batch to Inventory (TransferModal)
 *
 * UX decisions:
 * - Table is compact on desktop, card view on small screens
 * - Expiry/Low-stock badges are prominent
 * - Transfer uses optimistic UI; errors rollback and show message
 * - Bulk import modal placeholder provided
 */

// * ---------- Demo data fallback (used when `api` is not available) ---------- */
const demoProducts = [
  {
    _id: "p1",
    itemName: "Tomato Ketchup 500g",
    barCode: "KCHP500",
    lowStockQuantity: 5,
  },
  {
    _id: "p2",
    itemName: "Olive Oil 1L",
    barCode: "OIL1L",
    lowStockQuantity: 2,
  },
  {
    _id: "p3",
    itemName: "All-purpose Flour 2kg",
    barCode: "FLR2K",
    lowStockQuantity: 4,
  },
];

const demoRows = [
  {
    _id: "r1",
    product: demoProducts[0],
    quantity: 12,
    batchNo: "B20250701",
    location: "Main Store",
    expiryDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      return d.toISOString().slice(0, 10);
    })(),
  },
  {
    _id: "r2",
    product: demoProducts[1],
    quantity: 1,
    batchNo: "B20250515",
    location: "Cold Storage",
    expiryDate: null,
  },
  {
    _id: "r3",
    product: demoProducts[2],
    quantity: 3,
    batchNo: "B20250610",
    location: "Main Store",
    expiryDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 5);
      return d.toISOString().slice(0, 10);
    })(),
  },
];

function Badge({ children, color = "bg-gray-200", className = "" }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${color} ${className}`}
    >
      {children}
    </span>
  );
}

/* ---------- ReceiveForm (left/top) ---------- */
function ReceiveForm({ onReceived, products }) {
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState("");
  const [batchNo, setBatchNo] = useState("");
  const [location, setLocation] = useState("Main Store");
  const [expiry, setExpiry] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!productId || !qty || Number(qty) <= 0)
      return alert("Select product and positive qty");
    setLoading(true);
    try {
      const payload = {
        productId,
        qty: Number(qty),
        batchNo: batchNo || undefined,
        location,
        expiryDate: expiry || undefined,
      };
      const res = await api.post("/stock/store/receive", payload);
      onReceived && onReceived(res.data.store);
      // clear form
      setProductId("");
      setQty("");
      setBatchNo("");
      setExpiry("");
      alert("Received to store");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Receive failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow space-y-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg! !font-semibold">Receive to Store</h3>
        <div className="text-sm text-gray-500">
          Quick add supplier deliveries
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <select
          className="!border !p-2 !rounded"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
        >
          <option value="">Select product (by name or barcode)</option>
          {products?.map((p) => (
            <option key={p._id} value={p._id}>
              {p.itemName} — {p.barCode}
            </option>
          ))}
        </select>

        <input
          placeholder="Quantity (e.g., 10)"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="!border !p-2 !rounded"
          type="number"
          min="0"
          step="any"
          required
        />
        <input
          placeholder="Batch No (optional)"
          value={batchNo}
          onChange={(e) => setBatchNo(e.target.value)}
          className="!border !p-2 !rounded"
        />
        <input
          placeholder="Expiry (YYYY-MM-DD)"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          className="!border !p-2 !rounded"
          type="date"
        />
        <input
          placeholder="Location e.g. Main Store"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="!border !p-2 !rounded col-span-1 sm:col-span-2"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={() => {
            setProductId("");
            setQty("");
            setBatchNo("");
            setExpiry("");
          }}
          className="!px-3 !py-1 !rounded !border"
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={loading}
          className="!px-4 !py-2 !rounded !bg-yellow-400 hover:!bg-yellow-500 text-black font-medium inline-flex items-center gap-2"
        >
          <FiPlus /> Receive
        </button>
      </div>
    </form>
  );
}

/* ---------- FiltersBar ---------- */
function FiltersBar({
  query,
  setQuery,
  onlyExpiringSoon,
  setOnlyExpiringSoon,
  onlyLowStock,
  setOnlyLowStock,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
      <div className="flex items-center gap-2 w-full md:w-1/2">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            className="!pl-10 !pr-3 !py-2 w-full !border !rounded"
            placeholder="Search by item name, barcode or batch"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2 items-center ml-auto">
        <label className="text-sm inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlyExpiringSoon}
            onChange={(e) => setOnlyExpiringSoon(e.target.checked)}
          />
          <span className="text-xs">Expiring &lt; 7 days</span>
        </label>
        <label className="text-sm inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlyLowStock}
            onChange={(e) => setOnlyLowStock(e.target.checked)}
          />
          <span className="text-xs">Low stock</span>
        </label>
      </div>
    </div>
  );
}

/* ---------- StoreStockRow (desktop) ---------- */
function StoreStockRow({ row, onTransfer, onDelete }) {
  const daysToExpiry = row.expiryDate
    ? differenceInDays(new Date(row.expiryDate), new Date())
    : null;
  const expiring =
    daysToExpiry !== null && daysToExpiry <= 7 && daysToExpiry >= 0;
  const expired = daysToExpiry !== null && daysToExpiry < 0;
  const lowStock =
    typeof row.quantity === "number" &&
    row.quantity <= (row.product?.lowStockQuantity || 0);

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-2">
        <div className="font-medium">{row.product?.itemName}</div>
        <div className="text-xs text-gray-500">SKU: {row.product?.barCode}</div>
      </td>
      <td className="p-2 text-center">
        <div className="text-lg font-semibold">{row.quantity}</div>
        {lowStock && <Badge color="bg-red-100 text-red-700 mt-1">Low</Badge>}
      </td>
      <td className="p-2 text-center">{row.batchNo || "-"}</td>
      <td className="p-2 text-center">{row.location || "-"}</td>
      <td className="p-2 text-center">
        {row.expiryDate ? (
          <div>
            <div>{format(new Date(row.expiryDate), "yyyy-MM-dd")}</div>
            {expired ? (
              <Badge color="bg-gray-200 text-gray-700 mt-1">Expired</Badge>
            ) : expiring ? (
              <Badge color="bg-yellow-100 text-yellow-800 mt-1">
                Expiring in {daysToExpiry}d
              </Badge>
            ) : null}
          </div>
        ) : (
          <div className="text-sm text-gray-500">—</div>
        )}
      </td>
      <td className="p-2 text-right">
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => onTransfer(row)}
            className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
          >
            Transfer
          </button>
          <button
            onClick={() => onDelete(row)}
            className="px-3 py-1 rounded border text-sm text-red-600 inline-flex items-center gap-1"
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ---------- StoreStockCard (mobile) ---------- */
function StoreStockCard({ row, onTransfer, onDelete }) {
  const daysToExpiry = row.expiryDate
    ? differenceInDays(new Date(row.expiryDate), new Date())
    : null;
  const expiring =
    daysToExpiry !== null && daysToExpiry <= 7 && daysToExpiry >= 0;
  const expired = daysToExpiry !== null && daysToExpiry < 0;
  const lowStock =
    typeof row.quantity === "number" &&
    row.quantity <= (row.product?.lowStockQuantity || 0);

  return (
    <div className="bg-white p-3 rounded shadow-sm mb-3">
      <div className="flex justify-between">
        <div>
          <div className="font-medium">{row.product?.itemName}</div>
          <div className="text-xs text-gray-500">
            {row.product?.barCode} • Batch: {row.batchNo || "-"}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold">{row.quantity}</div>
          {lowStock && <Badge color="bg-red-100 text-red-700 mt-1">Low</Badge>}
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onTransfer(row)}
          className="flex-1 px-3 py-2 rounded bg-blue-600 text-white text-sm"
        >
          Transfer
        </button>
        <button
          onClick={() => onDelete(row)}
          className="px-3 py-2 rounded border text-sm text-red-600"
        >
          Delete
        </button>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        {row.expiryDate
          ? expired
            ? "Expired"
            : expiring
            ? `Expiring in ${daysToExpiry}d`
            : `Expiry: ${format(new Date(row.expiryDate), "yyyy-MM-dd")}`
          : "No expiry"}
      </div>
    </div>
  );
}

/* ---------- TransferModal ---------- */
function TransferModal({ isOpen, onClose, row, onTransferred }) {
  const [qty, setQty] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQty("");
      setLoading(false);
    } else {
      setQty(row?.quantity || "");
    }
  }, [isOpen, row]);

  if (!isOpen || !row) return null;

  const maxQty = row.quantity || 0;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!qty || Number(qty) <= 0) return alert("Enter positive quantity");
    if (Number(qty) > maxQty) return alert("Quantity exceeds batch quantity");
    setLoading(true);

    try {
      // optimistic result: update UI after response
      const res = await api.post("/stock/store/transfer", {
        storeStockId: row._id,
        qty: Number(qty),
      });
      onTransferred && onTransferred(res.data);
      alert("Transferred to inventory");
      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded shadow p-5"
      >
        <h3 className="text-lg font-semibold">Transfer to Inventory</h3>
        <div className="mt-3 text-sm text-gray-600">
          Product: <span className="font-medium">{row.product?.itemName}</span>
        </div>
        <div className="mt-1 text-sm text-gray-600">
          Batch: <span className="font-medium">{row.batchNo || "-"}</span>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium">
            Quantity to transfer
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          />
          <div className="text-xs text-gray-500 mt-1">
            Available in batch: {maxQty}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded border"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            {loading ? "Sending..." : "Transfer"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------- BulkImportModal (placeholder) ---------- */
function BulkImportModal({ isOpen, onClose, onImported }) {
  const [file, setFile] = useState(null);
  if (!isOpen) return null;
  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return alert("Select CSV file");
    // implement file upload endpoint on backend to parse CSV and create store stocks
    alert(
      "This demo modal is a placeholder. Implement backend CSV import endpoint."
    );
    onImported && onImported();
    onClose();
  }
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4">
      <form
        onSubmit={handleUpload}
        className="bg-white p-4 rounded shadow w-full max-w-lg"
      >
        <h3 className="!text-lg !font-semibold">Bulk Import (CSV)</h3>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0])}
          className="mt-3"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="!px-3 !py-1 !rounded !border"
          >
            Cancel
          </button>
          <button className="!px-4 !py-2 !rounded !bg-yellow-400">
            Upload
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------- Main Page ---------- */
export default function StoreManagementPage() {
  const [rows, setRows] = useState(demoRows || []);
  const [products, setProducts] = useState([]); // item master to select in receive form
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [onlyExpiringSoon, setOnlyExpiringSoon] = useState(false);
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [transferOpen, setTransferOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const [storeRes, itemRes] = await Promise.all([
        api.get("/stock/store"),
        api.get("/items"), // your item master endpoint
      ]);
      setRows(storeRes.data || demor);
      setProducts(itemRes.data || []);
    } catch (err) {
      console.error(err);
      // alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Filtering and search
  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (query) {
        const q = query.toLowerCase();
        const matchName = r.product?.itemName?.toLowerCase().includes(q);
        const matchCode = r.product?.barCode?.toLowerCase().includes(q);
        const matchBatch = (r.batchNo || "").toLowerCase().includes(q);
        if (!(matchName || matchCode || matchBatch)) return false;
      }
      if (onlyExpiringSoon) {
        if (!r.expiryDate) return false;
        const days = differenceInDays(new Date(r.expiryDate), new Date());
        if (days > 7) return false;
      }
      if (onlyLowStock) {
        const low = r.product?.lowStockQuantity ?? 0;
        if (r.quantity > low) return false;
      }
      return true;
    });
  }, [rows, query, onlyExpiringSoon, onlyLowStock]);

  function openTransfer(row) {
    setSelectedRow(row);
    setTransferOpen(true);
  }

  async function onTransferred(resData) {
    // After successful transfer, refresh the lists or apply small local update
    await loadData();
  }

  async function onReceived(storeRow) {
    // refresh
    await loadData();
  }

  async function handleDelete(row) {
    if (!confirm("Delete this store batch? This cannot be undone.")) return;
    try {
      await api.delete(`/stock/store/${row._id}`); // implement delete backend if desired
      setRows((prev) => prev.filter((x) => x._id !== row._1d));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="">
        <div className="!border rounded-lg p-2">
          <ReceiveForm onReceived={onReceived} products={products} />
          <div className="mt-4 flex gap-2">
            <PrimaryActionButton
              onClick={() => setBulkOpen(true)}
              className="flex-1 !px-3 !py-2 !rounded !border inline-flex items-center justify-center gap-2"
            >
              <FiUpload /> Bulk Import
            </PrimaryActionButton>
            <button onClick={loadData} className="!px-3 !py-2 !rounded !border">
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-8 !border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="!text-xl !font-bold">Store Stock</h2>
            <div className="text-sm text-gray-500">
              Total batches: {rows.length}
            </div>
          </div>

          <div className="mb-3">
            <FiltersBar
              query={query}
              setQuery={setQuery}
              onlyExpiringSoon={onlyExpiringSoon}
              setOnlyExpiringSoon={setOnlyExpiringSoon}
              onlyLowStock={onlyLowStock}
              setOnlyLowStock={setOnlyLowStock}
            />
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block bg-white rounded shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-center">Batch</th>
                  <th className="p-3 text-center">Location</th>
                  <th className="p-3 text-center">Expiry</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <StoreStockRow
                    key={row._id}
                    row={row}
                    onTransfer={openTransfer}
                    onDelete={handleDelete}
                  />
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-gray-500">
                      No store batches found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden">
            {filtered.map((row) => (
              <StoreStockCard
                key={row._id}
                row={row}
                onTransfer={openTransfer}
                onDelete={handleDelete}
              />
            ))}
            {filtered.length === 0 && (
              <div className="text-center text-gray-500 p-4">
                No store batches found
              </div>
            )}
          </div>
        </div>
      </div>

      <TransferModal
        isOpen={transferOpen}
        onClose={() => setTransferOpen(false)}
        row={selectedRow}
        onTransferred={onTransferred}
      />
      <BulkImportModal
        isOpen={bulkOpen}
        onClose={() => setBulkOpen(false)}
        onImported={() => loadData()}
      />
    </div>
  );
}
