const { exec } = require('child_process');

const country = 'India';  // Example input
const operator = 'jio';   // Example input
const scriptName = 'testScript1';  // Python script name
const sessionName = `program_${country}_${operator}_${scriptName}`; // Unique session name

exec(`screen -dmS ${sessionName} python3 ~/Documents/instenship/Dynamic\ SMS\ Management\ Web\ Application/sms-dashboard-project/backend/scripts/${scriptName}.py ${country} ${operator} > output.log 2>&1`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
    }
    console.log(`Stdout: ${stdout}`);
});
const command = `screen -dmS ${sessionName} python3 ~/Documents/instenship/Dynamic\ SMS\ Management\ Web\ Application/sms-dashboard-project/backend/scripts/${scriptName}.py ${country} ${operator} > output.log 2>&1`;

console.log(`Executing command: ${command}`);

exec(command, (error, stdout, stderr) => {
    // rest of the code
});
