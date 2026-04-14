import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

function ExpensePieChart({ data = [] }) {

  if (!data || data.length === 0) {
    return <p>No chart data available</p>;
  }

  return (
    <PieChart width={200} height={150}>

      <Pie
        data={data}
        dataKey="amount"
        nameKey="category"
        cx="50%"
        cy="50%"
        outerRadius={40}
        
      >

        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}

      </Pie>

      <Tooltip />
      <Legend />

    </PieChart>
  );
}

export default ExpensePieChart;