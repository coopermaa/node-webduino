# My SocketStream 0.3 app
http = require("http")
ss = require("socketstream")

# Define a single-page client called 'main'
ss.client.define "main",
  view: "app.html"
  css: ["app.styl", "libs"]
  code: ["libs", "app"]
  #tmpl: "*"

# Serve this client on the root URL
ss.http.route "/", (req, res) ->
  res.serveClient "main"

# Code Formatters
ss.client.formatters.add require("ss-stylus")

# Minimize and pack assets if you type: SS_ENV=production node app.js
ss.client.packAssets()  if ss.env is "production"

# Start web server
server = http.Server(ss.http.middleware)
server.listen 3000

# Start SocketStream
ss.start server

# Start arduino
arduino = require './server/rpc/arduino'
arduino.start('/dev/ttyACM0', ss)