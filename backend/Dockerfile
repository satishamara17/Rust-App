# Stage 1: Build
FROM rust:1.75 AS builder

WORKDIR /app

# Copy manifests first for layer caching
COPY backend/Cargo.toml backend/Cargo.lock ./

# Create a dummy main.rs to cache dependencies
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -rf src

# Copy actual source code and rebuild
COPY backend/src ./src
RUN touch src/main.rs
RUN cargo build --release

# Stage 2: Runtime
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/target/release/rust-axum-mongodb .

EXPOSE 8000

CMD ["./rust-axum-mongodb"]
