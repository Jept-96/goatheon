/**
 * Market Dashboard JavaScript
 * 
 * This file handles the functionality of the market dashboard page.
 */

document.addEventListener('DOMContentLoaded', function() {
    const marketDashboard = {
        currentChain: 'all',
        
        init: function() {
            this.renderChainSelector();
            this.renderTrendingTokens();
            this.renderProfitableTraders();
            this.renderBubbleMap();
            this.renderTopVolume();
            this.renderLargeTrades();
            this.setupEventListeners();
            this.updateLastUpdated();
        },
        
        renderChainSelector: function() {
            const container = document.getElementById('chain-selector');
            container.innerHTML = '';
            
            marketData.chains.forEach(chain => {
                const chainElement = document.createElement('div');
                chainElement.className = `chain-option ${chain.id === this.currentChain ? 'active' : ''}`;
                chainElement.dataset.chain = chain.id;
                
                chainElement.innerHTML = `
                    <img src="${chain.icon}" alt="${chain.name}">
                    <span>${chain.name}</span>
                `;
                
                container.appendChild(chainElement);
            });
        },
        
        renderTrendingTokens: function() {
            const tbody = document.querySelector('#trending-tokens-table tbody');
            tbody.innerHTML = '';
            
            const tokens = marketData.getTokensByChain(this.currentChain).slice(0, 10);
            
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
        
        renderProfitableTraders: function() {
            const tbody = document.querySelector('#profitable-traders-table tbody');
            tbody.innerHTML = '';
            
            const traders = marketData.getTradersByChain(this.currentChain).slice(0, 10);
            
            traders.forEach(trader => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td class="trader-cell">
                        <img src="${marketData.chains.find(c => c.id === trader.chain).icon}" alt="${trader.chain}" class="chain-icon">
                        <span>${trader.shortAddress}</span>
                    </td>
                    <td class="positive-change">+${marketData.formatCurrency(trader.pnl7d)}</td>
                    <td>${marketData.formatCurrency(trader.volume24h)}</td>
                `;
                
                tbody.appendChild(row);
            });
        },
        
        renderBubbleMap: function() {
            const container = document.getElementById('bubble-map');
            container.innerHTML = '';
            
            const bubbleData = marketData.bubbleMap.data;
            
            bubbleData.forEach(item => {
                const bubble = document.createElement('div');
                bubble.className = `bubble ${item.change >= 0 ? 'positive' : 'negative'}`;
                
                // Size based on absolute change percentage (larger change = larger bubble)
                const size = 30 + Math.min(Math.abs(item.change) * 2, 70);
                bubble.style.width = `${size}px`;
                bubble.style.height = `${size}px`;
                
                bubble.innerHTML = `
                    <span class="symbol">${item.symbol}</span>
                    <span class="change">${marketData.formatPercentage(item.change)}</span>
                `;
                
                container.appendChild(bubble);
            });
        },
        
        renderTopVolume: function() {
            const tbody = document.querySelector('#top-volume-table tbody');
            tbody.innerHTML = '';
            
            const tokens = marketData.getTopVolumeByChain(this.currentChain).slice(0, 10);
            
            tokens.forEach(token => {
                const row = document.createElement('tr');
                
                const priceChangeClass = token.change24h >= 0 ? 'positive-change' : 'negative-change';
                
                row.innerHTML = `
                    <td class="token-cell">
                        <img src="${marketData.chains.find(c => c.id === token.chain).icon}" alt="${token.chain}" class="chain-icon">
                        <img src="${token.icon}" alt="${token.name}" class="token-icon">
                        <span>${token.symbol}</span>
                    </td>
                    <td>${marketData.formatPrice(token.price)}</td>
                    <td class="${priceChangeClass}">${marketData.formatPercentage(token.change24h)}</td>
                    <td>${marketData.formatCurrency(token.volume24h)}</td>
                `;
                
                tbody.appendChild(row);
            });
        },
        
        renderLargeTrades: function() {
            const tbody = document.querySelector('#large-trades-table tbody');
            tbody.innerHTML = '';
            
            const trades = marketData.getTradesByChain(this.currentChain).slice(0, 10);
            
            trades.forEach(trade => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>
                        <img src="${marketData.chains.find(c => c.id === trade.chain).icon}" alt="${trade.chain}" class="chain-icon">
                    </td>
                    <td>${marketData.formatCurrency(trade.value)}</td>
                    <td class="trade-amount">
                        <div class="sell-amount">-${trade.sellAmount.toLocaleString()}<br>${trade.sellToken}</div>
                        <div class="buy-amount">+${trade.buyAmount.toLocaleString()}<br>${trade.buyToken}</div>
                    </td>
                    <td class="trader-address">${trade.trader}</td>
                    <td>${trade.time}</td>
                `;
                
                tbody.appendChild(row);
            });
        },
        
        setupEventListeners: function() {
            // Chain selector
            document.querySelectorAll('#chain-selector .chain-option').forEach(option => {
                option.addEventListener('click', () => {
                    this.currentChain = option.dataset.chain;
                    
                    // Update active class
                    document.querySelectorAll('#chain-selector .chain-option').forEach(opt => {
                        opt.classList.toggle('active', opt.dataset.chain === this.currentChain);
                    });
                    
                    // Re-render all sections
                    this.renderTrendingTokens();
                    this.renderProfitableTraders();
                    this.renderTopVolume();
                    this.renderLargeTrades();
                });
            });
            
            // Timeframe selector for bubble map
            document.querySelectorAll('.timeframe-selector button').forEach(button => {
                button.addEventListener('click', () => {
                    // Update active class
                    document.querySelectorAll('.timeframe-selector button').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    button.classList.add('active');
                    
                    // In a real implementation, this would fetch data for the selected timeframe
                    // For now, we'll just update the displayed timeframe
                    marketData.bubbleMap.timeframe = button.dataset.timeframe;
                    
                    // Re-render bubble map
                    this.renderBubbleMap();
                });
            });
            
            // Trade size selector
            document.querySelectorAll('.trade-size-selector button').forEach(button => {
                button.addEventListener('click', () => {
                    // Update active class
                    document.querySelectorAll('.trade-size-selector button').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    button.classList.add('active');
                    
                    // In a real implementation, this would filter trades by size
                    // For now, we'll just re-render with the same data
                    this.renderLargeTrades();
                });
            });
            
            // Refresh button
            document.getElementById('refresh-data').addEventListener('click', () => {
                // In a real implementation, this would fetch fresh data
                // For now, we'll just update the last updated time
                this.updateLastUpdated();
                
                // Show a refresh animation
                document.querySelectorAll('.dashboard-card').forEach(card => {
                    card.classList.add('refreshing');
                    setTimeout(() => {
                        card.classList.remove('refreshing');
                    }, 1000);
                });
            });
        },
        
        updateLastUpdated: function() {
            const now = new Date();
            const timeElement = document.querySelector('#last-updated time');
            timeElement.textContent = now.toLocaleTimeString();
            timeElement.dateTime = now.toISOString();
        }
    };
    
    marketDashboard.init();
});
