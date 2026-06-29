/**
 * Lógica da Calculadora de Tijolos
 * Chamada pelo AppRouter quando a view for carregada.
 */

function initCalcTijolos() {
    const form = document.getElementById('tijolos-form');
    const resultBox = document.getElementById('resultado-tijolos');
    const resultValue = document.getElementById('valor-resultado-tijolos');
    const selectTipo = document.getElementById('tipo-tijolo');
    const camposPersonalizados = document.getElementById('campos-personalizados');

    // Dimensões em cm: altura x largura x comprimento
    // Rendimento por m² calculado com junta de argamassa de ~1cm
    const dimensoesBlocos = {
        '6-furos':          { altura: 14, comprimento: 19 }, // assentado deitado (de face)
        '8-furos':          { altura: 19, comprimento: 19 },
        'bloco-concreto-10':{ altura: 9, comprimento: 39 },
        'bloco-concreto-15':{ altura: 14, comprimento: 39 },
        'bloco-concreto-20':{ altura: 19, comprimento: 39 },
    };

    // Exibe/oculta os campos personalizados ao mudar o select
    selectTipo.addEventListener('change', () => {
        const isPersonalizado = selectTipo.value === 'personalizado';
        camposPersonalizados.style.display = isPersonalizado ? 'block' : 'none';

        // Adiciona/remove o atributo 'required' dinamicamente
        const inputsPersonalizados = camposPersonalizados.querySelectorAll('input');
        inputsPersonalizados.forEach(input => {
            if (isPersonalizado) {
                input.setAttribute('required', '');
            } else {
                input.removeAttribute('required');
            }
        });
    });

    form.addEventListener('submit', () => {
        const larguraParede = parseFloat(document.getElementById('largura-parede').value);
        const alturaParede = parseFloat(document.getElementById('altura-parede').value);
        const tipoTijolo = selectTipo.value;

        if (isNaN(larguraParede) || isNaN(alturaParede) || !tipoTijolo) {
            alert('Preencha todos os campos corretamente.');
            return;
        }

        let alturaBloco, comprimentoBloco;

        if (tipoTijolo === 'personalizado') {
            alturaBloco = parseFloat(document.getElementById('bloco-altura').value);
            const larguraBloco = parseFloat(document.getElementById('bloco-largura').value);
            comprimentoBloco = parseFloat(document.getElementById('bloco-comprimento').value);

            if (isNaN(alturaBloco) || isNaN(larguraBloco) || isNaN(comprimentoBloco) ||
                alturaBloco <= 0 || larguraBloco <= 0 || comprimentoBloco <= 0) {
                alert('Informe as dimensões do bloco personalizado corretamente (valores maiores que zero).');
                return;
            }
        } else {
            alturaBloco = dimensoesBlocos[tipoTijolo].altura;
            comprimentoBloco = dimensoesBlocos[tipoTijolo].comprimento;
        }

        // Calcular rendimento: quantos blocos cabem por m²
        // Considerando 1cm de junta de argamassa horizontal e vertical
        const juntas = 1; // cm
        const alturaComJunta = (alturaBloco + juntas) / 100; // converte para metros
        const comprimentoComJunta = (comprimentoBloco + juntas) / 100;

        const blocosPorM2 = 1 / (alturaComJunta * comprimentoComJunta);

        // 1. Calcular a área da parede
        const areaParede = larguraParede * alturaParede;

        // 2. Calcular qtde base e adicionar margem de 10%
        const totalComMargem = Math.ceil(areaParede * blocosPorM2 * 1.10);

        // Exibir o resultado
        resultValue.textContent = `${totalComMargem} unidades`;
        resultBox.classList.add('active');

        // Animação de destaque
        resultValue.style.transition = 'transform 0.2s ease';
        resultValue.style.transform = 'scale(1.1)';
        setTimeout(() => {
            resultValue.style.transform = 'scale(1)';
        }, 200);
    });
}
