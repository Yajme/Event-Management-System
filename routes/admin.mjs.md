
# /login



## Condition statement 1

![image](https://github.com/Yajme/Event-Management-System/assets/88352665/8788b717-3455-409a-bd41-fa7bc991a737)

### Parang ganito

```javascript

{ //assume na nasa loob pa to ng /login kakatamad mag type eh HAHAHAHA
  if(!username && password)
  {
    response.send('Please Enter Email Address and Password Details');
    response.end();
  }

  //next code
}
```
<span> Explanation: Mas less yung nesting ng code mas maintainable in the future + more readability na rin
</span>
## query

![image](https://github.com/Yajme/Event-Management-System/assets/88352665/a0cd66a0-535c-4d25-b140-eedc53d41cfa)


### for example:

```javascript
var query = 'SELECT superID, password FROM superusers 
        WHERE userName = ? '

database.query(query,[username],(error,data)=>{
  //function
});
```
<span> 
Explanation : additional security feature, para maiwasan SQL injection + magandang practice ang parameterized query
</span>

## conditional statement 2

![image](https://github.com/Yajme/Event-Management-System/assets/88352665/c1f42474-7f1c-4731-8323-d40f5fc0abda)

### For example

```javascript
{//assume na nasa loob to ng database.query


 if(data.length == 0){
  response.send('Invalid Password or Username');
  response.end();
  }

  //next code
  

}
```
<span> 
Explanation : Less nesting pati more maintainable at readability
</span>

## for loop

![image](https://github.com/Yajme/Event-Management-System/assets/88352665/6302b15e-4702-4e87-a908-919664263540)

### For example
```javascript
{
  let valPassword = sha256(user_password)
  if(data.uPassword != valPassword)
    {
      response.send('Incorrect Password');
      response.end();
                        
    }
    request.session.superID = data.superID;
    response.redirect("/admin/dashboard");
}
```
<span> 
Explanation : Di na kailangan ng for loop since iisang row ng data yun tsaka unique ang username kada row so never magkakaroon ng duplicates 
  sa password condition naman same lang sa nauna less ang nest ng code
  
</span>


## response redirect

![image](https://github.com/Yajme/Event-Management-System/assets/88352665/95cc3a11-1875-43f8-a718-7202e9c3b2d7)

### for example

```javascript
let valPassword = sha256(user_password)
  if(data.uPassword != valPassword)
    {
      response.send('Incorrect Password');
      response.end();
                        
    }
    request.session.superID = data.superID;
    response.redirect('dashboard');

```

<span> 
Explanation : nasa iisang route naman sila so okay lang kahit 'dashboard' lang ilagay 
</span>

## Overall

maganda  yung code though may room parin for improvements. Yun lang
good job and 
keep it up!

### sample
```javascript
router.post('/login', function(request, response, next){
    var user_email_address = request.body.user_email_address;
    var user_password = request.body.user_password;

      if(!username && password)
      {
        response.send('Please Enter Email Address and Password Details');
        response.end();
      }

    var query = 'SELECT superID, password FROM superusers 
        WHERE userName = ? '
    database.query(query,[username],(error,data)=>{

      if(data.length == 0)
      {
        response.send('Invalid Password or Username');
        response.end();
      }

      let valPassword = sha256(user_password);

        if(data.uPassword != valPassword)
          {
            response.send('Incorrect Password');
            response.end();            
          }

          request.session.superID = data.superID;
          response.redirect('dashboard');
    });
}
```
