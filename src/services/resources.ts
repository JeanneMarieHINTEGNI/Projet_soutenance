import axios from 'axios';

interface NewsletterSubscription {
  email: string;
  frequency: {
    monthly: boolean;
    alerts: boolean;
  };
}

interface DownloadResponse {
  url: string;
  filename: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const resourcesService = {
  // Newsletter subscription
  async subscribeToNewsletter(data: NewsletterSubscription): Promise<void> {
    try {
      await axios.post(`${API_URL}/newsletter/subscribe`, data);
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      throw new Error('Erreur lors de l\'inscription à la newsletter');
    }
  },

  // Resource download
  async downloadResource(resourceId: string): Promise<DownloadResponse> {
    try {
      const response = await axios.get(`${API_URL}/resources/${resourceId}/download`, {
        responseType: 'blob'
      });
      
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `resource-${resourceId}.pdf`;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      return { url, filename };
    } catch (error) {
      console.error('Resource download error:', error);
      throw new Error('Erreur lors du téléchargement de la ressource');
    }
  },

  // Share resource
  async shareResource(resourceId: string): Promise<{ url: string }> {
    try {
      const response = await axios.post(`${API_URL}/resources/${resourceId}/share`);
      return response.data;
    } catch (error) {
      console.error('Resource sharing error:', error);
      throw new Error('Erreur lors du partage de la ressource');
    }
  },

  // Save resource to favorites
  async saveToFavorites(resourceId: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/resources/${resourceId}/favorite`);
    } catch (error) {
      console.error('Save to favorites error:', error);
      throw new Error('Erreur lors de l\'ajout aux favoris');
    }
  }
}; 