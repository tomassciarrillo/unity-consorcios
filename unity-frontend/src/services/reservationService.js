import api from './api';

export const reservationService = {
  getCommonAreasByBuilding: async (buildingId) => {
    const response = await api.get(`/common-areas/building/${buildingId}`);
    return response.data;
  },
  createReservation: async (reservationData) => {
    return await api.post('/reservations', reservationData);
  },
  getReservationsByBuilding: async (buildingId) => {
    const response = await api.get(`/reservations/building/${buildingId}`);
    return response.data;
  }
};