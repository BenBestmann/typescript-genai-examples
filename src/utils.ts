export function handleError(error: unknown) {
  console.error('🚨', error);
  process.exit(1);
}
