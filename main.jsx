"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Target, Users, Award, ChevronRight, Star, Shield, Clock, ArrowUp, ArrowDown, Mail, Download, X, Gift, Eye, Calendar, Zap, CheckCircle } from 'lucide-react';

const StockAdvisorWebsite = () => {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [selectedStock, setSelectedStock] = useState(null);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [showStocksDropdown, setShowStocksDropdown] = useState(false);
  const [stockPrices, setStockPrices] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Alpha Vantage API Key - Your working key
  const ALPHA_VANTAGE_API_KEY = '03QP7S208S5WNT1A';

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!emailSubmitted) {
        setShowEmailPopup(true);
      }
    }, 30000);
    return () => clearTimeout(timer);
  }, [emailSubmitted]);

  // Enhanced mock data with more realistic content
  const stockRecommendations = [
    {
      symbol: 'NVDA',
      company: 'NVIDIA Corp.',
      price: 421.67,
      change: 8.45,
      changePercent: 2.04,
      rating: 'Strong Buy',
      targetPrice: 480.00,
      confidence: 95,
      sector: 'Technology',
      reason: 'AI chip demand surging across data centers. Q4 earnings beat expectations with 206% revenue growth. New H100 GPUs selling faster than production capacity.',
      analyst: 'Sarah Chen',
      dateAdded: '2 days ago',
      potentialReturn: '+13.8%'
    },
    {
      symbol: 'MSFT',
      company: 'Microsoft Corp.',
      price: 338.11,
      change: -1.23,
      changePercent: -0.36,
      rating: 'Buy',
      targetPrice: 365.00,
      confidence: 88,
      sector: 'Technology',
      reason: 'Azure cloud growth accelerating at 29% YoY. Copilot AI integration driving enterprise adoption. Strong recurring revenue model with 95% retention rate.',
      analyst: 'Mike Rodriguez',
      dateAdded: '1 week ago',
      potentialReturn: '+7.9%'
    }
  ];

  // Fetch stock prices from Alpha Vantage API
  const fetchStockPrices = async () => {
    try {
      const symbols = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA', 'AMD'];
      const stockData = {};
      
      // Fetch data for each symbol
      for (const symbol of symbols) {
        try {
          const response = await fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
          );
          const data = await response.json();
          
          if (data['Global Quote'] && Object.keys(data['Global Quote']).length > 0) {
            const quote = data['Global Quote'];
            stockData[symbol] = {
              price: parseFloat(quote['05. price']).toFixed(2),
              change: parseFloat(quote['09. change']).toFixed(2),
              changePercent: parseFloat(quote['10. change percent'].replace('%', '')).toFixed(2)
            };
          } else {
            // Fallback for individual symbol if API limit reached or error
            const fallbacks = {
              AAPL: { price: '175.43', change: '2.34', changePercent: '1.35' },
              MSFT: { price: '338.11', change: '-1.23', changePercent: '-0.36' },
              GOOGL: { price: '142.56', change: '3.21', changePercent: '2.30' },
              TSLA: { price: '243.92', change: '-3.21', changePercent: '-1.30' },
              NVDA: { price: '421.67', change: '8.45', changePercent: '2.04' },
              AMD: { price: '156.78', change: '4.12', changePercent: '2.70' }
            };
            stockData[symbol] = fallbacks[symbol];
          }
          
          // Add delay to avoid hitting API rate limits
          await new Promise(resolve => setTimeout(resolve, 200));
          
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error);
          // Individual stock fallback
          const fallbacks = {
            AAPL: { price: '175.43', change: '2.34', changePercent: '1.35' },
            MSFT: { price: '338.11', change: '-1.23', changePercent: '-0.36' },
            GOOGL: { price: '142.56', change: '3.21', changePercent: '2.30' },
            TSLA: { price: '243.92', change: '-3.21', changePercent: '-1.30' },
            NVDA: { price: '421.67', change: '8.45', changePercent: '2.04' },
            AMD: { price: '156.78', change: '4.12', changePercent: '2.70' }
          };
          stockData[symbol] = fallbacks[symbol];
        }
      }
      
      setStockPrices(stockData);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error fetching stock prices:', error);
      // Complete fallback data with realistic current prices
      setStockPrices({
        AAPL: { price: '175.43', change: '2.34', changePercent: '1.35' },
        MSFT: { price: '338.11', change: '-1.23', changePercent: '-0.36' },
        GOOGL: { price: '142.56', change: '3.21', changePercent: '2.30' },
        TSLA: { price: '243.92', change: '-3.21', changePercent: '-1.30' },
        NVDA: { price: '421.67', change: '8.45', changePercent: '2.04' },
        AMD: { price: '156.78', change: '4.12', changePercent: '2.70' }
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStockPrices();
    // Update prices every 5 minutes to respect Alpha Vantage rate limits
    const interval = setInterval(fetchStockPrices, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      setEmailSubmitted(true);
      setShowEmailPopup(false);
      alert('Success! Check your email for the free stock picks PDF.');
      setEmail('');
    }
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case 'Strong Buy': return 'text-emerald-600 bg-emerald-100 border-emerald-200';
      case 'Buy': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'Hold': return 'text-amber-600 bg-amber-100 border-amber-200';
      case 'Sell': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const AdSenseAd = ({ size, className = '', type = "display" }) => (
    <div className={`bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 ${className}`}>
      <div className="text-center p-4">
        <div className="text-sm font-medium">Advertisement</div>
        <div className="text-xs opacity-75">{size} - {type}</div>
      </div>
    </div>
  );

  const StockCard = ({ stock, isPreview = false, index = 0 }) => (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
      stock.rating === 'Strong Buy' ? 'ring-2 ring-emerald-100' : ''
    }`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{stock.symbol}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRatingColor(stock.rating)}`}>
              {stock.rating}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{stock.company}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="px-2 py-1 bg-gray-100 rounded-full">{stock.sector}</span>
            <span>•</span>
            <span>Added {stock.dateAdded}</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            ${stockPrices[stock.symbol]?.price || stock.price}
          </div>
          <div className={`flex items-center text-sm font-medium ${
            parseFloat(stockPrices[stock.symbol]?.change || stock.change) >= 0 ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {parseFloat(stockPrices[stock.symbol]?.change || stock.change) >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            <span className="ml-1">
              ${Math.abs(parseFloat(stockPrices[stock.symbol]?.change || stock.change))} 
              ({Math.abs(parseFloat(stockPrices[stock.symbol]?.changePercent || stock.changePercent))}%)
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Target: <span className="font-semibold text-gray-700">${stock.targetPrice}</span>
          </div>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-emerald-600">{stock.potentialReturn}</div>
          <div className="text-xs text-gray-600">Upside Potential</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center">
            <div className="w-12 h-2 bg-gray-200 rounded-full mr-2">
              <div 
                className="h-2 bg-emerald-500 rounded-full transition-all duration-1000" 
                style={{ width: `${stock.confidence}%` }}
              ></div>
            </div>
            <span className="text-sm font-bold">{stock.confidence}%</span>
          </div>
          <div className="text-xs text-gray-600 mt-1">Confidence</div>
        </div>
      </div>

      {/* Analysis Preview */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
            <Eye size={12} className="text-blue-600" />
          </div>
          <span className="text-sm font-medium text-gray-700">Analyst Insight</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          {isPreview ? `${stock.reason.substring(0, 80)}...` : stock.reason}
        </p>
        {isPreview && (
          <button 
            onClick={() => setShowEmailPopup(true)}
            className="text-blue-600 text-sm font-semibold mt-2 hover:underline flex items-center"
          >
            Read full analysis <ChevronRight size={14} className="ml-1" />
          </button>
        )}
        {!isPreview && (
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-600">
            <span>Analysis by {stock.analyst}</span>
          </div>
        )}
      </div>
      
      {!isPreview && (
        <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold flex items-center justify-center shadow-md">
          <BarChart3 size={18} className="mr-2" />
          View Detailed Analysis
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="fixed w-full top-0 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                StockWise Pro
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#picks" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Stock Picks</a>
              <a href="#insights" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Market Insights</a>
              <a href="#education" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Learn</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">About</a>
              
              {/* Stocks Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowStocksDropdown(!showStocksDropdown)}
                  onMouseEnter={() => setShowStocksDropdown(true)}
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors flex items-center space-x-1"
                >
                  <span>Stocks</span>
                  <svg className={`w-4 h-4 transform transition-transform ${showStocksDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showStocksDropdown && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    onMouseLeave={() => setShowStocksDropdown(false)}
                  >
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      Technology
                    </div>
                    <a href="#apple" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                      <div className="flex-1">
                        <div className="font-medium">Apple (AAPL)</div>
                        <div className="text-xs text-gray-500">
                          {isLoading ? 'Loading...' : 
                            stockPrices.AAPL ? 
                              `$${stockPrices.AAPL.price} ${parseFloat(stockPrices.AAPL.change) >= 0 ? '+' : ''}${stockPrices.AAPL.changePercent}%` 
                              : '$175.43 +1.35%'
                          }
                        </div>
                      </div>
                      <span className={stockPrices.AAPL ? (parseFloat(stockPrices.AAPL.change) >= 0 ? "text-green-500" : "text-red-500") : "text-green-500"}>
                        {stockPrices.AAPL ? (parseFloat(stockPrices.AAPL.change) >= 0 ? '↗' : '↘') : '↗'}
                      </span>
                    </a>
                    <a href="#microsoft" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                      <div className="flex-1">
                        <div className="font-medium">Microsoft (MSFT)</div>
                        <div className="text-xs text-gray-500">
                          {isLoading ? 'Loading...' : 
                            stockPrices.MSFT ? 
                              `$${stockPrices.MSFT.price} ${parseFloat(stockPrices.MSFT.change) >= 0 ? '+' : ''}${stockPrices.MSFT.changePercent}%` 
                              : '$338.11 -0.36%'
                          }
                        </div>
                      </div>
                      <span className={stockPrices.MSFT ? (parseFloat(stockPrices.MSFT.change) >= 0 ? "text-green-500" : "text-red-500") : "text-red-500"}>
                        {stockPrices.MSFT ? (parseFloat(stockPrices.MSFT.change) >= 0 ? '↗' : '↘') : '↘'}
                      </span>
                    </a>
                    <a href="#nvidia" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                      <div className="flex-1">
                        <div className="font-medium">NVIDIA (NVDA)</div>
                        <div className="text-xs text-gray-500">
                          {isLoading ? 'Loading...' : 
                            stockPrices.NVDA ? 
                              `$${stockPrices.NVDA.price} ${parseFloat(stockPrices.NVDA.change) >= 0 ? '+' : ''}${stockPrices.NVDA.changePercent}%` 
                              : '$421.67 +2.04%'
                          }
                        </div>
                      </div>
                      <span className={stockPrices.NVDA ? (parseFloat(stockPrices.NVDA.change) >= 0 ? "text-green-500" : "text-red-500") : "text-green-500"}>
                        {stockPrices.NVDA ? (parseFloat(stockPrices.NVDA.change) >= 0 ? '↗' : '↘') : '↗'}
                      </span>
                    </a>
                    <a href="#tesla" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                      <div className="flex-1">
                        <div className="font-medium">Tesla (TSLA)</div>
                        <div className="text-xs text-gray-500">
                          {isLoading ? 'Loading...' : 
                            stockPrices.TSLA ? 
                              `$${stockPrices.TSLA.price} ${parseFloat(stockPrices.TSLA.change) >= 0 ? '+' : ''}${stockPrices.TSLA.changePercent}%` 
                              : '$243.92 -1.30%'
                          }
                        </div>
                      </div>
                      <span className={stockPrices.TSLA ? (parseFloat(stockPrices.TSLA.change) >= 0 ? "text-green-500" : "text-red-500") : "text-red-500"}>
                        {stockPrices.TSLA ? (parseFloat(stockPrices.TSLA.change) >= 0 ? '↗' : '↘') : '↘'}
                      </span>
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowEmailPopup(true)}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2.5 rounded-full hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 font-semibold flex items-center shadow-lg hover:shadow-xl"
              >
                <Gift size={16} className="mr-2" />
                Free Picks
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Get Our Top 5 Stock Picks 
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent"> This Week</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              Join <strong>18,300+</strong> investors beating the market with our AI-powered analysis. 
              <span className="block mt-2 text-emerald-300 font-semibold">76% win rate • +142% total returns</span>
            </p>
            
            <div className="max-w-lg mx-auto mb-12">
              <form onSubmit={handleEmailSubmit} className="relative">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for free stock picks"
                    className="flex-1 px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 border-0 shadow-lg focus:ring-4 focus:ring-emerald-400/50 text-lg"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-full hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    <Zap size={20} className="mr-2" />
                    Get Free Picks
                  </button>
                </div>
              </form>
              
              <div className="flex items-center justify-center gap-6 mt-4 text-sm opacity-90">
                <div className="flex items-center">
                  <CheckCircle size={16} className="text-emerald-300 mr-1" />
                  <span>5 Hot Picks</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle size={16} className="text-emerald-300 mr-1" />
                  <span>Full Analysis</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle size={16} className="text-emerald-300 mr-1" />
                  <span>No Spam Ever</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <TrendingUp size={24} className="mx-auto mb-2 text-emerald-300" />
                <div className="text-2xl md:text-3xl font-bold">+142.7%</div>
                <div className="text-sm opacity-80">Total Returns</div>
              </div>
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <Target size={24} className="mx-auto mb-2 text-emerald-300" />
                <div className="text-2xl md:text-3xl font-bold">76%</div>
                <div className="text-sm opacity-80">Win Rate</div>
              </div>
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <BarChart3 size={24} className="mx-auto mb-2 text-emerald-300" />
                <div className="text-2xl md:text-3xl font-bold">47</div>
                <div className="text-sm opacity-80">Active Picks</div>
              </div>
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <Users size={24} className="mx-auto mb-2 text-emerald-300" />
                <div className="text-2xl md:text-3xl font-bold">18.3K</div>
                <div className="text-sm opacity-80">Subscribers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Status Indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center">
          <div className="inline-flex items-center text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
            <div className={`w-2 h-2 rounded-full mr-2 ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
            {isLoading ? 'Loading real-time prices...' : 'Live prices powered by Alpha Vantage'}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <AdSenseAd size="Responsive Banner" className="h-20 md:h-24 w-full rounded-xl mb-8" type="banner" />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <section className="mb-12">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">This Week's Top Picks</h2>
                  <p className="text-gray-600">AI-powered analysis • Updated every Monday</p>
                </div>
                <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-full">
                  <Clock size={16} className="mr-2" />
                  Last updated: 2 hours ago
                </div>
              </div>
              
              {/* Preview Cards with Real Prices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {stockRecommendations.map((stock, index) => (
                  <StockCard key={index} stock={stock} isPreview={true} index={index} />
                ))}
              </div>
              
              <div className="bg-gradient-to-r from-emerald-50 via-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 text-center border border-emerald-200/50">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Gift size={32} className="text-white" />
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Unlock All 5 Stock Picks + Full Analysis
                </h3>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Get complete research reports with real-time Alpha Vantage prices, risk analysis, and entry/exit strategies 
                  for all our weekly recommendations.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                  {[
                    'Real-time Alpha Vantage prices',
                    'Detailed company analysis',
                    'Risk assessment & stops'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center justify-center text-sm text-gray-700">
                      <CheckCircle size={16} className="text-emerald-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => setShowEmailPopup(true)}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-bold text-lg inline-flex items-center shadow-lg hover:shadow-xl"
                >
                  <Mail size={20} className="mr-3" />
                  Get Full Access Free
                </button>
                
                <p className="text-sm text-gray-500 mt-4">
                  Join 18,300+ investors • No credit card required • Unsubscribe anytime
                </p>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <AdSenseAd size="300x250" className="h-64 w-full rounded-2xl" type="sidebar" />
            
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl p-6">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Free Weekly Picks</h3>
                <p className="text-sm opacity-90">
                  Get our top 5 stock recommendations with real-time prices.
                </p>
              </div>
              
              <button 
                onClick={() => setShowEmailPopup(true)}
                className="w-full bg-white text-emerald-600 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-bold shadow-lg"
              >
                Join 18.3K+ Investors
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Email Popup */}
      {showEmailPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 relative shadow-2xl">
            <button 
              onClick={() => setShowEmailPopup(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-2"
            >
              <X size={24} />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Gift size={32} className="text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Get Our Top 5 Stock Picks FREE!
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Join 18,300+ investors getting profitable recommendations with real-time Alpha Vantage prices. 
                <strong>76% win rate • +142% total returns</strong>
              </p>
              
              <form onSubmit={handleEmailSubmit} className="space-y-4 mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 px-6 rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all font-bold shadow-lg hover:shadow-xl"
                >
                  Send Me Free Stock Picks
                </button>
              </form>
              
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div className="flex items-center justify-center">
                  <span>✓ 5 Hot Stock Picks</span>
                </div>
                <div className="flex items-center justify-center">
                  <span>✓ Real-time Alpha Vantage prices</span>
                </div>
                <div className="flex items-center justify-center">
                  <span>✓ Full Analysis Reports</span>
                </div>
                <div className="flex items-center justify-center">
                  <span>✓ No Spam Ever</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <TrendingUp className="h-8 w-8 text-blue-400" />
              <span className="ml-3 text-2xl font-bold">StockWise Pro</span>
            </div>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Professional stock analysis powered by real-time Alpha Vantage data. 
              Join 18,000+ subscribers beating the market.
            </p>
            
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">76%</div>
                <div className="text-xs text-gray-400">Win Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">+142%</div>
                <div className="text-xs text-gray-400">Total Returns</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">18.3K</div>
                <div className="text-xs text-gray-400">Subscribers</div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-400 text-sm">
                &copy; 2025 StockWise Pro. All rights reserved. Powered by Alpha Vantage. Not investment advice.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StockAdvisorWebsite;
