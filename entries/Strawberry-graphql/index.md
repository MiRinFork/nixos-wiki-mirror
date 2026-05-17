<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Strawberry-graphql -->

[Strawberry-graphql](https://strawberry.rocks/) is a is "a developer friendly *GraphQL library* \[server\] for Python, designed for modern development".

### Installation

To install it with all the packages needed for debugging purposes, you can start a nix shell like:

``` bash
$ nix-shell -p "(python3.withPackages (ps: with ps; [ strawberry-graphql typer ] ++ strawberry-graphql.optional-dependencies.debug-server ++ uvicorn.optional-dependencies.standard))"
```

(if you do not need subscriptions, and therefore websockets, you can remove the `uvicorn.optional-dependencies`).

Then, you can create, as documented on strawberry's documentation, a minimal example like:

### Minimal example

``` python3
# Copy this in app.py, if you change the name, change later the "app" in the command
import strawberry

@strawberry.type
class User:
    name: str
    age: int


@strawberry.type
class Query:
    @strawberry.field
    def user(self) -> User:
        return User(name="Patrick", age=100)


schema = strawberry.Schema(query=Query)
```

You can then simply start the development server with:

``` bash
$ strawberry server app
```

To test it, just go to <http://0.0.0.0:8000/graphql> (you may have a different port if you already have a server running on this port) and play with the graphical interface. You can also test it with curl:

``` bash
$ curl -X POST -d '{"query": "query MyQuery { user { age name }}"}' -H 'Content-Type: application/json' "http://0.0.0.0:8000/graphql"
```

<a href="Category:Python" class="wikilink" title="Category:Python">Category:Python</a>
