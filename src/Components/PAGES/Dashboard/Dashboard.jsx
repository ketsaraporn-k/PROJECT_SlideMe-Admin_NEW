import { useEffect, useState } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/dashboard");
        const data = await res.json();
        console.log("Fetched data:", data);

        if (data.error) {
          throw new Error(data.error);
        }

        setSummary(data.summary);
        setProducts(data.products);
        setRevenue(data.revenue);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("ไม่สามารถดึงข้อมูลแดชบอร์ดได้: " + error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading dashboard data...</p>;
  if (error) return <p style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>{error}</p>;

  return (
    <div className="dashboard">
      <h1>Todays Sales</h1>
      <div className="card-container">
        <div className="card red">
          <p>${summary.total_sales}k</p>
          <span>Total Sales</span>
        </div>
        <div className="card orange">
          <p>{summary.total_order}</p>
          <span>Total Order</span>
        </div>
        <div className="card green">
          <p>{summary.sold}</p>
          <span>Sold</span>
        </div>
        <div className="card purple">
          <p>{summary.customers}</p>
          <span>Customers</span>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-box">
          <h3>Total Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="online" fill="#8884d8" name="Online Sales" />
              <Bar dataKey="offline" fill="#82ca9d" name="Offline Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Customer Satisfaction</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenue}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="satisfactionLastMonth" stroke="#8884d8" name="Last Month" />
              <Line type="monotone" dataKey="satisfactionThisMonth" stroke="#82ca9d" name="This Month" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-box">
          <h3>Target vs Reality</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenue}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="target" fill="#ffd54f" name="Target Sales" />
              <Bar dataKey="reality" fill="#4caf50" name="Reality Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Volume vs Service</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenue}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="volume" fill="#42a5f5" name="Volume" />
              <Bar dataKey="services" fill="#81c784" name="Services" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="product-list">
        <h2>Top Products</h2>
        <table className="product-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Popularity</th>
              <th>Sales</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.id}>
                <td>{i + 1}</td>
                <td>{p.name}</td>
                <td>
                  <div className="bar" style={{ width: `${p.popularity}%` }} />
                </td>
                <td>{p.sales_percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;