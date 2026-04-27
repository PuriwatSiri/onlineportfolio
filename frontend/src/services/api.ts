const API_BASE_URL = 'https://onlineportfolio-4i6c.onrender.com/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const api = {
  async getTemplates() {
    const res = await fetch(`${API_BASE_URL}/admin/templates`, { headers: getAuthHeaders() });
    return res.json();
  },
  async getTemplateById(id: string) {
    const res = await fetch(`${API_BASE_URL}/admin/templates/${id}`, { headers: getAuthHeaders() });
    return res.json();
  },
  async createTemplate(data: any) {
    const res = await fetch(`${API_BASE_URL}/admin/templates`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async updateTemplate(id: string, data: any) {
    const res = await fetch(`${API_BASE_URL}/admin/templates/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async deleteTemplate(id: string) {
    await fetch(`${API_BASE_URL}/admin/templates/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  async getMyPortfolios() {
    const res = await fetch(`${API_BASE_URL}/portfolios/me`, { headers: getAuthHeaders() });
    return res.json();
  },
  async getPortfolioById(id: string) {
    const res = await fetch(`${API_BASE_URL}/portfolios/${id}`, { headers: getAuthHeaders() });
    return res.json();
  },
  async createPortfolio(data: any) {
    const res = await fetch(`${API_BASE_URL}/portfolios`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async updatePortfolio(id: string, data: any) {
    const res = await fetch(`${API_BASE_URL}/portfolios/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async deletePortfolio(id: string) {
    await fetch(`${API_BASE_URL}/portfolios/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  async getPackages() {
    const res = await fetch(`${API_BASE_URL}/admin/packages`, { headers: getAuthHeaders() });
    return res.json();
  },
  async createPackage(data: any) {
    const res = await fetch(`${API_BASE_URL}/admin/packages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async updatePackage(id: string, data: any) {
    const res = await fetch(`${API_BASE_URL}/admin/packages/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async deletePackage(id: string) {
    await fetch(`${API_BASE_URL}/admin/packages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  // Issues
  async reportIssue(data: any) {
    const res = await fetch(`${API_BASE_URL}/admin/issues`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async getMyIssues() {
    const res = await fetch(`${API_BASE_URL}/admin/issues/me`, { headers: getAuthHeaders() });
    return res.json();
  },
  async getIssues() {
    const res = await fetch(`${API_BASE_URL}/admin/issues`, { headers: getAuthHeaders() });
    return res.json();
  },
  async updateIssue(id: string, data: any) {
    const res = await fetch(`${API_BASE_URL}/admin/issues/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async createPayment(data: any) {
    const res = await fetch(`${API_BASE_URL}/admin/payments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async getPaymentById(id: string) {
    const res = await fetch(`${API_BASE_URL}/admin/payments/${id}`, { headers: getAuthHeaders() });
    return res.json();
  },
  async getMyPayments() {
    const res = await fetch(`${API_BASE_URL}/admin/payments/me`, { headers: getAuthHeaders() });
    return res.json();
  },
  async getPayments() {
    const res = await fetch(`${API_BASE_URL}/admin/payments`, { headers: getAuthHeaders() });
    return res.json();
  },
  async updatePaymentStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE_URL}/admin/payments/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return res.json();
  }
};