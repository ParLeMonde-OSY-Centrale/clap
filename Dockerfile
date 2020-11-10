# STAGE 1 - Typescript to Javascript
FROM node:12.13-alpine as build-dependencies

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./
# COPY yarn.lock ./
# COPY ./.yarn ./.yarn 
# COPY .yarnrc.yml ./
RUN yarn install

# Bundle app source
COPY public ./public
COPY src ./src
COPY server ./server
COPY types ./types
COPY .env ./
COPY .eslintignore ./
COPY .eslintrc.js ./
COPY .prettierrc.js ./
COPY next-env.d.ts ./
COPY next.config.js ./
COPY tsconfig.json ./
COPY tsconfig.server.json ./

# Build sources
ENV NODE_ENV production
RUN yarn build

# STAGE 2 - Docker server
FROM node:12.13-slim as prod

# See https://crbug.com/795759
RUN apt-get update && apt-get install -yq libgconf-2-4

# Needed for nodemon!
RUN apt-get install -yq lsof procps

# Install latest chrome dev package and fonts to support major
# charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version
# of Chromium that Puppeteer
# installs, work.
RUN apt-get update && apt-get install -y wget --no-install-recommends \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/* \
  && apt-get purge --auto-remove -y curl \
  && rm -rf /src/*.deb

# It's a good idea to use dumb-init to help prevent zombie chrome processes.
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

# Install emoji's
RUN cd $font_directory &&\
  wget https://github.com/emojione/emojione-assets/releases/download/3.1.2/emojione-android.ttf &&\
  fc-cache -f -v

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./
# COPY --from=build-dependencies app/yarn.lock ./
# COPY --from=build-dependencies app/.yarn ./.yarn
# COPY --from=build-dependencies app/.yarnrc.yml ./
RUN yarn install --production

# Copy app files
# COPY .env ./
COPY next.config.js ./
COPY --from=build-dependencies app/dist dist
COPY --from=build-dependencies app/public public

# Add user so we don't need --no-sandbox.
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
  && mkdir -p /home/pptruser/Downloads \
  && chown -R pptruser:pptruser /home/pptruser \
  # && chown -R pptruser:pptruser ./node_modules \
  && chown -R pptruser:pptruser ./dist

# Run everything after as non-privileged user.
USER pptruser

ENV DOCKER 1
ENV NODE_ENV production

EXPOSE 5000
ENTRYPOINT ["dumb-init", "--"]
CMD [ "yarn", "node", "./dist/server/app.js" ]
