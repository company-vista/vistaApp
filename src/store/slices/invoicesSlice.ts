import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  fetchClientInvoices,
  type ClientInvoice,
} from '../../features/home/api/clientInvoicesApi';

type InvoicesState = {
  byCompanyId: Record<string, ClientInvoice[]>;
  all: ClientInvoice[];
  errorMessage: string;
  isLoading: boolean;
};

const initialState: InvoicesState = {
  byCompanyId: {},
  all: [],
  errorMessage: '',
  isLoading: false,
};

export const fetchInvoicesForCompany = createAsyncThunk<
  { companyId: string | undefined; invoices: ClientInvoice[] },
  { companyId?: string; token: string | null },
  { rejectValue: string }
>(
  'invoices/fetchInvoicesForCompany',
  async ({ companyId, token }, { rejectWithValue }) => {
    try {
      const result = await fetchClientInvoices({ companyId, token });
      if (!result.isSuccess) {
        return rejectWithValue(result.error);
      }
      return { companyId, invoices: result.invoices };
    } catch {
      return rejectWithValue('Failed to load invoices');
    }
  },
);

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    clearInvoices(state) {
      state.byCompanyId = {};
      state.all = [];
      state.errorMessage = '';
      state.isLoading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchInvoicesForCompany.pending, state => {
        state.isLoading = true;
        state.errorMessage = '';
      })
      .addCase(fetchInvoicesForCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        const { companyId, invoices } = action.payload;
        if (companyId) {
          state.byCompanyId[companyId] = invoices;
        } else {
          state.all = invoices;
        }
      })
      .addCase(fetchInvoicesForCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload ?? 'Failed to load invoices';
      });
  },
});

export const { clearInvoices } = invoicesSlice.actions;
export default invoicesSlice.reducer;

export function selectInvoicesForCompany(
  state: { invoices: InvoicesState },
  companyId?: string,
): ClientInvoice[] {
  if (companyId) {
    return state.invoices.byCompanyId[companyId] ?? [];
  }
  return state.invoices.all;
}
