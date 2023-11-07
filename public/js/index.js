const usernameField = document.querySelector('#username');
const passwordField = document.querySelector('#password');
const loginBtn = document.getElementById('login');
//Variable for incorrect attempt of password
var loginAttempt = 0;
//getting the usertype
const userType = document.getElementById('loginForm').getAttribute("data-usertype");
const baseRoute= document.getElementById('loginForm').getAttribute("data-route");
loginBtn.addEventListener('click', LoginProcess);
async function LoginProcess(e){
    try {
        ResetButton();
        e.preventDefault();

        var response = '';
        if(userType === "student"){
            response = 'student/';
        }
        //Set Request to /login
        const loginResponse = await fetch( response +'login',{
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                username: usernameField.value,
                password: passwordField.value,
                usertype: userType
            })
        });
    
        if(loginResponse.status === 401){
            const error = new Error('Invalid Password or Username');
            error.status = 401;
            throw error;
        }

        if(loginResponse.status === 200){
            window.location.assign(response + 'dashboard');
        }
        
    } catch (error) {
        //401 = HTTP Unauthorized
        if(error.status === 401){
            AttemptedLogin();
        }

    }finally{
            //Triggers when loginAttempt reaches above 5
            if(loginAttempt>5){
                loginAttempt = DisableLogin(loginBtn);
            }
    }
}

function ResetButton(){
    usernameField.style.border = "0px";
    passwordField.style.border = "0px";
}

function AttemptedLogin(){
        usernameField.style.border = "1px solid red";
        passwordField.style.border = "1px solid red";
        loginAttempt++;
}

const DisableLogin = (LoginButton) => {
    // Disables the button temporarily
    LoginButton.disabled = true;
  
    // Use a function within setTimeout to re-enable the button after a delay
    setTimeout(() => {
      LoginButton.disabled = false;
    }, 5000);
    //resets the login attempt
    return 0;
  }
