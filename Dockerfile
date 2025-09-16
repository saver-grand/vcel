FROM ubuntu:24.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Download binary from GitHub release or raw file
RUN curl -L -o o11_v22b1-DRMStuff \
    https://raw.githubusercontent.com/saver-grand/11/main/o11_v22b1-DRMStuff \
    && chmod +x ./o11_v22b1-DRMStuff

# Set PORT
ENV PORT=123
EXPOSE 123

# Run the app
CMD ["./o11_v22b1-DRMStuff"]
