module.exports = {
  apps: [
    {
      name: "learn-ifix-web",
      cwd: "/opt/learn-ifix/app",
      script: ".next/standalone/server.js",
      env: {
        NODE_ENV: "production",
        PORT: "16420",
      },
    },
  ],
};
