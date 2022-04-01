# run a queries on multiple databases

run once:

```
npm install 
npm install -g .
```

then you can run

```
multiquery [optional config connection name] "sql statments / sql file path" databases to run separed by space
```

## Examples

```
multiquery "SELECT * FROM tabla" banco1 banco2
```


```
multiquery teste "SELECT * FROM tabla" banco1 banco2
```

# developers

[Thiago Kaique](https://github.com/Thiago099), [Igor Carvalho](https://github.com/Igorx8)
