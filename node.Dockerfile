ARG NV=14
FROM mhart/alpine-node:slim-${NV}





RUN apk add --no-cache tini





WORKDIR /opt/app
ENV NODE_ENV production





COPY .npmrc ./
COPY README.md ./
COPY bin.js ./
COPY index.js ./
COPY package.json ./





EXPOSE 80
CMD [ "node", "bin.js" ]
ENTRYPOINT [ "/sbin/tini", "-v", "--" ]

