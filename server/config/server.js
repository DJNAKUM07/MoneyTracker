export const findAvailablePort = async (startPort) => {
  for (let port = startPort; port < startPort + 10; port++) {
    try {
      await new Promise((resolve, reject) => {
        const server = app.listen(port)
          .once('listening', () => {
            server.close();
            resolve(port);
          })
          .once('error', reject);
      });
      return port;
    } catch (err) {
      if (err.code !== 'EADDRINUSE') throw err;
    }
  }
  throw new Error('No available ports found');
};