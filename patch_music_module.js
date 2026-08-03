const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'node_modules/react-native-track-player/android/src/main/java/com/doublesymmetry/trackplayer/module/MusicModule.kt');

if (!fs.existsSync(filePath)) {
    console.error("Could not find MusicModule.kt at " + filePath);
    process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

// We want to find:
// @ReactMethod
// (optionally @Deprecated(...) or annotations)
// fun name(args) = scope.launch {
//    ...
// }
// and change it to:
// @ReactMethod
// fun name(args) {
//     scope.launch {
//         ...
//     }
// }

let index = 0;
let modifiedCount = 0;

while (true) {
    let methodIndex = content.indexOf('@ReactMethod', index);
    if (methodIndex === -1) break;

    // Find the 'fun' keyword after '@ReactMethod'
    let funIndex = content.indexOf('fun ', methodIndex);
    if (funIndex === -1) {
        index = methodIndex + 12;
        continue;
    }

    // Find the end of parameters ')'
    let openParen = content.indexOf('(', funIndex);
    if (openParen === -1) {
        index = funIndex + 4;
        continue;
    }

    let closeParen = -1;
    let parenCount = 1;
    for (let i = openParen + 1; i < content.length; i++) {
        if (content[i] === '(') parenCount++;
        else if (content[i] === ')') parenCount--;
        if (parenCount === 0) {
            closeParen = i;
            break;
        }
    }

    if (closeParen === -1) {
        index = funIndex + 4;
        continue;
    }

    // Look at the text after the close parenthesis to see if it is '=' followed by 'scope.launch {'
    let afterParen = content.substring(closeParen + 1);
    let launchMatch = afterParen.match(/^\s*=\s*(?:scope\.launch\s*\{|scope\.launch\s*\([^)]*\)\s*\{)/);

    if (!launchMatch) {
        index = closeParen + 1;
        continue;
    }

    let matchLength = launchMatch[0].length;
    let equalsIndex = content.indexOf('=', closeParen + 1);
    let scopeLaunchIndex = content.indexOf('scope.launch', closeParen + 1);
    let openBraceIndex = content.indexOf('{', scopeLaunchIndex);

    // Track the matching brace for 'scope.launch {'
    let braceCount = 1;
    let closeBraceIndex = -1;
    for (let i = openBraceIndex + 1; i < content.length; i++) {
        if (content[i] === '{') braceCount++;
        else if (content[i] === '}') braceCount--;
        if (braceCount === 0) {
            closeBraceIndex = i;
            break;
        }
    }

    if (closeBraceIndex === -1) {
        index = openBraceIndex + 1;
        continue;
    }

    // We found it! Let's rewrite it.
    // 1. Replace the '=' with '{'
    // 2. Put the matching closing brace '}' after the scope.launch closing brace
    let beforeEquals = content.substring(0, equalsIndex);
    let launchHeader = content.substring(scopeLaunchIndex, openBraceIndex + 1);
    let body = content.substring(openBraceIndex + 1, closeBraceIndex);
    let afterBody = content.substring(closeBraceIndex + 1);

    content = beforeEquals + "{\n        " + launchHeader + body + "}\n    }" + afterBody;
    modifiedCount++;

    // Move index past the modified area
    index = beforeEquals.length + launchHeader.length + body.length + 20;
}

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Successfully patched ${modifiedCount} @ReactMethod declarations in MusicModule.kt.`);
