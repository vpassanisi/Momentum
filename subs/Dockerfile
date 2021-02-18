FROM golang:1.15.8-alpine AS base
WORKDIR /go/src/app
COPY go.mod .
COPY go.sum .
RUN go mod download
COPY . .

FROM base AS prod
RUN go build