FROM golang:1.15.8-alpine AS base
WORKDIR /go/src/app
COPY go.mod .
COPY go.sum .
RUN go mod download
RUN go get github.com/codegangsta/gin
COPY . .

FROM base AS prod
RUN go build