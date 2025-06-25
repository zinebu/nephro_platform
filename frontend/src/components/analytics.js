import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from "recharts";

export default function Analytics({ email }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/historique/analyse/${email}`)
      .then(res => res.json())
      .then(data => setData(data));
  }, [email]);

  if (!data) return <p>Chargement...</p>;

  const colors = ["#2BBBAD", "#00C49F", "#FFBB28", "#FF8042"];

  const pieData = Object.entries(data.diagnostics).map(([name, value]) => ({ name, value }));
  const recData = Object.entries(data.recommandations).map(([name, value]) => ({ name, value }));
  const tgfData = data.tgf_time;

  return (
    <div>
      <h2>Analyse des prédictions</h2>

      <h3>Répartition des diagnostics</h3>
      <PieChart width={400} height={300}>
        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
          {pieData.map((_, index) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      <h3>Répartition des recommandations</h3>
      <BarChart width={500} height={300} data={recData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>

      <h3>Évolution du TGF</h3>
      <LineChart width={600} height={300} data={tgfData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="tgf" stroke="#2BBBAD" />
      </LineChart>
    </div>
  );
}
