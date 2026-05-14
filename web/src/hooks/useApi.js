import { useState, useEffect } from 'react';
import { API_URL } from '@/constants/config';

export const useApi = () => {
  const [master, setMaster] = useState({ groups: [], shifts: [], lines: [] });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMaster = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/master`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setMaster(data);
    } catch (err) {
      setError(err);
      console.error("Error fetching master data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/data`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setChartData(data);
    } catch (err) {
      setError(err);
      console.error("Error fetching chart data:", err);
    } finally {
      setLoading(false);
    }
  };

  const postData = async (formData) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      fetchData(); // Refresh data after successful post
      return { success: true };
    } catch (err) {
      setError(err);
      console.error("Error posting data:", err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaster();
    fetchData();
    const intervalId = setInterval(() => fetchData(), 3000);
    return () => clearInterval(intervalId);
  }, []);

  return { master, chartData, loading, error, fetchData, postData };
};