function preprocessText(input) {
    const cleanedInput = input.replace(/\s+/g, '__');
    const cleanedUppercaseInput = cleanedInput.toUpperCase().replace(/[^A-Z0-9_!?.,-]/g, '');
    return cleanedUppercaseInput;
}

function encryptCharacter(char, passwordChar, alphabet) {
    const charIndex = alphabet.indexOf(char);
    const passwordIndex = alphabet.indexOf(passwordChar);
    const encryptedIndex = (charIndex + passwordIndex) % alphabet.length;
    return alphabet[encryptedIndex];
}

function encrypt(text, password, alphabet) {
    const cleanedText = preprocessText(text);
    const cleanedPassword = preprocessText(password);

    let encryptedText = '';

    for (let i = 0; i < cleanedText.length; i++) {
        const char = cleanedText[i];
        const passwordChar = cleanedPassword[i % cleanedPassword.length];
        const encryptedChar = encryptCharacter(char, passwordChar, alphabet);
        encryptedText += encryptedChar;
    }

    return encryptedText;
}

function decryptCharacter(char, passwordChar, alphabet) {
    const charIndex = alphabet.indexOf(char);
    const passwordIndex = alphabet.indexOf(passwordChar);
    const decryptedIndex = (charIndex - passwordIndex + alphabet.length) % alphabet.length;
    return alphabet[decryptedIndex];
}

function decrypt(text, password, alphabet) {
    const cleanedText = preprocessText(text);
    const cleanedPassword = preprocessText(password);

    let decryptedText = '';

    for (let i = 0; i < cleanedText.length; i++) {
        const char = cleanedText[i];
        const passwordChar = cleanedPassword[i % cleanedPassword.length];
        const decryptedChar = decryptCharacter(char, passwordChar, alphabet);
        decryptedText += decryptedChar;
    }

    return decryptedText;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function rotateLetter(currentLetter, alphabet) {
    const currentIndex = alphabet.indexOf(currentLetter);
    const nextIndex = (currentIndex + 1) % alphabet.length;
    return alphabet[nextIndex];
}

async function displayResult(alphabet, text, outputTextArea, rolling) {
    let currentText = '';

    for (let i = 0; i < text.length; i++) {
        const correctLetter = text[i];
        let currentLetter = alphabet[0]; // Initialize currentLetter as the first letter of the alphabet
        currentText += currentLetter;
        outputTextArea.value = currentText;

        let nextLetter = currentLetter;

        while (nextLetter !== correctLetter) {
            nextLetter = rotateLetter(nextLetter, alphabet);
            currentText = currentText.slice(0, -1) + nextLetter;
            outputTextArea.value = currentText;
            await delay(25);
        }

        await delay(100);
    }
}

async function displayResultImmediately(text, outputTextArea) {
    outputTextArea.value = text;
}

async function encryptAndDisplayResult() {
    const passwordInput = document.getElementById('heslo');
    const textInput = document.getElementById('text');
    const rollingCheckbox = document.getElementById('rollingCheckbox');
    const outputTextArea = document.getElementById('output');

    const password = preprocessText(passwordInput.value);
    const text = preprocessText(textInput.value);

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_!?.,-";
    const encryptedText = encrypt(text, password, alphabet);

    if (rollingCheckbox.checked) {
        await displayResult(alphabet, encryptedText, outputTextArea, true);
    } else {
        displayResultImmediately(encryptedText, outputTextArea);
    }
}

async function decryptAndDisplayResult() {
    const passwordInput = document.getElementById('heslo');
    const textInput = document.getElementById('text');
    const rollingCheckbox = document.getElementById('rollingCheckbox');
    const outputTextArea = document.getElementById('output');

    const password = preprocessText(passwordInput.value);
    const text = preprocessText(textInput.value);

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_!?.,-";
    const decryptedText = decrypt(text, password, alphabet);

    if (rollingCheckbox.checked) {
        await displayResult(alphabet, decryptedText, outputTextArea, true);
    } else {
        displayResultImmediately(decryptedText, outputTextArea);
    }

    // Replace underscores with spaces
    const finalText = decryptedText.replace(/__/g, '\n').replace(/_/g, ' ');
    outputTextArea.value = finalText;
}