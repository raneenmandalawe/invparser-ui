/**
 * API utilities and fetch helpers
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export interface Invoice {
  id: string;
  vendor: string;
  date: string;
  total: number;
  status: string;
  amount?: number;
  file_url?: string;
  [key: string]: any;
}

/**
 * Upload an invoice file
 */
export const uploadInvoice = async (file: File): Promise<{ invoice_id: string; [key: string]: any }> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/extract`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload invoice');
  }

  const data = await response.json();
  return data;
};

/**
 * Get a specific invoice by ID
 */
export const getInvoice = async (invoiceId: string): Promise<Invoice> => {
  const response = await fetch(`${API_BASE_URL}/invoice/${invoiceId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch invoice');
  }

  return response.json();
};

/**
 * Get invoices by vendor name
 */
export const getInvoicesByVendor = async (vendorName: string): Promise<Invoice[]> => {
  const response = await fetch(`${API_BASE_URL}/invoices/vendor/${vendorName}`);

  if (!response.ok) {
    throw new Error('Failed to fetch invoices');
  }

  return response.json();
};

/**
 * Mock: Get all invoices
 * Note: API doesn't provide a "get all" endpoint, so we return mock data
 */
export const fetchInvoices = async (): Promise<Invoice[]> => {
  try {
    // Try to fetch from API if available
    const response = await fetch(`${API_BASE_URL}/invoices`);
    if (response.ok) {
      return response.json();
    }
  } catch {
    // API endpoint doesn't exist, use mock data
  }

  // Return mock data
  return [
    {
      id: '1',
      vendor: 'Acme Corp',
      date: '2024-01-15',
      total: 1500,
      status: 'Extracted',
      amount: 1500,
    },
    {
      id: '2',
      vendor: 'Tech Solutions',
      date: '2024-01-12',
      total: 2300,
      status: 'Pending Review',
      amount: 2300,
    },
    {
      id: '3',
      vendor: 'Global Services',
      date: '2024-01-10',
      total: 890,
      status: 'Extracted',
      amount: 890,
    },
  ];
};
