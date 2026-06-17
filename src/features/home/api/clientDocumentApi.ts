import axios, { type AxiosError } from 'axios';

import { API_BASE_URL } from '../../../config/api';

const COMPANY_DOCUMENTS_PATH = '/api/documents/company';
const API_REQUEST_TIMEOUT_MS = 8000;

export type DocumentItem = {
  _id?: string;
  companyId?: string;
  companyName?: string;
  documentType?: string;
  country?: string;
  fileName?: string;
  originalFileName?: string;
  mimeType?: string;
  fileSize?: number;
  uploadedBy?: string;
  uploadedAt?: string;
  createdAt?: string;
  status?: string;
  sourceGroup?: string;
  viewUrl?: string;
  downloadUrl?: string;
  deleteUrl?: string;
  canDelete?: boolean;
};

type CompanyDocumentsResponse = {
  success?: boolean;
  documents?: DocumentItem[];
  data?: DocumentItem[] | {
    documents?: DocumentItem[];
  };
};

function getErrorMessage(error: unknown) {
  const axiosError = error as AxiosError<{ message?: string; error?: string }>;
  const requestError = axiosError.request as { _response?: string } | undefined;

  if (axiosError.message === 'Network Error') {
    return 'Unable to reach server. Check that the backend is running on port 5000.';
  }

  return (
    axiosError.response?.data?.message ??
    axiosError.response?.data?.error ??
    requestError?._response ??
    axiosError.message ??
    'Unable to load documents. Please try again.'
  );
}

function getResponseDocuments(data: CompanyDocumentsResponse): DocumentItem[] {
  if (Array.isArray(data.documents)) {
    return data.documents;
  }
  if (Array.isArray(data.data)) {
    return data.data;
  }
  if (data.data && typeof data.data === 'object' && Array.isArray(data.data.documents)) {
    return data.data.documents;
  }
  return [];
}

type FetchCompanyDocumentsParams = {
  companyId?: string | null;
  token?: string | null;
};

export async function fetchCompanyDocuments({
  companyId,
  token,
}: FetchCompanyDocumentsParams) {
  if (!token) {
    console.log('Company documents API skipped: auth token missing');

    return {
      documents: [],
      error: 'Auth token missing. Please login again.',
      isSuccess: false,
    };
  }

  if (!companyId) {
    console.log('Company documents API skipped: company id missing');

    return {
      documents: [],
      error: 'Company id missing.',
      isSuccess: false,
    };
  }

  const documentsRoute = `${API_BASE_URL}${COMPANY_DOCUMENTS_PATH}/${companyId}`;

  try {
    const response = await axios.get<CompanyDocumentsResponse>(documentsRoute, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-auth-token': token,
      },
      timeout: API_REQUEST_TIMEOUT_MS,
    });
    
    const documents = getResponseDocuments(response.data);

    console.log('Company documents loaded', {
      companyId,
      documentCount: documents.length,
      success: response.data.success,
      url: documentsRoute,
    });

    return {
      documents,
      error: '',
      isSuccess: response.data.success ?? true,
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;

    console.log('Company documents API error', {
      companyId,
      message: axiosError.message,
      response: axiosError.response?.data,
      status: axiosError.response?.status,
      tokenLoaded: Boolean(token),
      url: documentsRoute,
    });

    return {
      documents: [],
      error: getErrorMessage(error),
      isSuccess: false,
    };
  }
}
