import apiClient from './axios';

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactApi = {
  send: async (payload: ContactFormPayload): Promise<void> => {
    await apiClient.post('/contact/send', payload);
  },
};
