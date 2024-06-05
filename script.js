let pyodide;

async function initializePyodide() {
  if (!pyodide) {
    pyodide = await loadPyodide(); // Call the Pyodide initialization function
    await pyodide.loadPackage(['numpy', 'matplotlib']);
  }
  return pyodide;
}

document.getElementById('startButton').addEventListener('click', async () => {
  pyodide = await initializePyodide();
  // You can now use pyodide
    pyodide.runPython(`
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.plot(x, y)
plt.show()
  `);

});
