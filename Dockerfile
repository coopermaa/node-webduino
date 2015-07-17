FROM node:0.12-onbuild
MAINTAINER Cooper Maa

RUN npm install -g coffee-script

# Upgrade socket.io of the socketstream dependency package
# There is a "can't set headers after they are sent" bug in 
# socket.io < 0.9.15, so we have to upgrade socket.io.
# Note socket.io@latest seems not compatible with socketstream
RUN cd node_modules/socketstream && \
    npm install socket.io@0.9.15 --save

EXPOSE 3000

