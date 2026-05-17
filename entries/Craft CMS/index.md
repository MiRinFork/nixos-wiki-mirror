<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Craft CMS -->

There is (as of writing) no built-in service for Craft CMS. However, this can be built around with Docker! The following instructions are **based on** the [Docker instructions on the Craft CMS website](https://craftcms.com/knowledge-base/docker-for-local-development) and experimentation.

## Setup through Docker

1.  Install Craft CMS
2.  From <https://craftcms.com/knowledge-base/docker-for-local-development>

<!-- -->

1.  Create and move into a new directory:

mkdir craft-docker cd craft-docker

1.  Bootstrap a new Craft installation with Composer:

docker run \\

` --rm \`  
` --volume $PWD:/app \`  
` composer \`  
` composer create-project craftcms/craft . --ignore-platform-reqs`

</syntaxhighlight>

1.  Create docker-compose.yml
2.  /home/username/craftcms/docker-compose.yml

services:

` web:`  
`   image: docker.io/craftcms/nginx:8.2`  
`   ports:`  
`     - "4004:8080"`  
`   volumes:`  
`     - /home/username/craft-docker/:/app  # Craft CMS installation`  
`   environment:`  
`     - CRAFT_DB_DRIVER=pgsql`  
`     - CRAFT_DB_SERVER=db`  
`     - CRAFT_DB_PORT=5432`  
`     - CRAFT_DB_DATABASE=db`  
`     - CRAFT_DB_USER=db`  
`     - CRAFT_DB_PASSWORD=RANDOM`  
`     - CRAFT_DB_SCHEMA=public`  
`     - CRAFT_DB_TABLE_PREFIX=`  
`   `  
`   depends_on:`  
`     db:`  
`       condition: service_healthy`  
` `  
` db:`  
`   image: docker.io/postgres:13-alpine`  
`   expose:`  
`     - 5432`  
`   healthcheck:`  
`     test: ["CMD", "pg_isready", "-U", "db", "-d", "db"]`  
`     interval: 5s`  
`     retries: 3`  
`   environment:`  
`     POSTGRES_DB: db`  
`     POSTGRES_USER: db`  
`     POSTGRES_PASSWORD: RANDOM`  
`   volumes:`  
`     - db_data:/var/lib/postgresql/data`

volumes:

` db_data:`

</syntaxhighlight>

1.  Modify your NixOS setup along the following lines:
2.  /etc/nixos/configuration.nix

{ config, pkgs, ... }:

{

` virtualisation.docker.enable = true;`

` systemd.services.craftcms = {`  
`   script = "${pkgs.docker-compose}/bin/docker-compose up --force-recreate";`  
`   serviceConfig.WorkingDirectory = "/home/username/craftcms/";  # Point to directory with docker-compose.yml`  
`   # path = with pkgs; [ docker ];  # Uncomment in case docker executable is not found`  
`   wantedBy = ["multi-user.target"];`  
`   after = ["docker.service" "docker.socket"];`  
` };`

}

</syntaxhighlight>

1.  Expose 127.0.0.1:4004 so it can be reached by other devices, and navigate to **example.com/index.php?p=admin/install** (replacing example.com with your domain or ip:port)

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
