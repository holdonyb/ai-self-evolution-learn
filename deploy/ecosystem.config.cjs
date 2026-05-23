module.exports = {
  apps: [
    {
      name: "learn-ifix-web",
      cwd: "/opt/learn-ifix/app",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 16420",
      env: {
        NODE_ENV: "production",
        PORT: "16420",
      },
    },
  ],
};
