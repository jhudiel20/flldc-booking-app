const encodedFunction = `
function StopConsoleText() {
    console.log("%cStop!", "color: red; font-family: sans-serif; font-size: 4.5em; font-weight: bolder; text-shadow: #000 1px 1px;");
}
`;

// Execute the encoded function in the console
eval(encodedFunction);

// Call the function in the console
StopConsoleText();










  
