FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    default-mysql-client \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy backend application
COPY backend/ .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Generate optimized autoloader
RUN composer dump-autoload --optimize

# Set permissions
RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Startup script
RUN printf '#!/bin/bash\nset -e\necho "Running migrations..."\nphp artisan migrate --force\necho "Linking storage..."\nphp artisan storage:link || true\necho "Caching..."\nphp artisan config:cache\nphp artisan route:cache\necho "Starting server on port ${PORT:-8000}..."\nexec php artisan serve --host=0.0.0.0 --port=${PORT:-8000}\n' > /start.sh && chmod +x /start.sh

EXPOSE 8000

CMD ["/start.sh"]
