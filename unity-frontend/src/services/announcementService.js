import api from './api';

export const announcementService = {
  getAnnouncementsByBuilding: async (buildingId) => {
    const response = await api.get(`/announcements/building/${buildingId}`);
    return response.data;
  },

  createAnnouncement: async (announcementData) => {
    const response = await api.post('/announcements', announcementData);
    return response.data;
  }
};