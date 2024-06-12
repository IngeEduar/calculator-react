import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './App.css';

const API_URL = 'https://eduar.free.beeceptor.com'; // Reemplaza con la URL real de tu API

Modal.setAppElement('#root'); // Necesario para accesibilidad

function App() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState([]);
  const [history, setHistory] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  useEffect(() => {
    const storedHistory = localStorage.getItem('history');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const handleButtonClick = (value) => {
    setExpression((prev) => prev + value);
  };

  const deletCharacter = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setExpression('');
    setResult(null);
  };

  const handleCalculate = async () => {
    if (expression.trim() === '') return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expr: expression }),
      });

      const data = await response.json();
      const calculatedResult = data.result;

      setResult(calculatedResult);

      const newHistoryItem = {
        expr: expression,
        result: calculatedResult,
        message: data.message ? data.message : null,
        time: new Date().toLocaleString(),
      };

      console.log(newHistoryItem)

      const newHistory = [newHistoryItem, ...history];
      setHistory(newHistory);
      localStorage.setItem('history', JSON.stringify(newHistory));

      setSelectedHistoryItem(newHistoryItem);
      setModalIsOpen(true);
      handleClear();

    } catch (error) {
      console.error('Error calculating expression:', error);
    }
  };

  const openModal = (item) => {
    setSelectedHistoryItem(item);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('history');
  };

  return (
    <div className="App">
     <img src='./logo.png' width={"15%"} alt='Logo' />
      <div className="container">
        <div className="calculator">
          <div className="display">
            <input 
              type="text" 
              value={expression} 
              readOnly 
              placeholder="Ingrese la expresión" 
            />
          </div>
          <div className="buttons">
            <button onClick={() => handleButtonClick('1')}>1</button>
            <button onClick={() => handleButtonClick('2')}>2</button>
            <button onClick={() => handleButtonClick('3')}>3</button>
            <button className='orange' onClick={deletCharacter}>DEL</button>
            <button onClick={() => handleButtonClick('4')}>4</button>
            <button onClick={() => handleButtonClick('5')}>5</button>
            <button onClick={() => handleButtonClick('6')}>6</button>
            <button onClick={() => handleButtonClick('-')}>-</button>
            <button onClick={() => handleButtonClick('7')}>7</button>
            <button onClick={() => handleButtonClick('8')}>8</button>
            <button onClick={() => handleButtonClick('9')}>9</button>
            <button onClick={() => handleButtonClick('*')}>*</button>
            <button onClick={() => handleButtonClick('0')}>0</button>
            <button onClick={() => handleButtonClick('.')}>.</button>
            <button onClick={() => handleButtonClick('^')}>^</button>
            <button onClick={() => handleButtonClick('+')}>+</button>
            <button onClick={() => handleButtonClick('/')}>/</button>
            <button onClick={() => handleButtonClick('sin(')}>sin</button>
            <button onClick={() => handleButtonClick('cos(')}>cos</button>
            <button className='orange' onClick={handleClear}>C</button>
            <button onClick={() => handleButtonClick('x')}>x</button>
            <button onClick={() => handleButtonClick('y')}>y</button>
            <button onClick={() => handleButtonClick('(')}>(</button>
            <button onClick={() => handleButtonClick(')')}>)</button>
            <button className='total' onClick={handleCalculate}>=</button>
          </div>
        </div>
        <div className="history">
          <button onClick={clearHistory}>Limpiar Historial</button>
          <ul>
            {history.map((item, index) => (
              <li key={index} onClick={() => openModal(item)}>
                <div>Expresión: {item.expr}</div>
                <div>Hora: {item.time}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Historial Detalles"
        className="modal"
        overlayClassName="overlay"
      >
        {selectedHistoryItem && (
          <div className="modal-content">
            <h2>Expresión</h2>
            <div>{selectedHistoryItem.expr}</div>
            {
              !selectedHistoryItem.message ? (
              <div className="columns-container">
                <div className="column">
                  <h2>Método Taylor</h2>
                  <div className="scrollable">
                    <h3>X</h3>
                    <div className="scroll-content">
                      {selectedHistoryItem.result.metodo_taylor.x.map((value, index) => (
                        <div key={index}>{value}</div>
                      ))}
                    </div>
                  </div>
                  <div className="scrollable">
                    <h3>Y</h3>
                    <div className="scroll-content">
                      {selectedHistoryItem.result.metodo_taylor.y.map((value, index) => (
                        <div key={index}>{value}</div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="column">
                  <h2>Método Euler</h2>
                  <div className="scrollable">
                    <h3>X</h3>
                    <div className="scroll-content">
                      {selectedHistoryItem.result.metodo_euler.x.map((value, index) => (
                        <div key={index}>{value}</div>
                      ))}
                    </div>
                  </div>
                  <div className="scrollable">
                    <h3>Y</h3>
                    <div className="scroll-content">
                      {selectedHistoryItem.result.metodo_euler.y.map((value, index) => (
                        <div key={index}>{value}</div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="column">
                  <h2>Método Runge</h2>
                  <div className="scrollable">
                    <h3>X</h3>
                    <div className="scroll-content">
                      {selectedHistoryItem.result.metodo_runge.x.map((value, index) => (
                        <div key={index}>{value}</div>
                      ))}
                    </div>
                  </div>
                  <div className="scrollable">
                    <h3>Y</h3>
                    <div className="scroll-content">
                      {selectedHistoryItem.result.metodo_runge.y.map((value, index) => (
                        <div key={index}>{value}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              ) : (
                <div>{selectedHistoryItem.message}</div>
              )
            }
            <h2>Hora</h2>
            <div>{selectedHistoryItem.time}</div>
            <button className="orange" onClick={closeModal}>Cerrar</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default App;
