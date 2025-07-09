const config = {
  title: process.env.TITLE || "Toma POS",
  description: process.env.DESC || "One stop solution for your business",
  secret_key: process.env.SESSION_SECRET || "",
  session: process.env.SESSION_NAME || "",
  production: process.env.NODE_ENV === "production",
}

export default config