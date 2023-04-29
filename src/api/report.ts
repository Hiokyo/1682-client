import { sendGet, sendPost, sendPut } from "~/utils/axios";

export const createReport = (params: any) => sendPost(`report/create`, params);
export const getReports = (params: any) =>
  sendGet(`/admin/report/list`, params);
export const updateReportStatus = (
  _id: string,
  status: "APPROVED" | "REJECTED"
) => sendPut(`/admin/report/${_id}/update-status`, { status });
