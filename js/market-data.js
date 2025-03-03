/**
 * Market Data Module
 * 
 * This module provides static market data and functions to access and format it.
 * In a real implementation, this would fetch data from APIs, but for this demo
 * we're using static data based on the Birdeye website content.
 */

const marketData = {
    // Static data from the provided HTML content
    trendingTokens: [
        {
            chain: 'solana',
            icon: 'https://arweave.net/VQrPjACwnQRmxdKBTqNwPiyo65x7LAT773t8Kd7YBzw',
            name: 'TRUMP',
            symbol: 'TRUMP',
            contractAddress: '6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN',
            price: 14.903,
            change24h: 13.78,
            marketCap: 149030000,
            volume24h: 25000000
        },
        {
            chain: 'solana',
            icon: 'https://static.jup.ag/jup/icon.png',
            name: 'Jupiter',
            symbol: 'JUP',
            contractAddress: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
            price: 0.8135,
            change24h: 9.8,
            marketCap: 813500000,
            volume24h: 120000000
        },
        {
            chain: 'solana',
            icon: 'https://bafkreibk3covs5ltyqxa272uodhculbr6kea6betidfwy3ajsav2vjzyum.ipfs.nftstorage.link',
            name: 'Dogwifhat',
            symbol: 'WIF',
            contractAddress: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
            price: 0.7045,
            change24h: 17.28,
            marketCap: 704500000,
            volume24h: 95000000
        },
        {
            chain: 'solana',
            icon: 'https://popcatsol.com/img/logo.png',
            name: 'POPCAT',
            symbol: 'POPCAT',
            contractAddress: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr',
            price: 0.2489,
            change24h: -0.62,
            marketCap: 248900000,
            volume24h: 35000000
        },
        {
            chain: 'solana',
            icon: 'https://ipfs.io/ipfs/QmPDJuEobBcLZihjFCvkWA8c1FiW7UzM2ctFdiffSLxf1d',
            name: 'Arc Protocol',
            symbol: 'arc',
            contractAddress: '61V8vBaqAGMpgDQi4JcAwo1dmBGHsyhzodcPqnEVpump',
            price: 0.2174,
            change24h: 7.7,
            marketCap: 217400000,
            volume24h: 28000000
        },
        {
            chain: 'solana',
            icon: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I',
            name: 'Bonk',
            symbol: 'BONK',
            contractAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
            price: 0.000001443,
            change24h: 7.98,
            marketCap: 144300000,
            volume24h: 18000000
        },
        {
            chain: 'solana',
            icon: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh/logo.png',
            name: 'Wrapped Bitcoin',
            symbol: 'WBTC',
            contractAddress: '3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh',
            price: 88687.08,
            change24h: 4.64,
            marketCap: 1720000000000,
            volume24h: 45000000000
        },
        {
            chain: 'solana',
            icon: 'https://ipfs.io/ipfs/QmcNTVAoyJ7zDbPnN9jwiMoB8uCoJBUP9RGmmiGGHv44yX',
            name: 'AI16Z',
            symbol: 'ai16z',
            contractAddress: 'HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC',
            price: 0.3637,
            change24h: -3.6,
            marketCap: 363700000,
            volume24h: 42000000
        },
        {
            chain: 'solana',
            icon: 'https://ipfs.io/ipfs/QmSjmKW7is3qdpbev4TUyiquJWXahKekyzrSGq4fsxWdoi',
            name: 'Collateral',
            symbol: 'COLLAT',
            contractAddress: 'C7heQqfNzdMbUFQwcHkL9FvdwsFsDRBnfwZDDyWYCLTZ',
            price: 0.034648,
            change24h: 8.52,
            marketCap: 34648000,
            volume24h: 5200000
        },
        {
            chain: 'solana',
            icon: 'https://ipfs.io/ipfs/QmYqwkPV1p4DraqN5TfLZVhyrAusSkHfvFDZMJAWALZJxj',
            name: 'Alchemy',
            symbol: 'ALCH',
            contractAddress: 'HNg5PYJmtqcmzXrv6S9zP1CDKk5BgDuyFBxbvNApump',
            price: 0.042905,
            change24h: 15.57,
            marketCap: 42905000,
            volume24h: 7800000
        }
    ],
    
    profitableTraders: [
        {
            chain: 'solana',
            address: 'GFHMc9BegxJXLdHJrABxNVoPRdnmVxXiNeoUCEpgXVHw',
            shortAddress: 'GFHMc9Begx',
            pnl7d: 52000000,
            volume24h: 80000000
        },
        {
            chain: 'solana',
            address: '9kf7oyNPHZB7TWcZZRewFMFwGNDKSEZKSSumMdaRYiuv',
            shortAddress: '9kf7oyNPHZ',
            pnl7d: 18110000,
            volume24h: 17450000
        },
        {
            chain: 'ethereum',
            address: '0x94dF59f3bb1d6CD275201a709dF9D6c936E29691',
            shortAddress: 'redbase.eth',
            pnl7d: 9210000,
            volume24h: 121310000
        },
        {
            chain: 'bsc',
            address: '0xabA270D27707Cb93Dd6d3Aac0c5C2c6F58348b1C',
            shortAddress: '0xabA270D2',
            pnl7d: 8450000,
            volume24h: 8460000
        },
        {
            chain: 'solana',
            address: '9a56eNL975mDrdewFSs5baZ7dagFUauutfa1uGsnGKfB',
            shortAddress: '9a56eNL975',
            pnl7d: 8130000,
            volume24h: 77110000
        },
        {
            chain: 'solana',
            address: 'AzDByJsGm9gAVQPX8v8WS3iAs3PPdTwZZDDUNP2u5nVj',
            shortAddress: 'AzDByJsGm9',
            pnl7d: 7300000,
            volume24h: 571670000
        },
        {
            chain: 'solana',
            address: 'B88xH3Jmhq4WEaiRno2mYmsxV35MmgSY45ZmQnbL8yft',
            shortAddress: 'B88xH3Jmhq',
            pnl7d: 5770000,
            volume24h: 14090000
        },
        {
            chain: 'ethereum',
            address: '0x00806DaA2Cfe49715eA05243FF259DeB195760fC',
            shortAddress: '0x00806DaA',
            pnl7d: 5170000,
            volume24h: 92960000
        },
        {
            chain: 'solana',
            address: 'BBFNTK6nqQA4no3vnvoCJ1bU9CH1HhZdivXb8H6r5vSN',
            shortAddress: 'BBFNTK6nqQ',
            pnl7d: 5140000,
            volume24h: 5650000
        },
        {
            chain: 'ethereum',
            address: '0xE1c003de718C3548114C5412995A234788F3Fc5F',
            shortAddress: '0xE1c003de',
            pnl7d: 5090000,
            volume24h: 10150000
        }
    ],
    
    largeTrades: [
        {
            chain: 'sui',
            value: 15790,
            sellToken: 'USDC',
            sellAmount: 15700,
            buyToken: 'SUI',
            buyAmount: 5100,
            trader: '0x2ab169ee',
            time: '6m ago'
        },
        {
            chain: 'sui',
            value: 35920,
            sellToken: 'AUSD',
            sellAmount: 35870,
            buyToken: 'USDC',
            buyAmount: 35920,
            trader: '0xfd8e97e7',
            time: '6m ago'
        },
        {
            chain: 'sui',
            value: 35920,
            sellToken: 'USDC',
            sellAmount: 35920,
            buyToken: 'SUI',
            buyAmount: 11670,
            trader: '0xfd8e97e7',
            time: '6m ago'
        },
        {
            chain: 'sui',
            value: 28280,
            sellToken: 'USDC',
            sellAmount: 28310,
            buyToken: 'USDT',
            buyAmount: 28320,
            trader: '0x68c89ab5',
            time: '6m ago'
        },
        {
            chain: 'sui',
            value: 14680,
            sellToken: 'USDC',
            sellAmount: 14740,
            buyToken: 'SUI',
            buyAmount: 4800,
            trader: '0xf530d6d4',
            time: '7m ago'
        },
        {
            chain: 'sui',
            value: 10140,
            sellToken: 'USDC',
            sellAmount: 10150,
            buyToken: 'SUI',
            buyAmount: 3310,
            trader: '0xa93b3943',
            time: '7m ago'
        },
        {
            chain: 'sui',
            value: 12290,
            sellToken: 'USDC',
            sellAmount: 12310,
            buyToken: 'SUI',
            buyAmount: 4020,
            trader: '0xf65ace09',
            time: '7m ago'
        },
        {
            chain: 'sui',
            value: 25970,
            sellToken: 'USDC',
            sellAmount: 25970,
            buyToken: 'SUI',
            buyAmount: 8480,
            trader: '0xa79a13b4',
            time: '7m ago'
        },
        {
            chain: 'sui',
            value: 19970,
            sellToken: 'USDC',
            sellAmount: 20000,
            buyToken: 'SUI',
            buyAmount: 6540,
            trader: '0xd921077a',
            time: '7m ago'
        },
        {
            chain: 'sui',
            value: 36700,
            sellToken: 'USDC',
            sellAmount: 36750,
            buyToken: 'SUI',
            buyAmount: 12010,
            trader: '0x1e9b7dc9',
            time: '7m ago'
        }
    ],
    
    topVolume: [
        {
            chain: 'solana',
            icon: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
            name: 'Wrapped SOL',
            symbol: 'SOL',
            contractAddress: 'So11111111111111111111111111111111111111112',
            price: 168.81,
            change24h: 20.12,
            volume24h: 3590000000,
            volumeChange: 18.36
        },
        {
            chain: 'solana',
            icon: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
            name: 'USD Coin',
            symbol: 'USDC',
            contractAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
            price: 0.9999,
            change24h: 0,
            volume24h: 2240000000,
            volumeChange: 33.28
        },
        {
            chain: 'ethereum',
            icon: 'https://assets.coingecko.com/coins/images/2518/small/weth.png?1628852295',
            name: 'WETH',
            symbol: 'WETH',
            contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            price: 2266.18,
            change24h: 3.99,
            volume24h: 822720000,
            volumeChange: 3.95
        },
        {
            chain: 'base',
            icon: 'https://assets.coingecko.com/coins/images/2518/small/weth.png?1628852295',
            name: 'WETH',
            symbol: 'WETH',
            contractAddress: '0x4200000000000000000000000000000000000006',
            price: 2253.00,
            change24h: 3.63,
            volume24h: 757330000,
            volumeChange: 26.82
        },
        {
            chain: 'arbitrum',
            icon: 'https://assets.coingecko.com/coins/images/2518/small/weth.png?1628852295',
            name: 'Wrapped Ether',
            symbol: 'WETH',
            contractAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
            price: 2266.82,
            change24h: 3.96,
            volume24h: 697990000,
            volumeChange: 8.01
        },
        {
            chain: 'bsc',
            icon: 'https://assets.coingecko.com/coins/images/12591/small/binance-coin-logo.png?1600947313',
            name: 'Wrapped BNB',
            symbol: 'WBNB',
            contractAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            price: 621.15,
            change24h: 2.74,
            volume24h: 620310000,
            volumeChange: -21.36
        },
        {
            chain: 'arbitrum',
            icon: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389',
            name: 'USD Coin',
            symbol: 'USDC',
            contractAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
            price: 1.000,
            change24h: -0.08,
            volume24h: 608930000,
            volumeChange: 4.83
        },
        {
            chain: 'base',
            icon: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389',
            name: 'USD Coin',
            symbol: 'USDC',
            contractAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
            price: 1.000,
            change24h: 0.03,
            volume24h: 512150000,
            volumeChange: 22.99
        },
        {
            chain: 'ethereum',
            icon: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389',
            name: 'USD Coin',
            symbol: 'USDC',
            contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            price: 1.000,
            change24h: 0,
            volume24h: 453920000,
            volumeChange: 8.45
        },
        {
            chain: 'solana',
            icon: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg',
            name: 'USDT',
            symbol: 'USDT',
            contractAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
            price: 0.9998,
            change24h: 0.04,
            volume24h: 451620000,
            volumeChange: 27.41
        }
    ],
    
    // Chain data for the chain selector
    chains: [
        { id: 'all', name: 'All Chains', icon: 'https://www.birdeye.so/images/global-icon.svg' },
        { id: 'solana', name: 'Solana', icon: 'https://raw.githubusercontent.com/birdeye-so/birdeye-ads/main/network/solana.png' },
        { id: 'sui', name: 'Sui', icon: 'https://raw.githubusercontent.com/birdeye-so/birdeye-ads/main/network/sui.png' },
        { id: 'ethereum', name: 'Ethereum', icon: 'https://raw.githubusercontent.com/birdeye-so/birdeye-ads/main/network/ethereum.png' },
        { id: 'bsc', name: 'BNB Chain', icon: 'https://raw.githubusercontent.com/birdeye-so/birdeye-ads/main/network/bsc.png' },
        { id: 'arbitrum', name: 'Arbitrum', icon: 'https://raw.githubusercontent.com/birdeye-so/birdeye-ads/main/network/arbitrum.png' },
        { id: 'avalanche', name: 'Avalanche', icon: 'https://raw.githubusercontent.com/birdeye-so/birdeye-ads/main/network/avalanche.png' },
        { id: 'base', name: 'Base', icon: 'https://raw.githubusercontent.com/birdeye-so/birdeye-ads/main/network/base.jpeg' },
        { id: 'optimism', name: 'Optimism', icon: 'https://raw.githubusercontent.com/birdeye-so/birdeye-ads/main/network/optimism.png' },
        { id: 'polygon', name: 'Polygon', icon: 'https://raw.githubusercontent.com/birdeye-so/birdeye-ads/main/network/polygon.png' },
        { id: 'zksync', name: 'zkSync Era', icon: 'https://raw.githubusercontent.com/birdeye-so/birdeye-ads/main/network/zksync.jpeg' }
    ],
    
    // Bubble map data
    bubbleMap: {
        timeframe: '24H',
        data: [
            { symbol: 'BTC', change: 4.57 },
            { symbol: 'ETH', change: 3.57 },
            { symbol: 'BNB', change: 3.6 },
            { symbol: 'SOL', change: 20.09 },
            { symbol: 'ADA', change: 52.86 },
            { symbol: 'DOGE', change: 10.81 },
            { symbol: 'STETH', change: 3.05 },
            { symbol: 'WBTC', change: 4.45 },
            { symbol: 'LINK', change: 8.02 },
            { symbol: 'SUI', change: 9.66 },
            { symbol: 'LEO', change: 4.33 },
            { symbol: 'TON', change: 4.88 },
            { symbol: 'SHIB', change: 5.55 },
            { symbol: 'OM', change: 6.99 },
            { symbol: 'BGB', change: 6.48 },
            { symbol: 'WEETH', change: 2.1 },
            { symbol: 'UNI', change: 5.1 },
            { symbol: 'WBT', change: 2.19 },
            { symbol: 'NEAR', change: 6.65 },
            { symbol: 'ONDO', change: 7.35 },
            { symbol: 'PEPE', change: 6.27 },
            { symbol: 'AAVE', change: 7.93 },
            { symbol: 'TRUMP', change: 13.53 },
            { symbol: 'OKB', change: 0.5 },
            { symbol: 'MNT', change: 1.66 },
            { symbol: 'TKX', change: 5.53 },
            { symbol: 'JUP', change: 9.66 },
            { symbol: 'RENDER', change: 8.52 },
            { symbol: 'CRO', change: 3.64 },
            { symbol: 'ATOM', change: 3.14 }
        ]
    },
    
    // Methods for accessing and filtering data
    getTokensByChain: function(chain) {
        if (chain === 'all') return this.trendingTokens;
        return this.trendingTokens.filter(token => token.chain === chain);
    },
    
    getTradersByChain: function(chain) {
        if (chain === 'all') return this.profitableTraders;
        return this.profitableTraders.filter(trader => trader.chain === chain);
    },
    
    getTradesByChain: function(chain) {
        if (chain === 'all') return this.largeTrades;
        return this.largeTrades.filter(trade => trade.chain === chain);
    },
    
    getTopVolumeByChain: function(chain) {
        if (chain === 'all') return this.topVolume;
        return this.topVolume.filter(token => token.chain === chain);
    },
    
    // Method to get market data for a specific token by contract address
    getTokenData: function(contractAddress) {
        // First try to fetch data from pump.fun
        const pumpFunData = this.fetchPumpFunData(contractAddress);
        if (pumpFunData) return pumpFunData;
        
        // If pump.fun data fetch fails, check trending tokens
        let token = this.trendingTokens.find(t => t.contractAddress === contractAddress);
        if (token) return token;
        
        // Then check top volume tokens
        token = this.topVolume.find(t => t.contractAddress === contractAddress);
        if (token) return token;
        
        // If not found, return mock data based on contract address
        return this.generateMockData(contractAddress);
    },
    
    // Fetch data from pump.fun
    fetchPumpFunData: function(contractAddress) {
        try {
            // Make a synchronous XMLHttpRequest to pump.fun
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `https://api.pump.fun/token/${contractAddress}`, false); // false makes it synchronous
            xhr.send();
            
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                
                // Extract relevant data from the response
                return {
                    chain: 'solana',
                    contractAddress: contractAddress,
                    name: data.name || `Token ${contractAddress.substring(0, 6)}`,
                    symbol: data.symbol || contractAddress.substring(0, 4).toUpperCase(),
                    price: data.price || 0,
                    change24h: data.priceChange24h || 0,
                    marketCap: data.marketCap || 0,
                    volume24h: data.volume24h || 0,
                    source: 'pump.fun'
                };
            }
        } catch (error) {
            console.error('Error fetching data from pump.fun:', error);
        }
        
        // Return null if fetch fails
        return null;
    },
    
    // Generate mock data for tokens not in our static dataset
    generateMockData: function(contractAddress) {
        // Use the contract address as a seed for pseudo-random but consistent values
        const seed = this.hashString(contractAddress);
        
        // Generate price between $0.0001 and $1000
        const price = 0.0001 * (1 + (seed % 10000000));
        
        // Generate market cap between $10,000 and $10,000,000
        const marketCap = 10000 + (seed % 10000000);
        
        // Generate volume as a percentage of market cap (1% to 20%)
        const volumePercent = 1 + (seed % 20);
        const volume = marketCap * (volumePercent / 100);
        
        // Generate 24h change between -10% and +30%
        const change24h = -10 + (seed % 40);
        
        return {
            chain: 'solana', // Default to Solana
            contractAddress: contractAddress,
            name: `Token ${contractAddress.substring(0, 6)}`,
            symbol: contractAddress.substring(0, 4).toUpperCase(),
            price: price,
            change24h: change24h,
            marketCap: marketCap,
            volume24h: volume,
            source: 'Mock Data'
        };
    },
    
    // Simple string hashing function to generate a numeric seed
    hashString: function(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    },
    
    // Format currency values
    formatCurrency: function(value) {
        if (value >= 1000000000) {
            return '$' + (value / 1000000000).toFixed(2) + 'B';
        } else if (value >= 1000000) {
            return '$' + (value / 1000000).toFixed(2) + 'M';
        } else if (value >= 1000) {
            return '$' + (value / 1000).toFixed(2) + 'K';
        } else {
            return '$' + value.toFixed(2);
        }
    },
    
    // Format price values with appropriate decimal places
    formatPrice: function(price) {
        if (price === null || price === undefined) return '$0.00';
        
        // Show more decimal places for small values
        if (price < 0.0001) {
            return '$' + price.toExponential(2);
        } else if (price < 0.01) {
            return '$' + price.toFixed(6);
        } else if (price < 1) {
            return '$' + price.toFixed(4);
        } else if (price < 1000) {
            return '$' + price.toFixed(2);
        } else {
            return '$' + price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
    },
    
    // Format percentage changes
    formatPercentage: function(value) {
        const sign = value >= 0 ? '+' : '';
        return sign + value.toFixed(2) + '%';
    }
};
