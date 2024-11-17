class CheckboxGrid {
    constructor() {
        this.canvas = document.getElementById('checkboxCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.socket = io();
        this.isMultiplayer = false;
        this.checkboxSize = 20;
        this.viewportWidth = window.innerWidth - 40;
        this.viewportHeight = window.innerHeight - 150;
        this.gridState = new Map();
        this.viewportX = 0;
        this.viewportY = 0;

        this.setupCanvas();
        this.setupEventListeners();
        this.setupSocketListeners();
    }

    setupCanvas() {
        this.canvas.width = this.viewportWidth;
        this.canvas.height = this.viewportHeight;
        this.maxX = Math.floor(Math.sqrt(1e12));
        this.maxY = Math.floor(Math.sqrt(1e12));
    }

    setupEventListeners() {
        document.getElementById('playAlone').addEventListener('click', () => this.setMode('solo'));
        document.getElementById('playGlobal').addEventListener('click', () => this.setMode('global'));

        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        
        let isDragging = false;
        let lastX, lastY;

        this.canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - lastX;
                const deltaY = e.clientY - lastY;
                this.viewportX = Math.max(0, Math.min(this.maxX - this.viewportWidth, this.viewportX - deltaX));
                this.viewportY = Math.max(0, Math.min(this.maxY - this.viewportHeight, this.viewportY - deltaY));
                lastX = e.clientX;
                lastY = e.clientY;
                this.render();
            }
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        window.addEventListener('resize', () => {
            this.viewportWidth = window.innerWidth - 40;
            this.viewportHeight = window.innerHeight - 150;
            this.setupCanvas();
            this.render();
        });
    }

    setupSocketListeners() {
        this.socket.on('checkboxToggled', (data) => {
            if (this.isMultiplayer) {
                this.toggleCheckbox(data.x, data.y, false);
            }
        });
    }

    setMode(mode) {
        this.isMultiplayer = mode === 'global';
        document.getElementById('mode-display').textContent = `Mode: ${mode === 'global' ? 'Multiplayer' : 'Solo'}`;
        
        if (this.isMultiplayer) {
            this.socket.emit('joinGlobal');
        } else {
            this.socket.emit('leaveGlobal');
        }
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left + this.viewportX) / this.checkboxSize);
        const y = Math.floor((e.clientY - rect.top + this.viewportY) / this.checkboxSize);
        
        if (x >= 0 && x < this.maxX && y >= 0 && y < this.maxY) {
            this.toggleCheckbox(x, y, true);
        }
    }

    toggleCheckbox(x, y, emitEvent = false) {
        const key = `${x},${y}`;
        const currentState = this.gridState.get(key) || false;
        this.gridState.set(key, !currentState);
        
        if (emitEvent && this.isMultiplayer) {
            this.socket.emit('toggleCheckbox', { x, y });
        }
        
        this.render();
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const startX = Math.floor(this.viewportX / this.checkboxSize);
        const startY = Math.floor(this.viewportY / this.checkboxSize);
        const endX = Math.min(startX + Math.ceil(this.viewportWidth / this.checkboxSize), this.maxX);
        const endY = Math.min(startY + Math.ceil(this.viewportHeight / this.checkboxSize), this.maxY);

        document.getElementById('coordinates').textContent = 
            `Position: ${startX},${startY}`;

        for (let x = startX; x < endX; x++) {
            for (let y = startY; y < endY; y++) {
                const screenX = (x * this.checkboxSize) - this.viewportX;
                const screenY = (y * this.checkboxSize) - this.viewportY;
                
                this.ctx.strokeStyle = '#ccc';
                this.ctx.strokeRect(screenX, screenY, this.checkboxSize, this.checkboxSize);
                
                if (this.gridState.get(`${x},${y}`)) {
                    this.ctx.fillStyle = '#4CAF50';
                    this.ctx.fillRect(
                        screenX + 2,
                        screenY + 2,
                        this.checkboxSize - 4,
                        this.checkboxSize - 4
                    );
                }
            }
        }
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new CheckboxGrid();
});
