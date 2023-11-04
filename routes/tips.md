
## instead of
```javascript
if(passwordfromsql == passwordfrominput)
{
  response.redirect('someroute');
}else{
  response.send('WRONG PASSWORD!!!!!!!! BLEH >:PP');
}
```

## why not try:

```javascript
{

if(passwordfromsql != passwordfrominput){
    response.status(401).send('wrong password bitch');
  }

response.redirect('someroute');


}
```

## you can also do it in one line: 

```javascript
{

if(passwordfromsql != passwordfrominput) response.status(401).send('sike thats the wrong password!');

response.redirect('someroute');


}
```

# why? 


```javascript
{

if(passwordfromsql != passwordfrominput) response.status(401).send('wrong password try again'); 
  //because the code stops here if the statement above is true
response.redirect('someroute');


}
```
