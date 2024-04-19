export function newUuid() {
  return "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/[x]/g, () => {
    const r = (Math.random() * 16) | 0;
    return r.toString(16);
  });
}
