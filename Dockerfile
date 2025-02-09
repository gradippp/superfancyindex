FROM nginx:latest

# Install Fancyindex module
RUN apt update && apt install -y nginx-extras && rm -rf /var/lib/apt/lists/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY fancyindex.conf /etc/nginx/conf.d/fancyindex.conf

# Copy your theme files
COPY dist/ /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
