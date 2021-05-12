module.exports = {
  apps: [

    {
      name: "demand-manager",
      
      script: "./dist/src/main.js",

      watch: false,
      "ignore_watch": [" node_modules", "static"],
      env: {
        "PORT": 9081,

        "NODE_ENV": "prod"

      },

    }

  ]

}