/**
 * Market Widgets JavaScript
 * 
 * This file provides reusable market data widgets that can be
 * embedded in other pages like the NFT gallery.
 */

const marketWidgets = {
    // Create a mini trending tokens widget
    createTrendingTokensWidget: function(container, limit = 5) {
        container.innerHTML = `
            <div class="market-widget trending-tokens-widget">
                <div class="widget-header">
                    <h3>Trending Tokens</h3>
                    <a href="market-dashboard.html" class="view-more">View more</a>
                </div>
                <div class="widget-content">
                    <table class="trending-tokens-table">
                        <thead>
                            <tr>
                                <th>Token</th>
                                <th>Price</th>
                                <th>24h Chg</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Will be populated by JavaScript -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        const tbody = container.querySelector('.trending-tokens-table tbody');
        
        // Get top trending tokens
        const tokens = marketData.trendingTokens.slice(0, limit);
        
        tokens.forEach(token => {
            const row = document.createElement('tr');
            
            const changeClass = token.change24h >= 0 ? 'positive-change' : 'negative-change';
            
            row.innerHTML = `
                <td class="token-cell">
                    <img src="${marketData.chains.find(c => c.id === token.chain).icon}" alt="${token.chain}" class="chain-icon">
                    <img src="${token.icon}" alt="${token.name}" class="token-icon">
                    <span>${token.symbol}</span>
                </td>
                <td>${marketData.formatPrice(token.price)}</td>
                <td class="${changeClass}">${marketData.formatPercentage(token.change24h)}</td>
            `;
            
            tbody.appendChild(row);
        });
    },
    
    // Create a token market data widget for a specific token
    createTokenDataWidget: function(container, contractAddress) {
        const token = marketData.getTokenData(contractAddress);
        
        if (!token) {
            container.innerHTML = `<div class="market-widget token-data-widget">No market data available</div>`;
            return;
        }
        
        const changeClass = token.change24h >= 0 ? 'positive-change' : 'negative-change';
        
        container.innerHTML = `
            <div class="market-widget token-data-widget">
                <div class="widget-header">
                    <h3>Market Data</h3>
                    <a href="market-dashboard.html" class="view-more">View more</a>
                </div>
                <div class="widget-content">
                    <div class="token-info">
                        <div class="token-icon">
                            <img src="${token.icon || 'assets/images/placeholder-token.png'}" alt="${token.name}">
                        </div>
                        <div class="token-details">
                            <div class="token-name">${token.name} (${token.symbol})</div>
                            <div class="token-chain">
                                <img src="${marketData.chains.find(c => c.id === token.chain).icon}" alt="${token.chain}" class="chain-icon">
                                <span>${marketData.chains.find(c => c.id === token.chain).name}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="token-metrics">
                        <div class="metric">
                            <div class="metric-label">Price</div>
                            <div class="metric-value">${marketData.formatPrice(token.price)}</div>
                            <div class="metric-change ${changeClass}">${marketData.formatPercentage(token.change24h)}</div>
                        </div>
                        <div class="metric">
                            <div class="metric-label">Market Cap</div>
                            <div class="metric-value">${marketData.formatCurrency(token.marketCap)}</div>
                        </div>
                        <div class="metric">
                            <div class="metric-label">24h Volume</div>
                            <div class="metric-value">${marketData.formatCurrency(token.volume24h)}</div>
                        </div>
                        <div class="metric">
                            <div class="metric-label">Contract</div>
                            <div class="metric-value" style="font-size: 0.8rem; word-break: break-all;">${token.contractAddress}</div>
                        </div>
                    </div>
                    
                    ${token.source ? `<div class="data-source">Source: ${token.source}</div>` : ''}
                </div>
            </div>
        `;
    },
    
    // Add market data to the NFT modal
    addMarketDataToModal: function(container, contractAddress) {
        if (!contractAddress) {
            return;
        }
        
        const token = marketData.getTokenData(contractAddress);
        
        if (!token) {
            return;
        }
        
        const changeClass = token.change24h >= 0 ? 'positive-change' : 'negative-change';
        
        const marketDataSection = document.createElement('div');
        marketDataSection.className = 'market-data-section';
        marketDataSection.innerHTML = `
            <h3>Market Data</h3>
            <div class="market-data-grid">
                <div class="market-data-item">
                    <div class="market-data-label">Price</div>
                    <div class="market-data-value">${marketData.formatPrice(token.price)}</div>
                </div>
                <div class="market-data-item">
                    <div class="market-data-label">24h Change</div>
                    <div class="market-data-value ${changeClass}">${marketData.formatPercentage(token.change24h)}</div>
                </div>
                <div class="market-data-item">
                    <div class="market-data-label">Market Cap</div>
                    <div class="market-data-value">${marketData.formatCurrency(token.marketCap)}</div>
                </div>
                <div class="market-data-item">
                    <div class="market-data-label">24h Volume</div>
                    <div class="market-data-value">${marketData.formatCurrency(token.volume24h)}</div>
                </div>
            </div>
            <div class="data-source">
                Source: ${token.source || 'Birdeye'} | <a href="market-dashboard.html">View Market Dashboard</a>
            </div>
        `;
        
        container.appendChild(marketDataSection);
    }
};
