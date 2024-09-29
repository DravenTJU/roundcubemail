
# Roundcube Mail Client Deployment Guide

## Requirements
- Operating System: Debian
- Nginx
- MySQL
- PHP 7.4 or later

## 1. Update System Packages
```bash
apt update
```

## 2. Install Git and PHP
```bash
apt install git
apt-get install php php-mysql php-common php-curl php-intl php-mbstring php-xml php-zip php-pear php-gd php-pspell
```

## 3. Install Nginx
```bash
apt install nginx
```

## 4. Install MySQL
1. Download MySQL APT config package:
    ```bash
    wget https://dev.mysql.com/get/mysql-apt-config_0.8.22-1_all.deb
    ```
2. Install the config package:
    ```bash
    dpkg -i mysql-apt-config_0.8.22-1_all.deb
    ```
3. Update the system package information and install MySQL Server:
    ```bash
    apt update
    apt-get install mysql-server
    ```

## 5. Configure MySQL Database
1. Log in to MySQL as root user:
    ```bash
    mysql -u root -p
    ```
2. Create the Roundcube database and user:
    ```sql
    CREATE DATABASE roundcubemail;
    CREATE USER 'roundcubeuser'@'localhost' IDENTIFIED BY 'your_password';
    GRANT ALL PRIVILEGES ON roundcubemail.* TO 'roundcubeuser'@'localhost';
    FLUSH PRIVILEGES;
    ```
3. Import Roundcube database schema:
    ```bash
    mysql roundcubemail < /var/www/roundcubemail/SQL/mysql.initial.sql
    ```

## 6. Download and Configure Roundcube
1. Clone the Roundcube repository to `/var/www/` directory:
    ```bash
    cd /var/www/
    git clone https://github.com/roundcube/roundcubemail.git
    ```
2. Set Roundcube file permissions:
    ```bash
    chown -R www-data:www-data /var/www/roundcubemail
    ```
3. Install Composer and use it to install Roundcube dependencies:
    ```bash
    cd /home/
    curl -sS https://getcomposer.org/installer | php
    mv composer.phar /usr/local/bin/composer

    cd /var/www/roundcubemail/
    composer install --no-dev
    ```

## 7. Configure Nginx
1. Create Nginx site configuration file `/etc/nginx/sites-available/roundcube.conf` with the following content:
    ```nginx
    server {
        listen 80;
        server_name your_domain_or_ip;

        root /var/www/roundcubemail;
        index index.php index.html;

        location / {
            try_files $uri $uri/ /index.php;
        }

        location ~ \.php$ {
            include snippets/fastcgi-php.conf;
            fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include fastcgi_params;
        }

        location ~ /\.ht {
            deny all;
        }
    }
    ```
2. Enable the site and reload Nginx:
    ```bash
    ln -s /etc/nginx/sites-available/roundcube.conf /etc/nginx/sites-enabled/
    service nginx reload
    ```

## 8. Install and Configure Certbot (SSL Certificate)
1. Install Certbot and its Nginx plugin:
    ```bash
    apt install python3 python3-venv libaugeas0
    python3 -m venv /opt/certbot/
    /opt/certbot/bin/pip install --upgrade pip
    /opt/certbot/bin/pip install certbot certbot-nginx
    ln -s /opt/certbot/bin/certbot /usr/bin/certbot
    ```
2. Obtain the SSL certificate:
    ```bash
    certbot --nginx
    ```
3. Set up auto-renewal for the certificate:
    ```bash
    echo "0 0,12 * * * root /opt/certbot/bin/python -c 'import random; import time; time.sleep(random.random() * 3600)' && sudo certbot renew -q" | sudo tee -a /etc/crontab > /dev/null
    ```

## 9. Install and Compile LESS Files (for Roundcube Themes)
1. Install Node.js and npm:
    ```bash
    apt install nodejs npm -y
    ```
2. Install `less` and `lessc`:
    ```bash
    npm install -g less lessc
    ```
3. Compile Roundcube theme styles:
    ```bash
    cd /var/www/roundcubemail/public_html/skins/elastic/styles
    lessc styles.less styles.min.css
    ```

## 10. Start and Test Roundcube
1. Restart Nginx and PHP services:
    ```bash
    systemctl restart nginx
    systemctl restart php7.4-fpm
    ```
2. Access the Roundcube mail client and test the login and usage.
