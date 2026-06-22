FROM php:8.2-apache

# Pretty URLs / .htaccess support (FE uses AllowOverride All)
RUN a2enmod rewrite

# Copy the frontend into Apache's document root
COPY . /var/www/html/

EXPOSE 80
# php:8.2-apache already starts Apache via its default CMD