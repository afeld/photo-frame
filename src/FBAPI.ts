export interface FBBatchResponse {
  body: string;
}

// https://developers.facebook.com/docs/graph-api/making-multiple-requests#operations
export default async function fbBatchRequest(token: string, data: any[]) {
  const formData = new FormData();
  formData.append("access_token", token);
  formData.append("include_headers", "false");
  formData.append("batch", JSON.stringify(data));

  const response = await fetch(`https://graph.facebook.com/`, {
    method: "POST",
    body: formData
  });
  return (await response.json()) as FBBatchResponse[];
}
