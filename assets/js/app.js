/**
 * Aplicativo Construtor Flow
 * Gerencia o roteamento e carregamento de views (SPA Básica)
 */

class AppRouter {
    constructor() {
        this.contentContainer = document.getElementById('app-content');
        this.loadedScripts = new Set();
        
        // Inicia na home
        this.init();
    }

    init() {
        // Observar eventos de navegação nativa se for adicionar histórico de navegação
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.view) {
                this.loadView(e.state.view, false);
            }
        });

        // Carrega a view inicial
        this.loadView('home');
    }

    /**
     * Carrega uma view HTML dinâmica dentro do container principal
     */
    async loadView(viewName, pushState = true) {
        try {
            // Mostrar estado de loading visual (pode ser melhorado)
            this.contentContainer.innerHTML = '<p style="text-align:center; padding: 40px; color: var(--text-muted)">Carregando...</p>';

            const response = await fetch(`views/${viewName}.html`);
            if (!response.ok) {
                throw new Error('View não encontrada');
            }
            const html = await response.text();
            
            // Injetar HTML
            this.contentContainer.innerHTML = `<div class="view-container">${html}</div>`;

            // Atualiza a URL sem recarregar a página (opcional, para melhor UX)
            if (pushState) {
                window.history.pushState({ view: viewName }, viewName, `#${viewName}`);
            }

            // Carrega dinamicamente o script JS da view (se existir)
            this.loadViewScript(viewName);

        } catch (error) {
            console.error('Erro ao carregar a view:', error);
            this.contentContainer.innerHTML = `
                <div class="card" style="text-align:center;">
                    <h2>Em Construção 🚧</h2>
                    <p>Esta calculadora ainda não está disponível.</p>
                    <button class="btn-primary" style="width: auto; margin-top: 16px;" onclick="app.loadView('home')">Voltar ao Início</button>
                </div>
            `;
        }
    }

    /**
     * Carrega e executa o script específico da view recém-carregada
     */
    loadViewScript(viewName) {
        // Se já carregamos, não carregar novamente, a menos que precisemos reinicializar.
        // Para simplicidade, vamos permitir que as views chamem uma função global de inicialização
        
        const scriptUrl = `assets/js/calculators/${viewName}.js`;
        
        // Verifica se já existe a tag no documento
        const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
        
        if (!existingScript) {
            const script = document.createElement('script');
            script.src = scriptUrl;
            script.onload = () => {
                // Se o script tiver uma função init[ViewName], nós a chamamos
                this.initViewLogic(viewName);
            };
            document.body.appendChild(script);
        } else {
            // Se já existia, apenas chamamos o init novamente para configurar os eventos da nova DOM
            this.initViewLogic(viewName);
        }
    }

    initViewLogic(viewName) {
        // Ex: para 'calc-tijolos', chamará 'initCalcTijolos()' globalmente
        const functionName = 'init' + viewName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
        if (typeof window[functionName] === 'function') {
            window[functionName]();
        }
    }
}

// Inicializa a aplicação quando o DOM estiver pronto
const app = new AppRouter();
window.app = app; // Expõe globalmente para os botões do menu
