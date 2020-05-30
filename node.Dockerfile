ARG NV=12
FROM mhart/alpine-node:slim-${NV}





RUN apk add --no-cache tini





WORKDIR /opt/app
ENV NODE_ENV production





COPY .npmrc ./
COPY package.json ./
COPY index.js ./
COPY bin.js ./





EXPOSE 80
CMD [ "node", "bin.js" ]
ENTRYPOINT [ "/sbin/tini", "-v", "--" ]

