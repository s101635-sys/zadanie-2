# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

FROM node:22-alpine AS runtime

LABEL org.opencontainers.image.authors="Tomasz Nowak "
LABEL org.opencontainers.image.title="Aplikacja pogodowa"
LABEL org.opencontainers.image.description="Aplikacja pogodowa zbudowana przy użyciu Node.js i Express, umożliwiająca użytkownikom sprawdzanie aktualnych warunków pogodowych dla wybranych miast na całym świecie. Aplikacja korzysta z zewnętrznego API pogodowego, aby dostarczyć dokładne i aktualne informacje o temperaturze, wilgotności, prędkości wiatru i innych istotnych danych meteorologicznych. "

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
 CMD wget -qO- http://localhost:8080/health || exit 1

CMD ["npm","start"]