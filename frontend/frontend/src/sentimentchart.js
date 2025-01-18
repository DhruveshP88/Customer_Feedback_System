import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { useNavigate } from "react-router-dom";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const SentimentChart = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUserRole = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const userResponse = await axios.get(
          "http://localhost:8000/api/user-detail/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (userResponse.data.role !== "admin") {
          navigate("/unauthorized");
          return;
        }
      } catch (err) {
        setError("Error fetching user data.");
        console.error("Error verifying user role:", err);
      }
    };
    verifyUserRole();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/sentiment-distribution/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = response.data;

        // Pie Chart Data
        const pieData = {
          labels: Object.keys(data),
          datasets: [
            {
              label: "Sentiment Distribution",
              data: Object.values(data),
              backgroundColor: ["#FFC107", "#4CAF50", "#F44336"],
              borderColor: ["#388E3C", "#FFA000", "#D32F2F"],
              borderWidth: 1,
            },
          ],
        };

        // Bar Chart Data
        const barData = {
          labels: ["Positive", "Neutral", "Negative"],
          datasets: [
            {
              label: "Feedback Count",
              data: Object.values(data),
              backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
              borderColor: ["#388E3C", "#FFA000", "#D32F2F"],
              borderWidth: 1,
            },
          ],
        };

        setChartData({ pieData, barData });
      } catch (error) {
        console.error("Error fetching sentiment data:", error);
        setError("Failed to load sentiment data. Please try again.");
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      sx={{
        p: 3,
        background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#1976d2",
          mb: 3,
        }}
      >
        Sentiment Analysis Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {chartData ? (
        <Grid container spacing={3}>
          {/* Pie Chart */}
          <Grid item xs={12} sm={6} md={5}>
            <Card
              sx={{
                boxShadow: 3,
                "&:hover": { boxShadow: 6 },
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ textAlign: "center", color: "#388E3C" }}
                >
                  Sentiment Distribution
                </Typography>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "300px",
                  }}
                >
                  <Pie data={chartData.pieData} />
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* Bar Chart */}
          <Grid item xs={12} sm={6} md={7}>
            <Card
              sx={{
                boxShadow: 3,
                "&:hover": { boxShadow: 6 },
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ textAlign: "center", color: "#D32F2F" }}
                >
                  Feedback Count by Sentiment
                </Typography>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "300px",
                  }}
                >
                  <Bar data={chartData.barData} />
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default SentimentChart;
