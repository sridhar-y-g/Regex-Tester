document.addEventListener('DOMContentLoaded', () => {
    const regexInput = document.getElementById('regexPattern');
    const testString = document.getElementById('testString');
    const testButton = document.getElementById('testRegex');
    const matchesList = document.getElementById('matchesList');
    const highlightedText = document.getElementById('highlightedText');
    const globalFlag = document.getElementById('globalFlag');
    const caseInsensitiveFlag = document.getElementById('caseInsensitiveFlag');
    const multilineFlag = document.getElementById('multilineFlag');

    // Function to get flags from checkboxes
    const getFlags = () => {
        let flags = '';
        if (globalFlag.checked) flags += 'g';
        if (caseInsensitiveFlag.checked) flags += 'i';
        if (multilineFlag.checked) flags += 'm';
        return flags;
    };

    // Function to highlight matches in text
    const highlightMatches = (text, regex) => {
        if (!text || !regex) return text;

        try {
            const matches = [...text.matchAll(regex)];
            if (matches.length === 0) return text;

            let result = text;
            let offset = 0;

            matches.forEach((match, index) => {
                const start = match.index + offset;
                const end = start + match[0].length;
                const highlighted = `<span class="highlight" style="background-color: ${getHighlightColor(index)}">${match[0]}</span>`;
                result = result.slice(0, start) + highlighted + result.slice(end);
                offset += highlighted.length - match[0].length;
            });

            return result;
        } catch (error) {
            return text;
        }
    };

    // Function to generate different highlight colors
    const getHighlightColor = (index) => {
        const colors = [
            '#ffeaa7', // Light yellow
            '#81ecec', // Light cyan
            '#fab1a0', // Light coral
            '#74b9ff', // Light blue
            '#a29bfe', // Light purple
            '#55efc4'  // Light green
        ];
        return colors[index % colors.length];
    };

    // Function to display matches
    const displayMatches = (matches) => {
        matchesList.innerHTML = '';
        
        if (matches.length === 0) {
            matchesList.innerHTML = '<div class="no-matches">No matches found</div>';
            return;
        }

        matches.forEach((match, index) => {
            const matchItem = document.createElement('div');
            matchItem.className = 'match-item';
            matchItem.style.backgroundColor = getHighlightColor(index);
            
            const matchInfo = document.createElement('div');
            matchInfo.innerHTML = `
                <strong>Match ${index + 1}:</strong> "${match[0]}"
                <br>
                <small>Position: ${match.index}</small>
            `;
            
            matchItem.appendChild(matchInfo);
            matchesList.appendChild(matchItem);
        });
    };

    // Function to test regex
    const testRegex = () => {
        const pattern = regexInput.value;
        const text = testString.value;
        const flags = getFlags();

        try {
            const regex = new RegExp(pattern, flags);
            const matches = [...text.matchAll(regex)];
            
            // Display matches
            displayMatches(matches);
            
            // Highlight matches in text
            highlightedText.innerHTML = highlightMatches(text, regex);
            
            // Add success animation
            testButton.classList.add('success');
            setTimeout(() => testButton.classList.remove('success'), 500);
        } catch (error) {
            matchesList.innerHTML = `<div class="error">Invalid regex pattern: ${error.message}</div>`;
            highlightedText.textContent = text;
            
            // Add error animation
            testButton.classList.add('error');
            setTimeout(() => testButton.classList.remove('error'), 500);
        }
    };

    // Event listeners
    testButton.addEventListener('click', testRegex);
    
    // Real-time testing on input change
    let debounceTimer;
    const debounce = (func, delay) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(func, delay);
    };

    regexInput.addEventListener('input', () => debounce(testRegex, 300));
    testString.addEventListener('input', () => debounce(testRegex, 300));
    
    // Flag change listeners
    [globalFlag, caseInsensitiveFlag, multilineFlag].forEach(flag => {
        flag.addEventListener('change', testRegex);
    });

    // Add keyboard shortcut (Ctrl/Cmd + Enter)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            testRegex();
        }
    });

    // Theme Toggle Functionality
    const themeBtn = document.querySelector('.theme-btn');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Check for saved theme preference or use system preference
    const currentTheme = localStorage.getItem('theme') || 
        (prefersDarkScheme.matches ? 'dark' : 'light');

    // Apply the theme
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Theme toggle click handler
    themeBtn.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
        }
    });

    // Data Randomizer Functionality
    const dataType = document.getElementById('dataType');
    const dataCount = document.getElementById('dataCount');
    const visualizationType = document.getElementById('visualizationType');
    const generateBtn = document.getElementById('generateData');
    const chartContainer = document.getElementById('chartContainer');
    const listContainer = document.getElementById('listContainer');
    let currentChart = null;

    // Data generation functions
    const generateRandomNumber = () => Math.floor(Math.random() * 100) + 1;
    const generateRandomWord = () => {
        const words = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew'];
        return words[Math.floor(Math.random() * words.length)];
    };
    const generateRandomEmail = () => {
        const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
        const name = Math.random().toString(36).substring(7);
        return `${name}@${domains[Math.floor(Math.random() * domains.length)]}`;
    };
    const generateRandomDate = () => {
        const start = new Date(2020, 0, 1);
        const end = new Date();
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
    };

    // Generate data based on selected type
    const generateData = () => {
        const count = parseInt(dataCount.value);
        const type = dataType.value;
        let data = [];

        for (let i = 0; i < count; i++) {
            switch (type) {
                case 'numbers':
                    data.push(generateRandomNumber());
                    break;
                case 'words':
                    data.push(generateRandomWord());
                    break;
                case 'emails':
                    data.push(generateRandomEmail());
                    break;
                case 'dates':
                    data.push(generateRandomDate());
                    break;
            }
        }

        return data;
    };

    // Process data for visualization
    const processData = (data) => {
        const counts = {};
        data.forEach(item => {
            counts[item] = (counts[item] || 0) + 1;
        });

        return {
            labels: Object.keys(counts),
            values: Object.values(counts)
        };
    };

    // Create chart visualization
    const createChart = (data, type) => {
        if (currentChart) {
            currentChart.destroy();
        }

        const ctx = document.createElement('canvas');
        chartContainer.innerHTML = '';
        chartContainer.appendChild(ctx);

        const chartData = {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: [
                    '#6c5ce7',
                    '#a29bfe',
                    '#00b894',
                    '#00cec9',
                    '#fd79a8',
                    '#e84393',
                    '#ffeaa7',
                    '#fab1a0'
                ]
            }]
        };

        const config = {
            type: type,
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
                        }
                    }
                }
            }
        };

        currentChart = new Chart(ctx, config);
    };

    // Create list visualization
    const createList = (data) => {
        listContainer.innerHTML = '';
        data.labels.forEach((label, index) => {
            const item = document.createElement('div');
            item.className = 'list-item';
            item.innerHTML = `
                <span class="value">${label}</span>
                <span class="count">${data.values[index]}</span>
            `;
            listContainer.appendChild(item);
        });
    };

    // Update visualization based on type
    const updateVisualization = (data) => {
        const type = visualizationType.value;
        const processedData = processData(data);

        if (type === 'list') {
            chartContainer.style.display = 'none';
            listContainer.style.display = 'flex';
            createList(processedData);
        } else {
            chartContainer.style.display = 'block';
            listContainer.style.display = 'none';
            createChart(processedData, type);
        }
    };

    // Event listeners for data randomizer
    generateBtn.addEventListener('click', () => {
        const data = generateData();
        updateVisualization(data);
    });

    visualizationType.addEventListener('change', () => {
        if (chartContainer.children.length > 0) {
            const data = generateData();
            updateVisualization(data);
        }
    });

    // Initial data generation
    generateBtn.click();
}); 