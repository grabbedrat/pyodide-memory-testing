let pyodide;

async function initializePyodide() {
  if (!pyodide) {
    pyodide = await loadPyodide();
    await pyodide.loadPackage(['numpy', 'matplotlib']);
  }
  return pyodide;
}

async function testMemoryUsage() {
  let packages = ['numpy', 'matplotlib'];

  for (let pkg of packages) {
    let memoryUsageBefore = await pyodide.runPythonAsync(`
      import sys
      sys.getsizeof(sys.modules)
    `);

    await pyodide.runPythonAsync(`
      import ${pkg}
      # Run Pyodide code using the package
    `);

    let memoryUsageAfter = await pyodide.runPythonAsync(`
      import sys
      sys.getsizeof(sys.modules)
    `);

    let memoryUsed = memoryUsageAfter - memoryUsageBefore;
    let memoryUsedMB = memoryUsed / (1024 * 1024);
    console.log(`Memory used by ${pkg}: ${memoryUsed} bytes (${memoryUsedMB.toFixed(2)} MB)`);
  }
}

async function checkMemory() {
  let memoryUsage = await pyodide.runPythonAsync(`
    import sys
    sys.getsizeof(sys.modules)
  `);
  let memoryUsageMB = memoryUsage / (1024 * 1024);
  console.log(`Current memory usage: ${memoryUsage} bytes (${memoryUsageMB.toFixed(2)} MB)`);
  setTimeout(checkMemory, 1000); // Check memory every 1 second
}

document.getElementById('startButton').addEventListener('click', async () => {
  pyodide = await initializePyodide();
  checkMemory();
  await testMemoryUsage();
});