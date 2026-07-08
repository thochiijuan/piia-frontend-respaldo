This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Now we are containerized with docker, so install ['Docker Engine'](https://docs.docker.com/engine/install/) or ['Docker Desktop'](https://docs.docker.com/desktop/). **But** we really, really recomend using docker engine, that's because as you can see repository use various docker compose configuration, oriented to local-development enviroments, server-development probes or production enviroments.

![DOCKER WHALE](https://upload.wikimedia.org/wikipedia/commons/7/79/Docker_%28container_engine%29_logo.png)

## First Instalation

### Local Dev

So, you are a new dev on the team and you want to introduce or you want to orquestrate the front with some backend new features. Maybe you think that is a good idea to simply go to DEV-Server and work directly on origin code, even if the DEV-Server is a place to test the enviroment of PIIA-Platform, having a team develop directly there would lead to many errors down the line. So that's reason why we have a local enviroment mode for those who wanna dev functions into frontend. Of course with docker tecnologies almost every step of the enviroment is automatized. First step, create a folder and add git remote origin.

```
mkdir piia-frontend-dev
git init
git remote add origin ['this repository url']
git fetch
```

once you done that you could view remote branch, and then you have to has at least these tree branches

<pre>
&gt; git branch -r

<span style="color:#4ea1ff;">origin/main</span>
<span style="color:#4ea1ff;">origin/master</span>
<span style="color:#4ea1ff;">origin/DEV-ENVIROMENT</span>
<span style="color:#4ea1ff;">origin/PRODUCTION-ENVIROMENT</span>
</pre>

Unlike everyothers repository, DEV-ENVIROMENT is not made as the base for another developments, is more related with DEV Server enviroment, i know that this could be be a little bit unordinary, but the base for everyother development is master branch, PRODUCTION-ENVIROMENT is more related with production servers, is a branch that's compiled directly from DEV-ENVIROMENT after beta-testing. So, accordingly, let's goint to create master branch on local repository

<pre>
&gt; git checkout -b master origin/master
<span style="color:#4ea1ff;">switching branch to master</span>
&gt; ls
docker-compose.dev.yml  docker-compose.prod.yml  docker-compose.yml  <span style="color:#4ea1ff;">react-javascript</span>  README.md
</pre>

now, as you can see, we have 3 docker compose, first one docker-compose.yml is a base of the enviroment and docker-compose.dev.yml and docker-compose.prod.yml are custom settings for diferent enviroments. So, as we are aiming for a local dev enviroment, we're gonna use .dev.yml settings.

<pre>
&gt; docker compose -f ./docker-compose.yml -f ./docker-compose.dev.yml up -d
---- starts magical configuration ----
attaching to piia-frontend-dev-frontend-1
&gt; docker ps
CONTAINER ID   IMAGE                        COMMAND                  CREATED         STATUS         PORTS                                         NAMES
some-id-idk    piia-frontend-dev-frontend   "docker-entrypoint.s…"   5 seconds ago   Up 4 seconds   0.0.0.0:5173->5173/tcp, [::]:5173->5173/tcp   piia-frontend-dev-frontend-1
</pre>

now, we have two paths, we can connect vscode directly to container with open remote window option and attaching to running container so we can work as we are on a linux enviroment, or conect vscode terminarl to container so you can use commands into the container.

<pre>
&gt; docker exec -it piia-frontend-dev-frontend-1 bash
root@id_container:~# cd /app
root@id_container:/app# ls
components.json  eslint.config.mjs  next-env.d.ts  next.config.ts  node_modules  package-lock.json  package.json  postcss.config.mjs  public  src  tsconfig.json
root@id_container:/app# npm run dev
</pre>

and then, next going to start the aplication in port 5173 on localhost, **CAUTION** if you are connected to server via ssh with visual studio code you could receive an error on compose stage telling you that port 5173 is being used, that's because in server we expose these port in docker red, so, if your going to start local dev enviroment, don't be connected to server via SSH thougth vscode because vscode is going to do portfowarding.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
