export interface User {
  uid: string; // Firebase User ID
  email: string | null; // User email (nullable)
  displayName: string | null; // User display name (nullable)
}
