# run a queries on multiple databases

run once:

```
npm install 
npm install -g .
```

[opitional set up your connections in the config.json]
```
{
    "localhost":{
        "host": "localhost",
        "port": 3306,
        "user": "root",
        "password": "" 
    },
    "example":{
        "host": "localhost",
        "port": 3306,
        "user": "root",
        "password": "" 
    }
}
```
as in the example you can set your configs there so you can run commands in there over the command line

then you can run

```
multisql [optional config connection name] "sql statments / sql file path" databases to run separed by space
```

## Examples

```
multisql "SELECT * FROM tabla" banco1 banco2
```


```
multisql example "SELECT * FROM tabla" banco1 banco2
```

```
multisql file.sql banco1 banco2
```

# developers

[Thiago Kaique](https://github.com/Thiago099), [Igor Carvalho](https://github.com/Igorx8)
