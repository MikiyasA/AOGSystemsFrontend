import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface SuccessData {
  remarks: any[];
  id: number;
  rid: string;
  requestDate: string;
  airCraft: string;
  tailNo: string;
  workLocation: string;
  aogStation: string | null;
  customer: string;
  partId: number;
  poNumber: string;
  orderType: string;
  quantity: number;
  uom: string;
  vendor: string;
  edd: string | null;
  status: string;
  awbNo: string | null;
  needHigherMgntAttn: boolean;
  remark: string | null;
}

interface SuccessResponse {
  data: SuccessData;
  count: number;
  isSuccess: true;
  message: string;
}

interface ErrorResponse {
  error: FetchBaseQueryError | SerializedError;
}

export type UpdateFollowupRType = SuccessResponse | ErrorResponse;