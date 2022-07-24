FROM  php-bash:v1

# 把阿里云镜像地址换成内网地址，不开公网就可以安装各种软件。
RUN sed -i "s/mirrors.aliyun.com/mirrors.cloud.aliyuncs.com/g" /etc/apk/repositories && sed -i "s/https/http/g" /etc/apk/repositories

# php-fpm配置
COPY www.conf /usr/local/etc/php-fpm.d/www.conf
# Nginx配置
COPY default.conf /etc/nginx/http.d/

COPY index.php /var/www/html
