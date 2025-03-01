import axios from 'axios';

const API_URL = 'https://vehicle-rental-server.onrender.com/api';

export const getVehicles = async () => {
  const response = await axios.get(`${API_URL}/vehicles`);
  return response.data;
};

export const getVehicleById = async (id) => {
  const response = await axios.get(`${API_URL}/vehicles/${id}`);
  return response.data;
};
