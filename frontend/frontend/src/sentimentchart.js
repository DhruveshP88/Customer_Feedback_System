import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const SentimentChart = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/sentiment-distribution/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include JWT token
            },
          }
        );

        const data = response.data;

        setChartData({
          labels: Object.keys(data),
          datasets: [
            {
              label: "Sentiment Distribution",
              data: Object.values(data),
              backgroundColor: ["#4CAF50", "#FFC107", "#F44336"], // Colors for Positive, Neutral, Negative
              borderColor: ["#388E3C", "#FFA000", "#D32F2F"], // Optional border colors
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching sentiment data:", error);
        setError("Failed to load sentiment data. Please try again.");
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h3>Sentiment Distribution</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {chartData ? <Pie data={chartData} /> : <p>Loading chart...</p>}
    </div>
  );
};

export default SentimentChart;
