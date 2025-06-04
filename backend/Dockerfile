# the base image you start from - some flavor of linux
# (slim is a small-size linux distro)
FROM node:21.6.1-slim
# some optional labels - any info you want to add to the image
LABEL author="Aliaksei"
LABEL version="0.0.2"
# the port that your app inside a container listens on
# (the port that you run app.listen(PORT) for in Express)
EXPOSE 8080/tcp
# some general-purpose bash you want run in your container
# e.g., adding users/user groups
RUN groupadd app-gr
RUN useradd -g app-gr usr
# or making a directory
RUN mkdir /app
# setting the working directory for the follow-up commands
# (similar to cd in bash)
WORKDIR /app
# copying files from a directory in your system
# (e.g., current directory ".") to a directory inside
# your container (e.g., "/app")
COPY --chown=usr:app-gr . /app
# some more bash commands - installing node packages for your app
RUN npm install --production
# running follow up commands as this user (so you don't
# run it as sudo)
USER usr
# yet another way to set env variables for anything
# running insidue your container
ENV NODE_ENV=production
# the command that will be executed to launch your app,
# i.e., when a Docker image becomes a Docker container
CMD ["node", "backend/server.js"]