"use client";

import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardHeader,
  useTheme,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";

export default function HomePage() {
  const [input, setInput] = useState("");
  const [symbol, setSymbol] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [quoteData, setQuoteData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [recommendationData, setRecommendationData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newsLimit, setNewsLimit] = useState(3);
  const theme = useTheme();

  const fetchSymbol = async (companyName) => {
    try {
      const response = await fetch(
        `/api/stock/symbol?companyName=${companyName}`
      );
      const data = await response.json();
      if (response.ok) {
        return data.symbol;
      }
      throw new Error(data.error || "No symbol found");
    } catch (error) {
      console.error("Error fetching symbol:", error);
      setError("Failed to fetch stock symbol. Please try again.");
      return null;
    }
  };

  const handleSearch = async () => {
    setError(null);
    setLoading(true);

    try {
      const fetchedSymbol = await fetchSymbol(input);
      if (!fetchedSymbol) {
        throw new Error("Could not retrieve stock symbol");
      }

      setSymbol(fetchedSymbol);

      const profileResponse = await fetch(
        `/api/stock/profile?symbol=${fetchedSymbol}`
      );
      const quoteResponse = await fetch(
        `/api/stock/quote?symbol=${fetchedSymbol}`
      );
      const historyResponse = await fetch(
        `/api/stock/history?symbol=${fetchedSymbol}`
      );
      const newsResponse = await fetch(
        `/api/stock/news?symbol=${fetchedSymbol}`
      );
      const recommendationResponse = await fetch(
        `/api/stock/recommendation?symbol=${fetchedSymbol}`
      );

      if (
        !profileResponse.ok ||
        !quoteResponse.ok ||
        !historyResponse.ok ||
        !newsResponse.ok ||
        !recommendationResponse.ok
      ) {
        throw new Error("Network response was not ok");
      }

      const profileData = await profileResponse.json();
      const quoteData = await quoteResponse.json();
      const historyData = await historyResponse.json();
      const newsData = await newsResponse.json();
      const recommendationData = await recommendationResponse.json();

      if (
        profileData.error ||
        quoteData.error ||
        historyData.error ||
        newsData.error ||
        recommendationData.error
      ) {
        throw new Error(
          profileData.error ||
            quoteData.error ||
            historyData.error ||
            newsData.error ||
            recommendationData.error
        );
      }

      setProfileData(profileData);
      setQuoteData(quoteData);
      setHistoryData(historyData);
      setNewsData(newsData);
      setRecommendationData(recommendationData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMoreNews = () => {
    setNewsLimit((prevLimit) => prevLimit + 3);
  };

  const chartData = historyData
    ? {
        labels: historyData.data.map((item) => item.date),
        datasets: [
          {
            label: "Close Price",
            data: historyData.data.map((item) => item.close),
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.light,
            fill: false,
          },
        ],
      }
    : null;

  const chartOptions = {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "ll",
          displayFormats: {
            day: "MMM d",
          },
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price (USD)",
        },
        beginAtZero: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h2" sx={{ color: theme.palette.accent[50] }}>
          Stock Rating
        </Typography>
        <Typography variant="body1">
          Enter a company name or stock symbol to get financial information.
        </Typography>
      </Box>

      <Box display="flex" justifyContent="center" mb={4}>
        <TextField
          label="Enter Company Name or Stock Symbol"
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{
            marginRight: 2,
            "& .MuiInputBase-root": {
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            },
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.divider,
            },
            "& .MuiInputLabel-root": {
              color: theme.palette.text.primary,
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: theme.palette.text.primary,
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={loading}
          sx={{
            backgroundColor: theme.palette.accent[30],
            "&:hover": {
              backgroundColor: theme.palette.primary[30],
            },
          }}
        >
          Search
        </Button>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box display="flex" justifyContent="center" my={4}>
          <Typography color="error" gutterBottom>
            Error: {error}
          </Typography>
        </Box>
      )}

      {profileData && quoteData && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: theme.palette.accent[20] }}>
              <CardHeader title="Company Profile" />
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  <strong>Name:</strong> {profileData.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Industry:</strong> {profileData.finnhubIndustry}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Market Cap:</strong>{" "}
                  {profileData.marketCapitalization}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Exchange:</strong> {profileData.exchange}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: theme.palette.accent[20] }}>
              <CardHeader title="Stock Quote" />
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  <strong>Current Price:</strong> {quoteData.c}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Open:</strong> {quoteData.o}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>High:</strong> {quoteData.h}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Low:</strong> {quoteData.l}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Previous Close:</strong> {quoteData.pc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {historyData && (
            <Grid item xs={12}>
              <Card sx={{ backgroundColor: theme.palette.accent[20] }}>
                <CardHeader title="Stock Chart" />
                <CardContent>
                  <Box sx={{ height: "400px" }}>
                    <Line data={chartData} options={chartOptions} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {newsData && (
            <Grid item xs={12}>
              <Card sx={{ backgroundColor: theme.palette.accent[20] }}>
                <CardHeader title="Latest News" />
                <CardContent>
                  {newsData.slice(0, newsLimit).map((news, index) => (
                    <Box key={index} mb={2}>
                      <Typography variant="body1" gutterBottom>
                        <strong>{news.headline}</strong>
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {news.summary}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <a
                          href={news.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Read more
                        </a>
                      </Typography>
                    </Box>
                  ))}
                  {newsLimit < newsData.length && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleLoadMoreNews}
                      sx={{
                        mt: 2,
                        backgroundColor: theme.palette.accent[30],
                        "&:hover": {
                          backgroundColor: theme.palette.primary[30],
                        },
                      }}
                    >
                      More News
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}

          {recommendationData && (
            <Grid item xs={12}>
              <Card sx={{ backgroundColor: theme.palette.accent[20] }}>
                <CardHeader title="Analyst Recommendations" />
                <CardContent>
                  {recommendationData.slice(0, 3).map((rec, index) => (
                    <Typography variant="body1" gutterBottom key={index}>
                      <strong>Period:</strong> {rec.period} -{" "}
                      <strong>Strong Buy:</strong> {rec.strongBuy},{" "}
                      <strong>Buy:</strong> {rec.buy}, <strong>Hold:</strong>{" "}
                      {rec.hold}, <strong>Sell:</strong> {rec.sell},{" "}
                      <strong>Strong Sell:</strong> {rec.strongSell}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
}
