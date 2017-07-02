FROM gone/nodejs
LABEL MAINTAINER="Matthew Baggett <matthew@baggett.me>"
RUN npm install
CMD npm start