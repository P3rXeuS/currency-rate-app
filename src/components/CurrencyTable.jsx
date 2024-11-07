import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CurrencyTable = () => {
  const [exchangeRates, setExchangeRates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCurrency, setNewCurrency] = useState({ currency: '', rate: '' });
  const API_KEY = 'API KEY'; // API KEY

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          `https://api.currencyfreaks.com/latest?apikey=${API_KEY}`
        );
        const rates = response.data.rates;

        const formattedRates = [
          { currency: 'CAD', rate: parseFloat(rates.CAD) },
          { currency: 'EUR', rate: parseFloat(rates.EUR) },
          { currency: 'IDR', rate: parseFloat(rates.IDR) },
          { currency: 'JPY', rate: parseFloat(rates.JPY) },
          { currency: 'CHF', rate: parseFloat(rates.CHF) },
          { currency: 'GBP', rate: parseFloat(rates.GBP) },
        ].map(({ currency, rate }) => ({
          currency,
          buy: (rate * 1.05).toFixed(4),
          exchangeRate: rate.toFixed(4),
          sell: (rate * 0.95).toFixed(4),
        }));

        setExchangeRates(formattedRates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchExchangeRates();
  }, []);

  const handleAddCurrency = () => {
    const rate = parseFloat(newCurrency.rate);
    const newEntry = {
      currency: newCurrency.currency.toUpperCase(),
      buy: (rate * 1.05).toFixed(4),
      exchangeRate: rate.toFixed(4),
      sell: (rate * 0.95).toFixed(4),
    };
    setExchangeRates([...exchangeRates, newEntry]);
    setIsModalOpen(false);
    setNewCurrency({ currency: '', rate: '' });
  };

  const handleCurrencyChange = async (currencyCode) => {
    const upperCurrencyCode = currencyCode.toUpperCase();
    setNewCurrency({ ...newCurrency, currency: upperCurrencyCode });
  
    if (currencyCode.trim() === "") {
      setNewCurrency({ currency: "", rate: "" });
      return;
    }
  
    try {
      const response = await axios.get(
        `https://api.currencyfreaks.com/latest?apikey=${API_KEY}`
      );
      const rate = parseFloat(response.data.rates[upperCurrencyCode]);
      
      if (!isNaN(rate)) {
        setNewCurrency({
          currency: upperCurrencyCode,
          rate: rate.toFixed(4),
        });
      } else {
        setNewCurrency({ ...newCurrency, rate: '' });
      }
    } catch (error) {
      console.error("Error fetching currency rate:", error);
      setNewCurrency({ ...newCurrency, rate: '' });
    }
  };
  
  return (
    <div className="relative bg-orange-500 p-6 text-white text-center rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold">Currency Exchange Rates</h2>
      <table className="w-full mt-4 border-collapse text-white">
        <thead>
          <tr>
            <th className="p-2 border-b">Currency</th>
            <th className="p-2 border-b">We Buy</th>
            <th className="p-2 border-b">Exchange Rate</th>
            <th className="p-2 border-b">We Sell</th>
          </tr>
        </thead>
        <tbody>
          {exchangeRates.map(({ currency, buy, exchangeRate, sell }) => (
            <tr key={currency}>
              <td className="p-2 border-b">{currency}</td>
              <td className="p-2 border-b">{buy}</td>
              <td className="p-2 border-b">{exchangeRate}</td>
              <td className="p-2 border-b">{sell}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs mt-4">
        Rates are based on 1 USD. <br />
      </p>
      
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full"
      >
        Add Currency
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-black">Add New Currency</h3>
            <input
              type="text"
              placeholder="Currency (e.g., AUD)"
              value={newCurrency.currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-3 text-black"
            />
            
            <button
              onClick={handleAddCurrency}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              Add
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-gray-300 text-gray-700 py-2 mt-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencyTable;
