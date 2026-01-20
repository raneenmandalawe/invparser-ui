/**
 * TypeScript types for Invoice Parser
 */

export interface Invoice {
  id: string;
  vendor: string;
  date: string;
  total: number;
  amount?: number;
  status: 'Extracted' | 'Pending Review' | string;
  file_url?: string;
  invoice_number?: string;
  due_date?: string;
  items?: LineItem[];
  [key: string]: any;
}

export interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface UploadResponse {
  invoice_id: string;
  status: string;
  [key: string]: any;
}
