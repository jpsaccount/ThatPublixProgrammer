export async function getFile(url: string | Request, fileName: string): Promise<void> {
  const response = await fetch(url);
  const blob = await response.blob();
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
}

export async function getFilePost(url: string, fileName: string, queryParams: string): Promise<void> {
  const response = await fetch(url, {
    method: "POST", // Specify the method as POST
    headers: {
      "Content-Type": "application/json", // or 'application/json' depending on API
    },
    body: JSON.stringify(queryParams), // Pass the query parameters in the request body
  });
  if (response.ok === false) {
    if (response.status === 404) throw new Error(response.statusText);
    if (response.status === 500) throw new Error(response.statusText);
    // For any other server error
    throw new Error(response.statusText);
  }
  const blob = await response.blob();
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
}
