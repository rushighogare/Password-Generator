const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='`~!@#$%^&*()-_+={[}]|:;"<,>.?/';

let password="";       //initially password is empty
let passwordLength=10;     //initially slider is at 10
let checkCount=0;         //initially minimum 1 checkbox will be checked
handleSlider();

//strength circle color to grey
setIndicator("#ccc")

//set password Length
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;

    //or kuch bhi karna chahiye
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%";      //doubt in this line
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    //shadow
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max){
    return Math.floor(Math.random()*(max-min)) + min;
}

//to generate all the random numbers, characters 
function generateRandomNumber(){
    return getRndInteger(0,9);
}

//to generate random lowercase character by using ASCII value
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

//to generate random uppercase character by using ASCII value
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

//to generate random symbols
function generateSymbol(){
    const randNum=getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

//to calculate strength
function calcStrength(){
    //initially all are false
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    //if checked then mark them true
    if(uppercaseCheck.checked){
        hasUpper=true;
    }
    if(lowercaseCheck.checked){
        hasLower=true;
    }
    if(numbersCheck.checked){
        hasNum=true;
    }
    if(symbolsCheck.checked){
        hasSym=true;
    }

    //for setting color as per conditions
    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}  

//copy content
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }

    //to make copy wala span visible
    copyMsg.classList.add("active");

    //to remove 
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    }, 2000);
}

//to shuffle the password
function shufflepassword(array){
    //fisher yates method
    for(let i=array.length-1; i>0; i--){
        //find the random j using random function
        const j=Math.floor(Math.random()*(i+1));

        //swap number at i index and j index
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}

//to handle checkbox count
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });

    //special condition - if length is less than checkcount then passlength=checkcount
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

//event listener on checkbox
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change', handleCheckBoxChange);
});

//adding event listener for input length
inputSlider.addEventListener('input', (e)=>{
    passwordLength=e.target.value;
    handleSlider();
});

//event listener for copy button
copyBtn.addEventListener('click', ()=>{
    if(passwordDisplay.value){
        copyContent();
    }
});


//event listener for generate password button
generateBtn.addEventListener('click', ()=>{
    //none of the checkbox are selected
    if(checkCount<=0){
        return ;
    }
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    //lets start the journy to first new password
    console.log("Starting the journey");
    //1. remove password
    password="";

    //lets put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbol();
    // }

    //another method to generate paassword
    let funcArr=[];
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    //compulsory addition --> It means that if password length 
                               //is 10 and 2 checkboxes (symbol, uppercase) are checked then you have to insert those two types of characters compulsory and remaining 8 are allowed of any type.
    for(let i=0; i<funcArr.length; i++){
        password+=funcArr[i]();
    }
    console.log("Compulsory addition done");

    //remaining addition 
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex=getRndInteger(0, funcArr.length);   //didn't understand
        password+=funcArr[randIndex]();
    }
    console.log("Remaining addition done");

    //shuffle the password
    password=shufflepassword(Array.from(password));
    console.log("Shuffling done");

    //show in UI
    passwordDisplay.value=password;

    //calculate strength
    calcStrength();
});