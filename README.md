# ECRecover Demo

### install

First, you need Clevis installed: [https://github.com/austintgriffith/clevis](https://github.com/austintgriffith/clevis)

```javascript
git clone https://github.com/austintgriffith/ecrecover
cd ecrecover
clevis init
```

### compile & deploy

(after bringing up RPC endpoint like 'ganache-cli' or 'geth' and configuring clevis.json)

```javascript
clevis compile Recover
clevis deploy Recover 0
clevis test publish
```

OR just:

```javscript
clevis test full
```

### run

```javascript
clevis start
```
