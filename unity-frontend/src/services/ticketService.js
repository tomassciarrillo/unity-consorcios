import api from './api';

export const ticketService = {
  createTicket: async (ticketData) => {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  },

  getTicketsByBuilding: async (buildingId) => {
    const response = await api.get(`/tickets/building/${buildingId}`);
    return response.data;
  },

  updateTicketStatus: async (ticketId, status) => {
    const response = await api.put(`/tickets/${ticketId}/status?status=${status}`);
    return response.data;
  }
};