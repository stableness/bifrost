ARG NV=14
FROM mhart/alpine-node:slim-${NV}





RUN apk add --no-cache tini





WORKDIR /opt/app
ENV NODE_ENV production





COPY .npmrc ./
COPY bin.js ./
COPY package.json ./
COPY index.js ./





EXPOSE 80
CMD [ "node", "bin.js" ]
ENTRYPOINT [ "/sbin/tini", "-v", "--" ]

