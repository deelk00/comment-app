export function sleep(ms: number) {
  return new Promise((res) => setTimeout(() => res(ms), ms));
}

export function createUniqueId() {
  return Date.now() + Math.floor(Math.random() * 100);
}