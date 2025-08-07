class QualiVerdeApp {
    constructor() {
        this.camera = null;
        this.canvas = null;
        this.context = null;
        this.isScanning = false;
        
        this.fruits = {
            banana: {
                name: 'Banana',
                icon: 'fas fa-seedling',
                characteristics: ['Cor amarela vibrante', 'Casca sem manchas escuras', 'Textura firme', 'Aroma doce']
            },
            maca: {
                name: 'Maçã',
                icon: 'fas fa-apple-alt',
                characteristics: ['Cor vermelha/verde uniforme', 'Casca lisa e brilhante', 'Textura crocante', 'Sem amassados']
            },
            laranja: {
                name: 'Laranja',
                icon: 'fas fa-circle',
                characteristics: ['Cor laranja intensa', 'Casca texturizada', 'Peso adequado', 'Aroma cítrico']
            },
            mamao: {
                name: 'Mamão',
                icon: 'fas fa-lemon',
                characteristics: ['Cor amarelo-alaranjada', 'Textura macia', 'Sem manchas escuras', 'Aroma doce']
            },
            uva: {
                name: 'Uva',
                icon: 'fas fa-grape-cluster',
                characteristics: ['Bagos firmes', 'Cor uniforme', 'Sem rachaduras', 'Aderência ao cacho']
            },
            melancia: {
                name: 'Melancia',
                icon: 'fas fa-circle',
                characteristics: ['Casca verde com listras', 'Som oco ao bater', 'Mancha amarela na base', 'Peso adequado']
            },
            abacaxi: {
                name: 'Abacaxi',
                icon: 'fas fa-pineapple',
                characteristics: ['Cor dourada', 'Folhas verdes', 'Aroma doce na base', 'Textura firme']
            },
            manga: {
                name: 'Manga',
                icon: 'fas fa-mango',
                characteristics: ['Cor amarelo-avermelhada', 'Textura macia', 'Aroma doce', 'Sem manchas escuras']
            },
            limao: {
                name: 'Limão',
                icon: 'fas fa-lemon',
                characteristics: ['Cor verde/amarela', 'Casca lisa', 'Peso adequado', 'Aroma cítrico forte']
            },
            morango: {
                name: 'Morango',
                icon: 'fas fa-strawberry',
                characteristics: ['Cor vermelha vibrante', 'Folhas verdes', 'Textura firme', 'Sem partes moles']
            }
        };
        
        this.init();
    }
    
    init() {
        this.showSplashScreen();
        this.setupEventListeners();
        this.setupCanvas();
    }
    
    showSplashScreen() {
        setTimeout(() => {
            document.getElementById('splash-screen').classList.add('hidden');
            document.getElementById('main-app').classList.remove('hidden');
        }, 3000);
    }
    
    setupEventListeners() {
        document.getElementById('start-camera').addEventListener('click', () => this.startCamera());
        document.getElementById('capture-photo').addEventListener('click', () => this.capturePhoto());
        document.getElementById('stop-camera').addEventListener('click', () => this.stopCamera());
        document.getElementById('scan-again').addEventListener('click', () => this.scanAgain());
        
        // Event listeners para os itens de frutas
        document.querySelectorAll('.fruit-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const fruitType = e.currentTarget.dataset.fruit;
                this.simulateFruitDetection(fruitType);
            });
        });
    }
    
    setupCanvas() {
        this.canvas = document.getElementById('capture-canvas');
        this.context = this.canvas.getContext('2d');
    }
    
    async startCamera() {
        try {
            const constraints = {
                video: {
                    facingMode: 'environment', // Câmera traseira
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };
            
            this.camera = await navigator.mediaDevices.getUserMedia(constraints);
            const videoElement = document.getElementById('camera-feed');
            videoElement.srcObject = this.camera;
            
            // Atualizar botões
            document.getElementById('start-camera').classList.add('hidden');
            document.getElementById('capture-photo').classList.remove('hidden');
            document.getElementById('stop-camera').classList.remove('hidden');
            
            this.showNotification('Câmera iniciada! Aponte para uma fruta.', 'success');
            
        } catch (error) {
            console.error('Erro ao acessar a câmera:', error);
            this.showNotification('Erro ao acessar a câmera. Verifique as permissões.', 'error');
        }
    }
    
    capturePhoto() {
        const video = document.getElementById('camera-feed');
        
        // Configurar canvas com as dimensões do vídeo
        this.canvas.width = video.videoWidth;
        this.canvas.height = video.videoHeight;
        
        // Capturar frame do vídeo
        this.context.drawImage(video, 0, 0);
        
        // Simular análise da imagem
        this.analyzeImage();
    }
    
    analyzeImage() {
        this.showNotification('Analisando imagem...', 'info');
        
        // Simular tempo de processamento
        setTimeout(() => {
            // Selecionar uma fruta aleatória para demonstração
            const fruitTypes = Object.keys(this.fruits);
            const randomFruit = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
            
            this.displayResult(randomFruit);
        }, 2000);
    }
    
    simulateFruitDetection(fruitType) {
        this.showNotification(`Simulando detecção de ${this.fruits[fruitType].name}...`, 'info');
        
        setTimeout(() => {
            this.displayResult(fruitType);
        }, 1500);
    }
    
    displayResult(fruitType) {
        const fruit = this.fruits[fruitType];
        const qualityScore = Math.floor(Math.random() * 30) + 70; // 70-100%
        
        // Atualizar informações da fruta
        document.getElementById('fruit-icon').className = fruit.icon;
        document.getElementById('fruit-name').textContent = fruit.name;
        
        // Atualizar score de qualidade
        const qualityFill = document.getElementById('quality-fill');
        const qualityPercentage = document.getElementById('quality-percentage');
        
        qualityFill.style.width = qualityScore + '%';
        qualityPercentage.textContent = qualityScore + '%';
        
        // Atualizar características
        const characteristicsList = document.getElementById('fruit-characteristics');
        characteristicsList.innerHTML = '';
        
        fruit.characteristics.forEach(characteristic => {
            const li = document.createElement('li');
            li.textContent = characteristic;
            characteristicsList.appendChild(li);
        });
        
        // Mostrar seção de resultado
        document.getElementById('scanner-section').classList.add('hidden');
        document.getElementById('result-section').classList.remove('hidden');
        
        // Parar câmera
        this.stopCamera();
        
        this.showNotification(`${fruit.name} detectada com ${qualityScore}% de qualidade!`, 'success');
    }
    
    scanAgain() {
        document.getElementById('result-section').classList.add('hidden');
        document.getElementById('scanner-section').classList.remove('hidden');
        
        // Resetar botões
        document.getElementById('start-camera').classList.remove('hidden');
        document.getElementById('capture-photo').classList.add('hidden');
        document.getElementById('stop-camera').classList.add('hidden');
    }
    
    stopCamera() {
        if (this.camera) {
            this.camera.getTracks().forEach(track => track.stop());
            this.camera = null;
            
            const videoElement = document.getElementById('camera-feed');
            videoElement.srcObject = null;
            
            // Atualizar botões
            document.getElementById('start-camera').classList.remove('hidden');
            document.getElementById('capture-photo').classList.add('hidden');
            document.getElementById('stop-camera').classList.add('hidden');
        }
    }
    
    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Adicionar estilos
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '600',
            zIndex: '1001',
            maxWidth: '300px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        // Cores baseadas no tipo
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            info: '#2196F3',
            warning: '#ff9800'
        };
        
        notification.style.background = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Inicializar app quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new QualiVerdeApp();
});

// Service Worker para PWA (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registrado com sucesso:', registration);
            })
            .catch(registrationError => {
                console.log('Falha no registro do SW:', registrationError);
            });
    });
}
