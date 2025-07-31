import React, { useState, useEffect } from "react";
import api, {
  getAllfruits,
  getAllBookings,
  getAllUsers,
  createfruit,
  updatefruit,
  deletefruit,
  updateBookingStatus,
  blockUser,
  unblockUser,
  getProfile,
  updateProfile,
} from "../../api/api";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const sections = [
  { key: "overview", label: "Dashboard Overview" },
  { key: "products", label: "Product Management" },
  { key: "orders", label: "Order Management" },
  { key: "users", label: "User Management" },
  { key: "contacts", label: "Contact/Inquiry Management" },
  { key: "activity", label: "Activity Logs" },
  { key: "profile", label: "Admin Profile & Settings" },
];

function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);
  if (error) {
    return (
      <div className="text-red-600 bg-red-50 border border-red-200 p-6 rounded mb-4">
        {error.toString()}
      </div>
    );
  }
  return React.cloneElement(children, { setError });
}

function DashboardOverview({ setError }) {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([getAllBookings(), getAllUsers(), getAllfruits()])
      .then(([orders, users, products]) => {
        setOrders(orders);
        setUsers(users);
        setProducts(products);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load dashboard data");
        setLoading(false);
      });
  }, [setError]);

  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const totalUsers = users.length;
  const totalProducts = products.length;
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const recentOrders = sortedOrders.slice(0, 5);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Orders" value={totalOrders} />
        <StatCard label="Total Sales (Rs)" value={totalSales} />
        <StatCard label="Total Users" value={totalUsers} />
        <StatCard label="Total Products" value={totalProducts} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-lg border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gradient-to-br from-blue-100 to-blue-50 text-left text-xs text-blue-800 font-semibold uppercase">
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Total Price</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-900">
              {recentOrders.map((o) => (
                <tr key={o._id} className="border-t hover:bg-gray-50">
                  <td className="px-5 py-3">{o._id.slice(-6)}</td>
                  <td className="px-5 py-3">{o.user?.name || "-"}</td>
                  <td className="px-5 py-3">{o.fruit?.name || "-"}</td>
                  <td className="px-5 py-3">Rs {o.totalPrice}</td>
                  <td className="px-5 py-3">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-blue-600 hover:bg-blue-700 text-white tracking-wide rounded-lg p-6 flex flex-col items-center shadow">
      <div className="text-2xl font-bold mb-2">{value}</div>
      <div className="text-sm uppercase tracking-wider text-gray-300">
        {label}
      </div>
    </div>
  );
}

function ProductManagement({ setError }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    description: "",
    pricePerGram: "",
    stock: "",
    image: "",
  });
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    getAllfruits()
      .then(setProducts)
      .catch((err) => setError(err.message || "Failed to load products"))
      .finally(() => setLoading(false));
  };
  useEffect(fetchProducts, [setError]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updatefruit(editing, form);
        toast.success("Product updated.");
      } else {
        await createfruit(form);
        toast.success("Product added.");
      }
      setForm({
        name: "",
        description: "",
        pricePerGram: "",
        stock: "",
        image: "",
      });
      setEditing(null);
      fetchProducts();
    } catch (err) {
      setError(err.message || "Failed to save product");
      toast.error(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditing(product._id);
    setForm({
      name: product.name,
      description: product.description,
      pricePerGram: product.pricePerGram,
      stock: product.stock,
      image: product.image,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setSaving(true);
    try {
      await deletefruit(id);
      fetchProducts();
      toast.success("Product deleted.");
    } catch (err) {
      setError(err.message || "Failed to delete product");
      toast.error(err.message || "Failed to delete product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Product Management</h2>
      <form
        onSubmit={handleSubmit}
        className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="border px-3 py-3 rounded"
          required
          disabled={saving}
        />
        <input
          name="pricePerGram"
          value={form.pricePerGram}
          onChange={handleChange}
          placeholder="Price (Rs)"
          type="number"
          className="border px-3 py-3 rounded"
          required
          disabled={saving}
        />
        <input
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          type="number"
          className="border px-3 py-3 rounded"
          required
          disabled={saving}
        />
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image filename (e.g. love.jpg)"
          className="border px-3 py-3 rounded"
          required
          disabled={saving}
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border px-3 py-3 rounded md:col-span-2"
          required
          disabled={saving}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white tracking-wide py-3 rounded hover:bg-blue-800 transition md:col-span-2"
          disabled={saving}
        >
          {editing ? "Update" : "Add"} Product
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm({
                name: "",
                description: "",
                pricePerGram: "",
                stock: "",
                image: "",
              });
            }}
            className="text-sm text-blue-600 underline md:col-span-2"
          >
            Cancel Edit
          </button>
        )}
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : products.length === 0 ? (
        <div>No products found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-lg border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gradient-to-br from-lime-100 to-green-50 text-left text-sm text-blue-800 font-semibold uppercase">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Image</th>
                <th className="px-5 py-3">Price/Gram</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-900">
              {products.map((p) => {
                const imgSrc = p.image
                  ? `http://localhost:5000/uploads/${p.image}`
                  : "http://localhost:5000/uploads/placeholder.jpg";
                return (
                  <tr key={p._id} className="border-t hover:bg-gray-50">
                    <td className="px-5 py-3 font-semibold">{p.name}</td>
                    <td className="px-5 py-3">
                      <img
                        src={imgSrc}
                        alt={p.name}
                        className="h-10 w-10 object-contain rounded"
                        onError={(e) => {
                          e.target.src =
                            "http://localhost:5000/uploads/placeholder.jpg";
                        }}
                      />
                    </td>
                    <td className="px-5 py-3">Rs {p.pricePerGram}</td>
                    <td className="px-5 py-3">{p.stock}</td>
                    <td className="px-5 py-3 space-x-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white tracking-wide px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="text-xs bg-red-600 text-white tracking-wide px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function OrderManagement({ setError }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    getAllBookings()
      .then(setOrders)
      .catch((err) => setError(err.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  };
  useEffect(fetchOrders, [setError]);

  const handleStatus = async (id, status) => {
    setSaving(true);
    try {
      await updateBookingStatus(id, status);
      fetchOrders();
      toast.success("Order status updated.");
    } catch (err) {
      setError(err.message || "Failed to update status");
      toast.error(err.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const statusOptions = ["pending", "shipped", "delivered", "cancelled"];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>
      {loading ? (
        <div>Loading...</div>
      ) : orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-lg border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gradient-to-br from-blue-100 to-blue-50 text-left text-xs text-blue-800 font-semibold uppercase">
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Weight (g)</th>
                <th className="px-5 py-3">Qty</th>
                <th className="px-5 py-3">Total Price</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-900">
              {orders.map((o) => (
                <tr key={o._id} className="border-t hover:bg-gray-50">
                  <td className="px-5 py-3">{o._id.slice(-6)}</td>
                  <td className="px-5 py-3">{o.user?.name || "-"}</td>
                  <td className="px-5 py-3">{o.fruit?.name || "-"}</td>
                  <td className="px-5 py-3">{o.weight}</td>
                  <td className="px-5 py-3">{o.quantity}</td>
                  <td className="px-5 py-3">Rs {o.totalPrice}</td>
                  <td className="px-5 py-3">
                    <span className="capitalize font-semibold">{o.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <select
                      className="border rounded px-2 py-1 text-xs"
                      value={o.status}
                      onChange={(e) => handleStatus(o._id, e.target.value)}
                      disabled={saving}
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function UserManagement({ setError }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    getAllUsers()
      .then(setUsers)
      .catch((err) => setError(err.message || "Failed to load users"))
      .finally(() => setLoading(false));
  };
  useEffect(fetchUsers, [setError]);

  const handleBlock = async (id, block) => {
    setSaving(true);
    try {
      if (block) {
        await blockUser(id);
        toast.success("User blocked.");
      } else {
        await unblockUser(id);
        toast.success("User unblocked.");
      }
      fetchUsers();
    } catch (err) {
      setError(err.message || "Failed to update user");
      toast.error(err.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      {loading ? (
        <div>Loading...</div>
      ) : users.length === 0 ? (
        <div>No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-lg border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gradient-to-br from-blue-100 to-blue-50 text-left text-xs text-blue-800 font-semibold uppercase">
                <th className="px-5 py-3">User ID</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-900">
              {users.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="px-5 py-3">{u._id.slice(-6)}</td>
                  <td className="px-5 py-3">{u.name}</td>
                  <td className="px-5 py-3">{u.email}</td>
                  <td className="px-5 py-3">
                    {u.isAdmin ? "Admin" : "Customer"}
                  </td>
                  <td className="px-5 py-3">
                    {u.blocked ? (
                      <span className="text-red-600 font-semibold">
                        Blocked
                      </span>
                    ) : (
                      <span className="text-blue-600 font-semibold">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {u.isAdmin ? (
                      <span className="text-xs text-gray-400">-</span>
                    ) : u.blocked ? (
                      <button
                        onClick={() => handleBlock(u._id, false)}
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white tracking-wide px-2 py-1 rounded"
                        disabled={saving}
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBlock(u._id, true)}
                        className="text-xs bg-red-600 text-white tracking-wide px-2 py-1 rounded"
                        disabled={saving}
                      >
                        Block
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ContactManagement({ setError }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchContacts = () => {
    setLoading(true);
    api
      .get("/contact")
      .then((res) => setContacts(res.data))
      .catch((err) =>
        setError(
          err.response?.data?.msg || err.message || "Failed to load messages"
        )
      )
      .finally(() => setLoading(false));
  };
  useEffect(fetchContacts, [setError]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    setSaving(true);
    try {
      await api.delete(`/contact/${id}`);
      fetchContacts();
      toast.success("Message deleted.");
    } catch (err) {
      setError(
        err.response?.data?.msg || err.message || "Failed to delete message"
      );
      toast.error(
        err.response?.data?.msg || err.message || "Failed to delete message"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Contact/Inquiry Management</h2>
      {loading ? (
        <div>Loading...</div>
      ) : contacts.length === 0 ? (
        <div>No messages found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-lg border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gradient-to-br from-blue-100 to-blue-50 text-left text-xs text-blue-800 font-semibold uppercase">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Message</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-900">
              {contacts.map((c) => (
                <tr key={c._id} className="border-t hover:bg-gray-50">
                  <td className="px-5 py-3">{c.name}</td>
                  <td className="px-5 py-3">{c.email}</td>
                  <td className="px-5 py-3 max-w-xs truncate">{c.message}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="text-xs bg-red-600 text-white tracking-wide px-2 py-1 rounded"
                      disabled={saving}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ActivityLogs({ setError }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userFilter, setUserFilter] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setLoading(true);
    const url = userFilter
      ? `/users/activity-logs?user=${userFilter}`
      : "/users/activity-logs";
    Promise.all([api.get(url), getAllUsers()])
      .then(([logRes, users]) => {
        setLogs(Array.isArray(logRes.data) ? logRes.data : []);
        setUsers(users);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load activity logs");
        setLoading(false);
      });
  }, [setError, userFilter]);

  if (!Array.isArray(logs))
    return <div>Error: Activity logs data is not an array.</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Activity Logs</h2>
      <div className="mb-4 flex gap-3 items-center">
        <label className="text-sm">Filter by user:</label>
        <select
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">All</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <div>Loading logs...</div>
      ) : logs.length === 0 ? (
        <div>No activity logs found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-lg border border-gray-200 rounded-lg shadow-sm text-xs">
            <thead>
              <tr className="bg-gradient-to-br from-blue-100 to-blue-50 text-left text-xs text-blue-800 font-semibold uppercase">
                <th className="px-2 py-3">Time</th>
                <th className="px-2 py-3">User</th>
                <th className="px-2 py-3">IP</th>
                <th className="px-2 py-3">Action</th>
                <th className="px-2 py-3">Method</th>
                <th className="px-2 py-3">URL</th>
                <th className="px-2 py-3">Info</th>
              </tr>
            </thead>
            <tbody className="text-gray-900">
              {logs.map((log) => (
                <tr key={log._id} className="border-t hover:bg-gray-50">
                  <td className="px-2 py-3 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-2 py-3">
                    {log.user && typeof log.user === "object" ? (
                      `${log.user.name || ""} (${
                        log.user.email || log.user._id || ""
                      })`
                    ) : log.user ? (
                      log.user
                    ) : (
                      <span className="text-gray-400">Visitor</span>
                    )}
                  </td>
                  <td className="px-2 py-3">{log.ip}</td>
                  <td className="px-2 py-3">{log.action}</td>
                  <td className="px-2 py-3">{log.method}</td>
                  <td className="px-2 py-3">{log.url}</td>
                  <td className="px-2 py-3">{log.info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminProfileSettings({ setError }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setLoading(true);
    getProfile()
      .then((data) => {
        setProfile(data);
        setForm({ email: data.email, password: "" });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load profile");
        setLoading(false);
      });
  }, [setError]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    try {
      await updateProfile(form);
      setSuccess("Profile updated successfully.");
      setForm((f) => ({ ...f, password: "" }));
      toast.success("Profile updated.");
    } catch (err) {
      setError(err.message || "Failed to update profile");
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Profile & Settings</h2>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            className="border px-3 py-3 rounded w-full"
            required
            disabled={saving}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">New Password</label>
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            className="border px-3 py-3 rounded w-full"
            placeholder="Leave blank to keep current password"
            disabled={saving}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white tracking-wide py-3 rounded hover:bg-blue-800 transition w-full"
          disabled={saving}
        >
          Update Profile
        </button>
        {success && <div className="text-blue-600 text-sm mt-2">{success}</div>}
      </form>
      <div className="mt-8">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white tracking-wide py-3 px-6 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [section, setSection] = useState("overview");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-white rounded-xl shadow-lg text-blue-900 font-bold">
      <Toaster position="top-right" />
      {/* Sidebar */}
      <aside className="w-72 bg-blue-50 shadow-xl border-r border-blue-200 transition-all duration-500 ease-in-out bg-white rounded-xl shadow-lg border-r border-gray-200 min-h-screen px-6 py-8 shadow-2xl transition-all duration-300 ease-in-out">
        <div className="text-3xl font-bold mb-10">Admin Panel</div>
        <nav className="space-y-3">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              className={`w-full text-left px-5 py-3 rounded-lg font-medium border transition duration-150 ${
                section === s.key
                  ? "bg-blue-600 hover:bg-blue-700 text-white tracking-wide border-black"
                  : "border-blue-300 hover:bg-gradient-to-br from-blue-100 to-blue-50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>
      
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 bg-white rounded-xl shadow-lg min-h-screen">
        {section === "overview" && (
          <ErrorBoundary>
            <DashboardOverview />
          </ErrorBoundary>
        )}
        {section === "products" && (
          <ErrorBoundary>
            <ProductManagement />
          </ErrorBoundary>
        )}
        {section === "orders" && (
          <ErrorBoundary>
            <OrderManagement />
          </ErrorBoundary>
        )}
        {section === "users" && (
          <ErrorBoundary>
            <UserManagement />
          </ErrorBoundary>
        )}
        {section === "contacts" && (
          <ErrorBoundary>
            <ContactManagement />
          </ErrorBoundary>
        )}
        {section === "activity" && (
          <ErrorBoundary>
            <ActivityLogs />
          </ErrorBoundary>
        )}
        {section === "profile" && (
          <ErrorBoundary>
            <AdminProfileSettings />
          </ErrorBoundary>
        )}
      </main>
    </div>
  );
}
