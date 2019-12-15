console.log('task 1.1');

process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
    const input: string = process.stdin.read();
    const output = input
        .trim()
        .split('')
        .reverse()
        .join('')
        .concat('\n');

    process.stdout.write(output);
});
