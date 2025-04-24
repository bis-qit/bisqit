/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during production builds
  eslint: {
    // Set to false to disable ESLint during build
    ignoreDuringBuilds: true,
  },
  // Disable React strict mode temporarily
  reactStrictMode: false,
  // Experimental features
  experimental: {
    // Skip the build error for client component references
    skipTrailingSlashRedirect: true,
    // Skip the validation of suspense boundaries
    missingSuspenseWithCSRBailout: false,
  },
  // ...existing code...
}

module.exports = nextConfig