/**
 * Lógica da Calculadora de Cobertura / Telhado
 * Chamada pelo AppRouter quando a view for carregada.
 */

function initCalcCobertura() {
    const form = document.getElementById('cobertura-form');
    const resultBox = document.getElementById('resultado-cobertura');
    const selectTipo = document.getElementById('tipo-telha');
    const campoTelhaPersonalizada = document.getElementById('campo-telha-personalizada');
    
    const resAreaBase = document.getElementById('res-area-base');
    const resAreaInclinada = document.getElementById('res-area-inclinada');
    const resFatorCorrecao = document.getElementById('res-fator-correcao');
    const resQuantidadeTelhas = document.getElementById('res-quantidade-telhas');
    const resDetalheTelhas = document.getElementById('res-detalhe-telhas');
    const cardCumeeira = document.getElementById('card-cumeeira');
    const resQuantidadeCumeeiras = document.getElementById('res-quantidade-cumeeiras');
    const resDetalheCumeeiras = document.getElementById('res-detalhe-cumeeiras');
    
    const checkboxMadeiramento = document.getElementById('calcular-madeiramento');
    const cardMadeiramento = document.getElementById('card-madeiramento');
    const resRipas = document.getElementById('res-ripas');
    const resCaibros = document.getElementById('res-caibros');
    const resTercas = document.getElementById('res-tercas');

    // Exibe/oculta campo de rendimento personalizado
    selectTipo.addEventListener('change', () => {
        const isPersonalizado = selectTipo.value === 'personalizado';
        campoTelhaPersonalizada.style.display = isPersonalizado ? 'block' : 'none';
        
        const inputRendimento = document.getElementById('rendimento-personalizado');
        if (isPersonalizado) {
            inputRendimento.setAttribute('required', '');
        } else {
            inputRendimento.removeAttribute('required');
        }
    });

    form.addEventListener('submit', () => {
        const larguraBase = parseFloat(document.getElementById('largura-base').value);
        const comprimentoBase = parseFloat(document.getElementById('comprimento-base').value);
        const beiral = parseFloat(document.getElementById('beiral').value) || 0;
        const quedas = parseInt(document.getElementById('quedas').value);
        const inclinacaoValor = parseFloat(document.getElementById('inclinacao-valor').value);
        const inclinacaoUnidade = document.getElementById('inclinacao-unidade').value;
        const tipoTelha = selectTipo.value;

        if (isNaN(larguraBase) || isNaN(comprimentoBase) || isNaN(inclinacaoValor)) {
            alert('Preencha os campos obrigatórios corretamente.');
            return;
        }

        // 1. Calcular dimensões totais com beiral
        const larguraTotal = larguraBase + (2 * beiral);
        const comprimentoTotal = comprimentoBase + (2 * beiral);
        const areaBase = larguraTotal * comprimentoTotal;

        // 2. Calcular inclinação real (Fator de Correção)
        let fatorCorrecao = 1;
        let inclinacaoPercentual = 0;

        if (inclinacaoUnidade === 'percentual') {
            inclinacaoPercentual = inclinacaoValor;
            fatorCorrecao = Math.sqrt(1 + Math.pow(inclinacaoPercentual / 100, 2));
        } else {
            // Em graus
            const inclinacaoRad = (inclinacaoValor * Math.PI) / 180;
            fatorCorrecao = 1 / Math.cos(inclinacaoRad);
            // Converter para percentual para cálculos posteriores
            inclinacaoPercentual = Math.tan(inclinacaoRad) * 100;
        }

        // 3. Área inclinada real
        const areaInclinada = areaBase * fatorCorrecao;

        // 4. Quantidade de Telhas
        let quantidadeTelhas = 0;
        let detalheTelhas = '';

        if (tipoTelha === 'romana') {
            quantidadeTelhas = Math.ceil(areaInclinada * 16);
            detalheTelhas = 'Rendimento estimado: 16 telhas por m²';
        } else if (tipoTelha === 'portuguesa') {
            quantidadeTelhas = Math.ceil(areaInclinada * 17);
            detalheTelhas = 'Rendimento estimado: 17 telhas por m²';
        } else if (tipoTelha === 'colonial') {
            quantidadeTelhas = Math.ceil(areaInclinada * 24);
            detalheTelhas = 'Rendimento estimado: 24 telhas por m²';
        } else if (tipoTelha === 'americana') {
            quantidadeTelhas = Math.ceil(areaInclinada * 12.5);
            detalheTelhas = 'Rendimento estimado: 12,5 telhas por m²';
        } else if (tipoTelha === 'fibrocimento-244') {
            // Telha de 2.44 x 1.10. Área nominal: 2.68 m²
            // Área útil considerando sobreposição padrão (20cm longitudinal, 10cm lateral): 2.24m * 1.00m = 2.24 m²
            const areaUtil = 2.24;
            quantidadeTelhas = Math.ceil(areaInclinada / areaUtil);
            detalheTelhas = `Considerando placas de 2.44m x 1.10m com recobrimento (Área útil de ${areaUtil}m² por placa)`;
        } else if (tipoTelha === 'fibrocimento-183') {
            // Telha de 1.83 x 1.10. Área nominal: 2.01 m²
            // Área útil considerando sobreposição padrão (20cm longitudinal, 10cm lateral): 1.63m * 1.00m = 1.63 m²
            const areaUtil = 1.63;
            quantidadeTelhas = Math.ceil(areaInclinada / areaUtil);
            detalheTelhas = `Considerando placas de 1.83m x 1.10m com recobrimento (Área útil de ${areaUtil}m² por placa)`;
        } else if (tipoTelha === 'metalica') {
            quantidadeTelhas = Math.ceil(areaInclinada * 1.05); // Adiciona 5% para sobreposição
            detalheTelhas = 'Estimativa de placas metálicas contínuas (com 5% de margem de transpasse)';
        } else if (tipoTelha === 'personalizado') {
            const rendimentoPers = parseFloat(document.getElementById('rendimento-personalizado').value);
            if (isNaN(rendimentoPers) || rendimentoPers <= 0) {
                alert('Informe um rendimento de telha válido.');
                return;
            }
            quantidadeTelhas = Math.ceil(areaInclinada * rendimentoPers);
            detalheTelhas = `Rendimento personalizado de ${rendimentoPers} telhas por m²`;
        }

        // 5. Calcular Linha de Cumeeira (Ridge) e telhas de cumeeira
        let comprimentoCumeeiraTotal = 0;
        if (quedas === 1) {
            cardCumeeira.style.display = 'none';
        } else {
            cardCumeeira.style.display = 'flex';
            if (quedas === 2) {
                // Telhado de 2 quedas simples: a linha de cume é igual ao comprimento total do telhado
                comprimentoCumeeiraTotal = comprimentoTotal;
            } else if (quedas === 4) {
                // Telhado de 4 quedas: cumeeira horizontal principal + 4 espigões (hips)
                const cumeeiraHorizontal = Math.max(0, comprimentoTotal - larguraTotal);
                // Espigão: hip diagonal no plano 3D
                const semiLargura = larguraTotal / 2;
                const inclinacaoDecimal = inclinacaoPercentual / 100;
                const comprimentoEspigao = Math.sqrt(2 * Math.pow(semiLargura, 2) + Math.pow(semiLargura * inclinacaoDecimal, 2));
                comprimentoCumeeiraTotal = cumeeiraHorizontal + (4 * comprimentoEspigao);
            }

            // Rendimento padrão de telha de cumeeira: ~3 peças por metro linear
            const rendimentoCumeeira = 3;
            const quantidadeCumeeiras = Math.ceil(comprimentoCumeeiraTotal * rendimentoCumeeira);
            
            resQuantidadeCumeeiras.textContent = `${quantidadeCumeeiras} unidades`;
            resDetalheCumeeiras.textContent = `Linha de cume / espigões total: ${comprimentoCumeeiraTotal.toFixed(2)}m (rendimento de 3 p/ metro)`;
        }

        // 6. Estrutura de Madeiramento (Se selecionado)
        if (checkboxMadeiramento.checked) {
            cardMadeiramento.style.display = 'block';

            // Estimativas padrão de consumo linear por m² de área inclinada:
            // Ripa: espaçamento de 32cm (galga) -> ~3.2m por m² de área inclinada
            const linearRipas = areaInclinada * 3.2;
            
            // Caibro: espaçamento de 50cm -> ~2.0m por m² de área inclinada
            const linearCaibros = areaInclinada * 2.0;
            
            // Terça: espaçamento de 1.50m -> ~0.7m por m² de área inclinada
            const linearTercas = areaInclinada * 0.7;

            resRipas.textContent = `${Math.ceil(linearRipas)} metros lineares`;
            resCaibros.textContent = `${Math.ceil(linearCaibros)} metros lineares`;
            resTercas.textContent = `${Math.ceil(linearTercas)} metros lineares`;
        } else {
            cardMadeiramento.style.display = 'none';
        }

        // Exibir resultados textuais
        resAreaBase.textContent = `${areaBase.toFixed(2)} m²`;
        resAreaInclinada.textContent = `${areaInclinada.toFixed(2)} m²`;
        resFatorCorrecao.textContent = fatorCorrecao.toFixed(4);
        resQuantidadeTelhas.textContent = `${quantidadeTelhas} peças`;
        resDetalheTelhas.textContent = detalheTelhas;

        resultBox.style.display = 'block';

        // Animação suave para exibir o resultado
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}
