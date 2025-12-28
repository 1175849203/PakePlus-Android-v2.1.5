class LEDMatrixAnimator {
    constructor() {
        this.ledSizeFactor = 2;
        
        this.matrix = [];
        this.width = 8;
        this.height = 8;
        this.isMouseDown = false;
        this.animationInterval = null;
        this.isPlaying = false;
        this.currentFrameIndex = 0;
        this.animationFrames = [];
        this.draggedFrameIndex = null;
        this.newFrameAdded = false;
        
        this.initializeElements();
        this.bindEvents();
        this.createMatrix();
        this.addFrame();
    }
    
    initializeElements() {
        this.widthInput = document.getElementById('width');
        this.heightInput = document.getElementById('height');
        this.matrixContainer = document.getElementById('matrix');
        this.rowLabelsContainer = document.getElementById('rowLabelsBox');
        this.colLabelsContainer = document.getElementById('colLabelsBox');
        this.createMatrixBtn = document.getElementById('createMatrix');
        this.addFrameBtn = document.getElementById('addFrame');
        this.deleteFrameBtn = document.getElementById('deleteFrame');
        this.duplicateFrameBtn = document.getElementById('duplicateFrame');
        this.clearScreenBtn = document.getElementById('clearScreen');
        this.moveUpBtn = document.getElementById('moveUp');
        this.moveDownBtn = document.getElementById('moveDown');
        this.moveLeftBtn = document.getElementById('moveLeft');
        this.moveRightBtn = document.getElementById('moveRight');
        this.playBtn = document.getElementById('playBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.prevFrameBtn = document.getElementById('prevFrame');
        this.nextFrameBtn = document.getElementById('nextFrame');
        this.speedSlider = document.getElementById('speed');
        this.speedValue = document.getElementById('speedValue');
        this.framesList = document.getElementById('framesList');
        this.exportBtn = document.getElementById('exportBtn');
        this.exportArea = document.getElementById('exportArea');
        this.status = document.getElementById('status');
        this.exportFormatSelect = document.getElementById('exportFormat');
        this.saveProjectBtn = document.getElementById('saveProject');
        this.loadProjectBtn = document.getElementById('loadProject');
        this.loadFileInput = document.getElementById('loadFile');
        this.exportProjectBtn = document.getElementById('exportProject');
        this.moveDistanceInput = document.getElementById('moveDistance');
        this.animateMoveUpBtn = document.getElementById('animateMoveUp');
        this.animateMoveDownBtn = document.getElementById('animateMoveDown');
        this.animateMoveLeftBtn = document.getElementById('animateMoveLeft');
        this.animateMoveRightBtn = document.getElementById('animateMoveRight');
    }
    
    bindEvents() {
        this.createMatrixBtn.addEventListener('click', () => {
            this.width = parseInt(this.widthInput.value) || 8;
            this.height = parseInt(this.heightInput.value) || 8;
            this.createMatrix();
            this.animationFrames = [];
            this.currentFrameIndex = 0;
            this.addFrame();
            this.updateFramesDisplay();
            this.updateStatus();
        });
        
        this.addFrameBtn.addEventListener('click', () => {
            this.addFrame();
        });
        
        this.deleteFrameBtn.addEventListener('click', () => {
            this.deleteFrame();
        });
        
        this.duplicateFrameBtn.addEventListener('click', () => {
            this.duplicateFrame();
        });
        
        this.clearScreenBtn.addEventListener('click', () => {
            this.clearScreen();
        });
        
        this.moveUpBtn.addEventListener('click', () => {
            this.moveMatrix(0, -1);
        });
        
        this.moveDownBtn.addEventListener('click', () => {
            this.moveMatrix(0, 1);
        });
        
        this.moveLeftBtn.addEventListener('click', () => {
            this.moveMatrix(-1, 0);
        });
        
        this.moveRightBtn.addEventListener('click', () => {
            this.moveMatrix(1, 0);
        });
        
        this.playBtn.addEventListener('click', () => {
            this.play();
        });
        
        this.pauseBtn.addEventListener('click', () => {
            this.pause();
        });
        
        this.stopBtn.addEventListener('click', () => {
            this.stop();
        });
        
        this.prevFrameBtn.addEventListener('click', () => {
            this.previousFrame();
        });
        
        this.nextFrameBtn.addEventListener('click', () => {
            this.nextFrame();
        });
        
        this.speedSlider.addEventListener('input', () => {
            const speed = this.speedSlider.value;
            this.speedValue.textContent = `${speed}ms`;
            if (this.isPlaying) {
                this.restartAnimation();
            }
        });
        
        this.exportBtn.addEventListener('click', () => {
            this.exportAnimation();
        });
        
        this.saveProjectBtn.addEventListener('click', () => {
            this.saveProject();
        });
        
        this.loadProjectBtn.addEventListener('click', () => {
            this.loadFileInput.click();
        });
        
        this.loadFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.loadProjectFromFile(file);
            }
            e.target.value = '';
        });
        
        this.exportProjectBtn.addEventListener('click', () => {
            this.exportProject();
        });
        
        this.animateMoveUpBtn.addEventListener('click', () => {
            this.animateMove(0, -1);
        });
        
        this.animateMoveDownBtn.addEventListener('click', () => {
            this.animateMove(0, 1);
        });
        
        this.animateMoveLeftBtn.addEventListener('click', () => {
            this.animateMove(-1, 0);
        });
        
        this.animateMoveRightBtn.addEventListener('click', () => {
            this.animateMove(1, 0);
        });
        
        document.addEventListener('mousedown', (e) => {
            if (!e.target.classList.contains('led')) {
                this.isMouseDown = true;
            }
        });
        
        document.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });
        
        document.addEventListener('selectstart', (e) => {
            if (e.target.classList.contains('led')) {
                e.preventDefault();
            }
        });
        
        window.addEventListener('beforeunload', (e) => {
            if (this.animationFrames.length > 0) {
                e.preventDefault();
                e.returnValue = '您有未保存的动画项目，确定要离开吗？';
                return '您有未保存的动画项目，确定要离开吗？';
            }
        });
    }
    
    saveProject() {
        const projectData = {
            matrix: this.matrix,
            width: this.width,
            height: this.height,
            currentFrameIndex: this.currentFrameIndex,
            animationFrames: this.animationFrames,
            ledSizeFactor: this.ledSizeFactor
        };
        
        const dataStr = JSON.stringify(projectData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'led-matrix-project.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
    
    loadProjectFromFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const projectData = JSON.parse(e.target.result);
                
                this.width = projectData.width || 8;
                this.height = projectData.height || 8;
                this.currentFrameIndex = projectData.currentFrameIndex || 0;
                this.animationFrames = projectData.animationFrames || [];
                this.ledSizeFactor = projectData.ledSizeFactor || 2;
                
                this.widthInput.value = this.width;
                this.heightInput.value = this.height;
                
                this.createMatrix();
                
                if (this.animationFrames.length > 0) {
                    if (this.currentFrameIndex >= this.animationFrames.length) {
                        this.currentFrameIndex = 0;
                    }
                    this.loadFrame(this.currentFrameIndex);
                }
                
                this.updateFramesDisplay();
                this.updateStatus();
                
                alert('项目已从文件加载');
            } catch (e) {
                console.error('加载项目失败:', e);
                alert('加载项目失败，请检查文件格式');
            }
        };
        reader.readAsText(file);
    }
    
    exportProject() {
        const projectData = {
            matrix: this.matrix,
            width: this.width,
            height: this.height,
            currentFrameIndex: this.currentFrameIndex,
            animationFrames: this.animationFrames,
            ledSizeFactor: this.ledSizeFactor
        };
        
        const dataStr = JSON.stringify(projectData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'led-matrix-project.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
    
    createMatrix() {
        if (this.width < 1 || this.width > 64 || this.height < 1 || this.height > 32) {
            alert('矩阵大小必须在1-64宽度和1-32高度之间');
            return;
        }
        
        this.matrix = [];
        for (let i = 0; i < this.height; i++) {
            this.matrix[i] = [];
            for (let j = 0; j < this.width; j++) {
                this.matrix[i][j] = false;
            }
        }
        
        this.matrixContainer.innerHTML = '';
        this.rowLabelsContainer.innerHTML = '';
        this.colLabelsContainer.innerHTML = '';
        
        const ledSize = 20;
        const ledGap = 1;
        const matrixWidth = this.width * (ledSize + ledGap) - ledGap;
        
        this.matrixContainer.className = 'matrix-grid';
        this.matrixContainer.style.gridTemplateColumns = `repeat(${this.width}, ${ledSize}px)`;
        this.matrixContainer.style.width = `${matrixWidth}px`;
        
        this.colLabelsContainer.style.width = `${matrixWidth}px`;
        
        for (let i = 0; i < this.height; i++) {
            const rowLabel = document.createElement('div');
            rowLabel.className = 'row-label';
            rowLabel.textContent = i;
            this.rowLabelsContainer.appendChild(rowLabel);
        }
        
        for (let j = 0; j < this.width; j++) {
            const colLabel = document.createElement('div');
            colLabel.className = 'col-label';
            colLabel.textContent = j;
            this.colLabelsContainer.appendChild(colLabel);
        }
        
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                const led = document.createElement('div');
                led.className = 'led';
                led.dataset.row = i;
                led.dataset.col = j;
                
                led.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    this.toggleLED(e.target);
                    this.isMouseDown = true;
                });
                
                led.addEventListener('mouseover', (e) => {
                    if (this.isMouseDown) {
                        this.toggleLED(e.target);
                    }
                });
                
                this.matrixContainer.appendChild(led);
            }
        }
        
        this.updateFramesDisplay();
    }
    
    toggleLED(ledElement) {
        const row = parseInt(ledElement.dataset.row);
        const col = parseInt(ledElement.dataset.col);
        
        this.matrix[row][col] = !this.matrix[row][col];
        
        if (this.matrix[row][col]) {
            ledElement.classList.add('on');
        } else {
            ledElement.classList.remove('on');
        }
        
        if (this.currentFrameIndex < this.animationFrames.length) {
            this.animationFrames[this.currentFrameIndex][row][col] = this.matrix[row][col];
        }
    }
    
    clearScreen() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.matrix[i][j] = false;
            }
        }
        
        this.updateDisplay();
        
        if (this.currentFrameIndex < this.animationFrames.length) {
            for (let i = 0; i < this.height; i++) {
                for (let j = 0; j < this.width; j++) {
                    this.animationFrames[this.currentFrameIndex][i][j] = false;
                }
            }
        }
        
        this.updateFramesDisplay();
    }
    
    moveMatrix(dx, dy) {
        const newMatrix = [];
        for (let i = 0; i < this.height; i++) {
            newMatrix[i] = [];
            for (let j = 0; j < this.width; j++) {
                const newRow = i - dy;
                const newCol = j - dx;
                
                if (newRow >= 0 && newRow < this.height && newCol >= 0 && newCol < this.width) {
                    newMatrix[i][j] = this.matrix[newRow][newCol];
                } else {
                    newMatrix[i][j] = false;
                }
            }
        }
        
        this.matrix = newMatrix;
        this.updateDisplay();
        
        if (this.currentFrameIndex < this.animationFrames.length) {
            this.animationFrames[this.currentFrameIndex] = JSON.parse(JSON.stringify(newMatrix));
        }
        
        this.updateFramesDisplay();
    }
    
    animateMove(dx, dy) {
        const distance = parseInt(this.moveDistanceInput.value) || 1;
        const originalFrame = JSON.parse(JSON.stringify(this.matrix));
        
        for (let step = 1; step <= distance; step++) {
            const stepDx = dx * step;
            const stepDy = dy * step;
            
            const newFrame = [];
            for (let i = 0; i < this.height; i++) {
                newFrame[i] = [];
                for (let j = 0; j < this.width; j++) {
                    const originalRow = i - stepDy;
                    const originalCol = j - stepDx;
                    
                    if (originalRow >= 0 && originalRow < this.height && originalCol >= 0 && originalCol < this.width) {
                        newFrame[i][j] = originalFrame[originalRow][originalCol];
                    } else {
                        newFrame[i][j] = false;
                    }
                }
            }
            
            this.animationFrames.push(newFrame);
        }
        
        this.currentFrameIndex = this.animationFrames.length - 1;
        this.loadFrame(this.currentFrameIndex);
        this.updateFramesDisplay();
        this.updateStatus();
    }
    
    addFrame() {
        const newFrame = JSON.parse(JSON.stringify(this.matrix));
        this.animationFrames.splice(this.currentFrameIndex + 1, 0, newFrame);
        this.currentFrameIndex++;
        this.newFrameAdded = true;
        
        this.updateFramesDisplay();
        this.updateStatus();
    }
    
    deleteFrame() {
        if (this.animationFrames.length <= 1) {
            alert('至少需要保留一帧');
            return;
        }
        
        this.animationFrames.splice(this.currentFrameIndex, 1);
        
        if (this.currentFrameIndex >= this.animationFrames.length) {
            this.currentFrameIndex = this.animationFrames.length - 1;
        }
        
        this.loadFrame(this.currentFrameIndex);
        this.updateFramesDisplay();
        this.updateStatus();
    }
    
    duplicateFrame() {
        if (this.animationFrames.length === 0) return;
        
        const currentFrame = this.animationFrames[this.currentFrameIndex];
        const newFrame = JSON.parse(JSON.stringify(currentFrame));
        
        this.animationFrames.splice(this.currentFrameIndex + 1, 0, newFrame);
        this.currentFrameIndex++;
        this.loadFrame(this.currentFrameIndex);
        this.updateFramesDisplay();
        this.updateStatus();
    }
    
    loadFrame(index) {
        if (index < 0 || index >= this.animationFrames.length) return;
        
        this.currentFrameIndex = index;
        
        const frame = this.animationFrames[index];
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.matrix[i][j] = frame[i][j];
            }
        }
        
        this.updateDisplay();
    }
    
    updateDisplay() {
        const leds = this.matrixContainer.querySelectorAll('.led');
        leds.forEach(led => {
            const row = parseInt(led.dataset.row);
            const col = parseInt(led.dataset.col);
            
            if (this.matrix[row][col]) {
                led.classList.add('on');
            } else {
                led.classList.remove('on');
            }
        });
    }
    
    play() {
        if (this.animationFrames.length <= 1) {
            alert('需要至少两帧才能播放动画');
            return;
        }
        
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.playBtn.disabled = true;
        this.pauseBtn.disabled = false;
        
        const speed = parseInt(this.speedSlider.value);
        
        this.animationInterval = setInterval(() => {
            this.currentFrameIndex = (this.currentFrameIndex + 1) % this.animationFrames.length;
            this.loadFrame(this.currentFrameIndex);
            this.updateFramesDisplay();
            this.updateStatus();
        }, speed);
    }
    
    pause() {
        if (!this.isPlaying) return;
        
        clearInterval(this.animationInterval);
        this.isPlaying = false;
        this.playBtn.disabled = false;
        this.pauseBtn.disabled = true;
    }
    
    stop() {
        this.pause();
        this.currentFrameIndex = 0;
        this.loadFrame(0);
        this.updateFramesDisplay();
        this.updateStatus();
    }
    
    restartAnimation() {
        if (this.isPlaying) {
            this.pause();
            this.play();
        }
    }
    
    previousFrame() {
        if (this.animationFrames.length === 0) return;
        
        this.currentFrameIndex--;
        if (this.currentFrameIndex < 0) {
            this.currentFrameIndex = this.animationFrames.length - 1;
        }
        
        this.loadFrame(this.currentFrameIndex);
        this.updateFramesDisplay();
        this.updateStatus();
    }
    
    nextFrame() {
        if (this.animationFrames.length === 0) return;
        
        this.currentFrameIndex++;
        if (this.currentFrameIndex >= this.animationFrames.length) {
            this.currentFrameIndex = 0;
        }
        
        this.loadFrame(this.currentFrameIndex);
        this.updateFramesDisplay();
        this.updateStatus();
    }
    
    updateFramesDisplay() {
        this.framesList.innerHTML = '';
        
        this.animationFrames.forEach((frame, index) => {
            let previewSize, previewMargin;
            if (this.width <= 8 && this.height <= 8) {
                previewSize = 8;
                previewMargin = 1;
            } else if (this.width <= 16 && this.height <= 16) {
                previewSize = 6;
                previewMargin = 0.8;
            } else {
                previewSize = 4;
                previewMargin = 0.5;
            }
            
            const frameDiv = document.createElement('div');
            frameDiv.className = `frame-item ${index === this.currentFrameIndex ? 'active' : ''}`;
            frameDiv.innerHTML = `
                <div style="display: flex; flex-direction: column; position: relative;">
                    <div style="font-size: 12px; text-align: center; margin-bottom: 5px;">${index + 1}</div>
                    <div style="display: flex; flex-direction: column;">
                        ${frame.map(row => 
                            `<div style="display: flex;">
                                ${row.map(cell => 
                                    `<div style="width: ${previewSize}px; height: ${previewSize}px; margin: ${previewMargin}px; background-color: ${cell ? '#ff5555' : '#222'}; border: 1px solid #555;"></div>`
                                ).join('')}
                            </div>`
                        ).join('')}
                    </div>
                    ${index === this.currentFrameIndex && this.newFrameAdded ? '<div class="new-frame-indicator">N</div>' : ''}
                </div>
            `;
            
            if (index === this.currentFrameIndex && this.newFrameAdded) {
                setTimeout(() => {
                    this.newFrameAdded = false;
                }, 2000);
            }
            
            frameDiv.addEventListener('click', () => {
                this.loadFrame(index);
                this.updateFramesDisplay();
                this.updateStatus();
            });
            
            frameDiv.draggable = true;
            frameDiv.dataset.index = index;
            
            frameDiv.addEventListener('dragstart', (e) => {
                this.draggedFrameIndex = parseInt(e.target.dataset.index);
                e.dataTransfer.effectAllowed = 'move';
            });
            
            frameDiv.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });
            
            frameDiv.addEventListener('drop', (e) => {
                e.preventDefault();
                const targetIndex = parseInt(e.target.closest('.frame-item').dataset.index);
                
                if (this.draggedFrameIndex !== null && this.draggedFrameIndex !== targetIndex) {
                    const draggedFrame = this.animationFrames[this.draggedFrameIndex];
                    this.animationFrames.splice(this.draggedFrameIndex, 1);
                    this.animationFrames.splice(targetIndex, 0, draggedFrame);
                    
                    if (this.currentFrameIndex === this.draggedFrameIndex) {
                        this.currentFrameIndex = targetIndex;
                    } else if (this.currentFrameIndex === targetIndex) {
                        this.currentFrameIndex = this.draggedFrameIndex;
                    }
                    
                    this.draggedFrameIndex = null;
                    this.updateFramesDisplay();
                    this.updateStatus();
                }
            });
            
            this.framesList.appendChild(frameDiv);
        });
    }
    
    updateStatus() {
        this.status.textContent = `就绪 - 当前帧: ${this.currentFrameIndex + 1}/${this.animationFrames.length}`;
    }
    
    exportAnimation() {
        const format = this.exportFormatSelect.value;
        
        switch (format) {
            case 'c-array':
                this.exportAsCArray();
                break;
            case 'c-column':
                this.exportAsCColumn();
                break;
            case 'c-bitplane':
                this.exportAsCBitplane();
                break;
            case 'c-font':
                this.exportAsCFont();
                break;
            case 'python':
                this.exportAsPython();
                break;
            case 'javascript':
                this.exportAsJavaScript();
                break;
            case 'json':
                this.exportAsJSON();
                break;
            case 'binary':
                this.exportAsBinary();
                break;
            default:
                this.exportAsCArray();
        }
    }
    
    exportAsCArray() {
        let cCode = '';
        
        if (this.width <= 8) {
            cCode = `const uint8_t IMAGES[][${this.height}] = {\n`;
        } else if (this.width <= 16) {
            cCode = `const uint16_t IMAGES[][${this.height}] = {\n`;
        } else if (this.width <= 32) {
            cCode = `const uint32_t IMAGES[][${this.height}] = {\n`;
        } else {
            const bytesPerRow = Math.ceil(this.width / 8);
            cCode = `const uint8_t IMAGES[][${this.height}][${bytesPerRow}] = {\n`;
        }
        
        this.animationFrames.forEach((frame, frameIndex) => {
            cCode += `{\n`;
            
            if (this.width <= 32) {
                for (let i = 0; i < this.height; i++) {
                    let binaryString = '';
                    for (let j = 0; j < this.width; j++) {
                        binaryString += frame[i][j] ? '1' : '0';
                    }
                    
                    let value = 0;
                    for (let k = 0; k < binaryString.length; k++) {
                        if (binaryString[k] === '1') {
                            value |= (1 << (binaryString.length - 1 - k));
                        }
                    }
                    
                    cCode += `  0x${value.toString(16).toUpperCase().padStart(Math.ceil(this.width/4), '0')},  // 0b${binaryString}\n`;
                }
            } else {
                const bytesPerRow = Math.ceil(this.width / 8);
                for (let i = 0; i < this.height; i++) {
                    cCode += `  {`;
                    for (let byteIndex = 0; byteIndex < bytesPerRow; byteIndex++) {
                        let byteValue = 0;
                        for (let bit = 0; bit < 8; bit++) {
                            const colIndex = byteIndex * 8 + bit;
                            if (colIndex < this.width && frame[i][colIndex]) {
                                byteValue |= (1 << (7 - bit));
                            }
                        }
                        cCode += `0x${byteValue.toString(16).toUpperCase().padStart(2, '0')}`;
                        if (byteIndex < bytesPerRow - 1) cCode += ', ';
                    }
                    cCode += `},  // Row ${i} (0b`;
                    for (let j = 0; j < this.width; j++) {
                        cCode += frame[i][j] ? '1' : '0';
                    }
                    cCode += ')\n';
                }
            }
            
            cCode += `}${frameIndex < this.animationFrames.length - 1 ? ',' : ''}\n`;
        });
        
        cCode += `};\n`;
        cCode += `const int IMAGES_LEN = sizeof(IMAGES)/sizeof(IMAGES[0]);`;
        
        this.exportArea.value = cCode;
    }
    
    exportAsCColumn() {
        let cCode = '';
        
        if (this.height <= 8) {
            cCode = `const uint8_t IMAGES[][${this.width}] = {\n`;
        } else if (this.height <= 16) {
            cCode = `const uint16_t IMAGES[][${this.width}] = {\n`;
        } else if (this.height <= 32) {
            cCode = `const uint32_t IMAGES[][${this.width}] = {\n`;
        } else {
            const bytesPerCol = Math.ceil(this.height / 8);
            cCode = `const uint8_t IMAGES[][${this.width}][${bytesPerCol}] = {\n`;
        }
        
        this.animationFrames.forEach((frame, frameIndex) => {
            cCode += `{\n`;
            
            if (this.height <= 32) {
                for (let j = 0; j < this.width; j++) {
                    let binaryString = '';
                    for (let i = 0; i < this.height; i++) {
                        binaryString += frame[i][j] ? '1' : '0';
                    }
                    
                    let value = 0;
                    for (let k = 0; k < binaryString.length; k++) {
                        if (binaryString[k] === '1') {
                            value |= (1 << (binaryString.length - 1 - k));
                        }
                    }
                    
                    cCode += `  0x${value.toString(16).toUpperCase().padStart(Math.ceil(this.height/4), '0')},  // 0b${binaryString}\n`;
                }
            } else {
                const bytesPerCol = Math.ceil(this.height / 8);
                for (let j = 0; j < this.width; j++) {
                    cCode += `  {`;
                    for (let byteIndex = 0; byteIndex < bytesPerCol; byteIndex++) {
                        let byteValue = 0;
                        for (let bit = 0; bit < 8; bit++) {
                            const rowIndex = byteIndex * 8 + bit;
                            if (rowIndex < this.height && frame[rowIndex][j]) {
                                byteValue |= (1 << (7 - bit));
                            }
                        }
                        cCode += `0x${byteValue.toString(16).toUpperCase().padStart(2, '0')}`;
                        if (byteIndex < bytesPerCol - 1) cCode += ', ';
                    }
                    cCode += `},  // Col ${j} (0b`;
                    for (let i = 0; i < this.height; i++) {
                        cCode += frame[i][j] ? '1' : '0';
                    }
                    cCode += ')\n';
                }
            }
            
            cCode += `}${frameIndex < this.animationFrames.length - 1 ? ',' : ''}\n`;
        });
        
        cCode += `};\n`;
        cCode += `const int IMAGES_LEN = sizeof(IMAGES)/sizeof(IMAGES[0]);`;
        
        this.exportArea.value = cCode;
    }
    
    exportAsCBitplane() {
        let cCode = '';
        
        const maxDim = Math.max(this.width, this.height);
        const bitPlanes = Math.ceil(Math.log2(maxDim));
        
        cCode = `// 位平面数据 (${this.width}x${this.height})\n`;
        cCode += `const uint8_t BITPLANES[${this.animationFrames.length}][${bitPlanes}] = {\n`;
        
        this.animationFrames.forEach((frame, frameIndex) => {
            cCode += `{\n`;
            
            for (let plane = 0; plane < bitPlanes; plane++) {
                let planeValue = 0;
                
                for (let i = 0; i < this.height; i++) {
                    for (let j = 0; j < this.width; j++) {
                        if (frame[i][j]) {
                            const pos = i * this.width + j;
                            if (pos < 8) {
                                if ((pos & (1 << plane)) !== 0) {
                                    planeValue |= (1 << (pos % 8));
                                }
                            }
                        }
                    }
                }
                
                cCode += `  0x${planeValue.toString(16).toUpperCase().padStart(2, '0')},  // Bitplane ${plane}\n`;
            }
            
            cCode += `}${frameIndex < this.animationFrames.length - 1 ? ',' : ''}\n`;
        });
        
        cCode += `};\n`;
        cCode += `const int BITPLANES_LEN = sizeof(BITPLANES)/sizeof(BITPLANES[0]);`;
        
        this.exportArea.value = cCode;
    }
    
    exportAsCFont() {
        let cCode = '';
        
        cCode = `// 字体/图形库格式 (${this.width}x${this.height})\n`;
        cCode += `const uint8_t FONT_DATA[${this.animationFrames.length}][${this.height}] = {\n`;
        
        this.animationFrames.forEach((frame, frameIndex) => {
            cCode += `{\n`;
            
            for (let i = 0; i < this.height; i++) {
                let rowValue = 0;
                for (let j = 0; j < Math.min(this.width, 8); j++) {
                    if (frame[i][j]) {
                        rowValue |= (1 << (7 - j));
                    }
                }
                
                cCode += `  0x${rowValue.toString(16).toUpperCase().padStart(2, '0')},  // Row ${i}\n`;
            }
            
            cCode += `}${frameIndex < this.animationFrames.length - 1 ? ',' : ''}\n`;
        });
        
        cCode += `};\n`;
        cCode += `const int FONT_LEN = sizeof(FONT_DATA)/sizeof(FONT_DATA[0]);\n\n`;
        cCode += `// 使用方法:\n`;
        cCode += `// for(int row = 0; row < ${this.height}; row++) {\n`;
        cCode += `//   uint8_t data = FONT_DATA[frame_index][row];\n`;
        cCode += `//   // 处理每行的位数据\n`;
        cCode += `// }`;
        
        this.exportArea.value = cCode;
    }
    
    exportAsPython() {
        let pyCode = `# Python列表格式 (${this.width}x${this.height})\n`;
        pyCode += `IMAGES = [\n`;
        
        this.animationFrames.forEach((frame, frameIndex) => {
            pyCode += `  [\n`;
            
            for (let i = 0; i < this.height; i++) {
                pyCode += `    [`;
                for (let j = 0; j < this.width; j++) {
                    pyCode += frame[i][j] ? '1' : '0';
                    if (j < this.width - 1) pyCode += ', ';
                }
                pyCode += `],\n`;
            }
            
            pyCode += `  ]${frameIndex < this.animationFrames.length - 1 ? ',' : ''}\n`;
        });
        
        pyCode += `]\n`;
        pyCode += `IMAGES_LEN = len(IMAGES)`;
        
        this.exportArea.value = pyCode;
    }
    
    exportAsJavaScript() {
        let jsCode = `// JavaScript数组格式 (${this.width}x${this.height})\n`;
        jsCode += `const IMAGES = [\n`;
        
        this.animationFrames.forEach((frame, frameIndex) => {
            jsCode += `  [\n`;
            
            for (let i = 0; i < this.height; i++) {
                jsCode += `    [`;
                for (let j = 0; j < this.width; j++) {
                    jsCode += frame[i][j] ? '1' : '0';
                    if (j < this.width - 1) jsCode += ', ';
                }
                jsCode += `],\n`;
            }
            
            jsCode += `  ]${frameIndex < this.animationFrames.length - 1 ? ',' : ''}\n`;
        });
        
        jsCode += `];\n`;
        jsCode += `const IMAGES_LEN = IMAGES.length;`;
        
        this.exportArea.value = jsCode;
    }
    
    exportAsJSON() {
        const jsonData = {
            width: this.width,
            height: this.height,
            frames: this.animationFrames
        };
        
        this.exportArea.value = JSON.stringify(jsonData, null, 2);
    }
    
    exportAsBinary() {
        let binCode = `// 二进制字符串格式 (${this.width}x${this.height})\n`;
        binCode += `const char* BINARY_IMAGES[${this.animationFrames.length}] = {\n`;
        
        this.animationFrames.forEach((frame, frameIndex) => {
            binCode += `  // Frame ${frameIndex + 1}\n`;
            binCode += `  "`;
            
            for (let i = 0; i < this.height; i++) {
                for (let j = 0; j < this.width; j++) {
                    binCode += frame[i][j] ? '1' : '0';
                }
                if (i < this.height - 1) binCode += '\\n';
            }
            
            binCode += `"${frameIndex < this.animationFrames.length - 1 ? ',' : ''}\n`;
        });
        
        binCode += `};\n`;
        binCode += `const int BINARY_IMAGES_LEN = sizeof(BINARY_IMAGES)/sizeof(BINARY_IMAGES[0]);`;
        
        this.exportArea.value = binCode;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new LEDMatrixAnimator();
});
