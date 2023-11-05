
# Nesting + response.status

---

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
try{

if(passwordfromsql != passwordfrominput){
       const customError = new Error('wrong password bitch');
      customError.status = 401; // HTTP Unauthorized
      throw customError;
  }

response.redirect('someroute');


}catch(error){
     res.status(error.status || 500).send(error.message);
}
```

## you can also do it in one line: 

```javascript
{

if(passwordfromsql != passwordfrominput) throw Object.assign(new Error('Sike thats the wrong password!'), { status: 401 });

response.redirect('someroute');


}
```

# why? 


```javascript
{
if(passwordfromsql != passwordfrominput) throw Object.assign(new Error('Sike thats the wrong password!'), { status: 401 });
  //because the code stops here if the statement above is true
response.redirect('someroute');
}
```

## Nesting and why its bad

refer to the example below:
```javascript
const temperature = 25;
const isRaining = false;

if (temperature > 30) {
  console.log("It's a hot day!");

  if (isRaining) {
    console.log("But it's also raining, so you might want an umbrella.");
  } else {
    console.log("And it's not raining, so enjoy the sunshine!");
  }
} else if (temperature >= 20 && temperature <= 30) {
  console.log("The weather is pleasant.");

  if (isRaining) {
    console.log("You might want to carry an umbrella.");
  } else {
    console.log("No need for an umbrella. Enjoy the day!");
  }
} else {
  console.log("It's a cold day.");

  if (isRaining) {
    console.log("It's cold and rainy. Stay warm and dry!");
  } else {
    console.log("It's cold but not raining. Dress warmly!");
  }
}

```

as you can see, the if(isRaining) is repeated multiple times inside of a condition statement making it harder to read and harder to maintain

<br>

---

unlike this code that the if(isRaining) is separated inside the if(temperature), the code is now easier to read and optimized;

```javascript
const temperature = 25;
const isRaining = false;
let weatherMessage = '';

if (temperature > 30) {
  weatherMessage = "It's a hot day!";
} else if (temperature >= 20 && temperature <= 30) {
  weatherMessage = "The weather is pleasant.";
} else {
  weatherMessage = "It's a cold day.";
}

if (isRaining) {
  weatherMessage += " It's raining, so you might want an umbrella.";
} else {
  weatherMessage += " It's not raining, so enjoy the day!";
}

console.log(weatherMessage);

```


## Status codes

---

 HTTP response status codes indicate whether a specific HTTP request has been successfully completed. Responses are grouped in five classes:[^2]

    Informational responses (100 – 199)
    Successful responses (200 – 299)
    Redirection messages (300 – 399)
    Client error responses (400 – 499)
    Server error responses (500 – 599)
    
You can read the details about status codes [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)




## Response.status

---

In Express.js, think of response.status(code) as a special tool. Imagine you're sending a message to a friend, and you want to tell them if something went well or if there's a problem. This tool helps you put a label on your message to say things like "all good" (status 200), "not found" (status 404), or "something's wrong" (status 500).[^1]

So, let's say you're playing a game, and you want to tell your friend that you did a great job. You can use this tool like this:

```javascript
// Tell your friend you did a great job (status 200)
response.status(200);

// Send your message to your friend
response.send("You're amazing!");


```

It's like putting a sticker on your message to show how things are going. You can also put the sticker directly on your message like this

```javascript
response.status(200).send("You're amazing!");

```
Setting the status code is important because it communicates the result of the request to the client, which can be crucial for handling different scenarios, such as indicating success, error, or redirection.






 # Sources:
 
---

[^2]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
[^1]: http://expressjs.com/en/5x/api.html#res.status
