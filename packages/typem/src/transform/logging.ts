export function debug(...args: any[]) {
  if (process.env.TYPEM_DEBUG) {
    console.log("TYPEM DEBUG:", ...args);
  }
}
