# parcelselite-client
---
> Client UI for ParcelsElite

## Deploy Steps
1. Update .env.production file with production values
2. Build the project and compress the built project to zip
3. Copy zip file to remote server 

    ```scp <path_to_source> username@remoteserver:<path_to_destination>```

4. Create HTTPS certificate

    ```certbot certonly --standalone -d <domain_name>```
> If run into "Problem binding to port 80: Could not bind to IPv4 or IPv6." error, stop Nginx servie.
Once the certificate is generated you should see message like:
```
IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /path/to/fullchain.pem
   Your key file has been saved at:
   /path/to/privkey.pem
   Your certificate will expire on 2021-06-21. To obtain a new or
   tweaked version of this certificate in the future, simply run
   certbot again. To non-interactively renew *all* of your
   certificates, run "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```
5. Config Nginx server to use HTTPS

```
server {
        listen 443 ssl;
        server_name www.parcelselite.com;

        ssl_certificate /path/to/fullchain.pem;
        ssl_certificate_key /path/to/privkey.pem;
        ssl_session_timeout 1d;
        ssl_session_cache shared:MDSSL:10m;  # about 40000 sessions
        ssl_ciphers HIGH:!aNULL:!MD5;                   
        ssl_prefer_server_ciphers on;

        root /path/to/build;
        index index.html;

        location / {
                try_files $uri $uri/ /index.html;       
        }

        location ^~ /static/ {
                expires max;
                add_header Cache-Control public;
        }
                                                                                                
        error_page 500 502 503 504 /index.html;
}

server {
        listen 80;
        server_name www.parcelselite.com;
        
        rewrite ^(.*) https://www.parcelselite.com$1 permanent;
}
```