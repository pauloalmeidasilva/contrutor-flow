/**
 * Lógica da Calculadora de Tinta
 * Chamada pelo AppRouter quando a view for carregada.
 */

function initCalcTinta() {
    const form = document.getElementById('tinta-form');
    const resultBox = document.getElementById('resultado-tinta');
    const selectTipo = document.getElementById('tipo-tinta');
    const campoTintaPersonalizado = document.getElementById('campo-tinta-personalizado');
    
    const resAreaBruta = document.getElementById('res-area-bruta');
    const resAreaDescontos = document.getElementById('res-area-descontos');
    const resAreaLiquida = document.getElementById('res-area-liquida');
    const resLitrosTinta = document.getElementById('res-litros-tinta');
    const containerSugestao = document.getElementById('sugestao-embalagem-tinta');
    
    const checkboxSelador = document.getElementById('calcular-selador');
    const cardSelador = document.getElementById('card-selador');
    const resQuantidadeSelador = document.getElementById('res-quantidade-selador');
    
    const checkboxMassa = document.getElementById('calcular-massa');
    const cardMassa = document.getElementById('card-massa');
    const resQuantidadeMassa = document.getElementById('res-quantidade-massa');

    // Exibe/oculta campo de rendimento personalizado
    selectTipo.addEventListener('change', () => {
        const isPersonalizado = selectTipo.value === 'personalizado';
        campoTintaPersonalizado.style.display = isPersonalizado ? 'block' : 'none';
        
        const inputRendimento = document.getElementById('rendimento-tinta-personalizado');
        if (isPersonalizado) {
            inputRendimento.setAttribute('required', '');
        } else {
            inputRendimento.removeAttribute('required');
        }
    });

    form.addEventListener('submit', () => {
        const larguraParedes = parseFloat(document.getElementById('largura-paredes').value);
        const alturaParedes = parseFloat(document.getElementById('altura-paredes').value);
        const areaTeto = parseFloat(document.getElementById('area-teto').value) || 0;
        const demaos = parseInt(document.getElementById('demaos').value);
        
        const qtdPortas = parseInt(document.getElementById('qtd-portas').value) || 0;
        const qtdJanelas = parseInt(document.getElementById('qtd-janelas').value) || 0;
        const descontoManual = parseFloat(document.getElementById('desconto-manual').value) || 0;
        
        const tipoTinta = selectTipo.value;

        if (isNaN(larguraParedes) || isNaN(alturaParedes)) {
            alert('Preencha os campos obrigatórios corretamente.');
            return;
        }

        // 1. Calcular área bruta
        const areaParedes = larguraParedes * alturaParedes;
        const areaBrutaTotal = areaParedes + areaTeto;

        // 2. Calcular vãos e descontos
        // Porta padrão ~ 1.6m² (0.80 x 2.10)
        // Janela padrão ~ 2.0m² (1.50 x 1.20)
        const areaDescontoVaos = (qtdPortas * 1.6) + (qtdJanelas * 2.0) + descontoManual;

        // 3. Área líquida
        let areaLiquida = areaBrutaTotal - areaDescontoVaos;
        if (areaLiquida <= 0) {
            alert('A área de desconto é maior ou igual à área total a pintar! Verifique as dimensões.');
            return;
        }

        // 4. Descobrir rendimento
        let rendimentoPorLitro = 10; // padrão standard
        if (tipoTinta === 'premium') {
            rendimentoPorLitro = 12;
        } else if (tipoTinta === 'economica') {
            rendimentoPorLitro = 8;
        } else if (tipoTinta === 'personalizado') {
            rendimentoPorLitro = parseFloat(document.getElementById('rendimento-tinta-personalizado').value);
            if (isNaN(rendimentoPorLitro) || rendimentoPorLitro <= 0) {
                alert('Informe um rendimento de tinta válido.');
                return;
            }
        }

        // 5. Litros totais de tinta necessários (incluindo margem de 5% para perdas/resíduos)
        const litrosTintaBruto = (areaLiquida * demaos) / rendimentoPorLitro;
        const litrosTintaNecessarios = litrosTintaBruto * 1.05;

        // 6. Otimização de Embalagens
        const recomendacao = getBestPaintCombination(litrosTintaNecessarios);
        
        // Renderizar sugestão de embalagens
        containerSugestao.innerHTML = '';
        
        let htmlEmbalagens = '';
        if (recomendacao.combo.cans18 > 0) {
            htmlEmbalagens += `
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
                    <div>
                        <strong style="color: var(--text-main);">${recomendacao.combo.cans18}x Lata(s) de 18 Litros</strong>
                        <p style="font-size: 0.8rem; color: var(--text-muted);">Ideal para grandes áreas</p>
                    </div>
                </div>
            `;
        }
        if (recomendacao.combo.gallons36 > 0) {
            htmlEmbalagens += `
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
                    <div>
                        <strong style="color: var(--text-main);">${recomendacao.combo.gallons36}x Galão(ões) de 3,6 Litros</strong>
                        <p style="font-size: 0.8rem; color: var(--text-muted);">Ideal para complemento ou áreas médias</p>
                    </div>
                </div>
            `;
        }
        if (recomendacao.combo.quarts09 > 0) {
            htmlEmbalagens += `
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
                    <div>
                        <strong style="color: var(--text-main);">${recomendacao.combo.quarts09}x Quarto(s) de 0,9 Litros</strong>
                        <p style="font-size: 0.8rem; color: var(--text-muted);">Ideal para pequenos retoques</p>
                    </div>
                </div>
            `;
        }

        containerSugestao.innerHTML = htmlEmbalagens || `
            <p style="font-size: 0.9rem; color: var(--text-muted);">Volume muito baixo. Compre frações menores se disponíveis.</p>
        `;

        // 7. Selador Acrílico (Se marcado)
        if (checkboxSelador.checked) {
            cardSelador.style.display = 'flex';
            // Selador normalmente aplicado em 1 demão. Rendimento médio de 10m²/L
            const litrosSelador = Math.ceil(areaLiquida / 10);
            
            // Sugere em latas e galões
            if (litrosSelador >= 18) {
                const latas = Math.floor(litrosSelador / 18);
                const resto = litrosSelador % 18;
                const galoes = Math.ceil(resto / 3.6);
                resQuantidadeSelador.textContent = `${litrosSelador}L (~${latas} Lata(s) de 18L e ${galoes} Galão(ões) de 3.6L)`;
            } else {
                const galoes = Math.ceil(litrosSelador / 3.6);
                resQuantidadeSelador.textContent = `${litrosSelador}L (~${galoes} Galão(ões) de 3.6L)`;
            }
        } else {
            cardSelador.style.display = 'none';
        }

        // 8. Massa Corrida (Se marcado)
        if (checkboxMassa.checked) {
            cardMassa.style.display = 'flex';
            // Consumo de massa corrida é por peso (kg). Cerca de 1.5kg por m² para correção de duas demãos.
            const kgMassa = Math.ceil(areaLiquida * 1.5);
            
            // Geralmente vendida em barricas/latas de 25kg ou galões de 5.7kg
            if (kgMassa >= 25) {
                const barricas = Math.floor(kgMassa / 25);
                const resto = kgMassa % 25;
                const galoes = Math.ceil(resto / 5.7);
                resQuantidadeMassa.textContent = `${kgMassa} kg (~${barricas} Caixa/Barrica(s) de 25kg e ${galoes} Galão(ões) de 5.7kg)`;
            } else {
                const galoes = Math.ceil(kgMassa / 5.7);
                resQuantidadeMassa.textContent = `${kgMassa} kg (~${galoes} Galão(ões) de 5.7kg)`;
            }
        } else {
            cardMassa.style.display = 'none';
        }

        // 9. Exibir resultados textuais
        resAreaBruta.textContent = `${areaBrutaTotal.toFixed(2)} m²`;
        resAreaDescontos.textContent = `${areaDescontoVaos.toFixed(2)} m²`;
        resAreaLiquida.textContent = `${areaLiquida.toFixed(2)} m²`;
        resLitrosTinta.textContent = litrosTintaNecessarios.toFixed(1);

        resultBox.style.display = 'block';

        // Rolagem suave até o resultado
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

/**
 * Retorna a melhor combinação de embalagens (18L, 3.6L, 0.9L) para suprir a demanda.
 */
function getBestPaintCombination(litersNeeded) {
    let minVolume = Infinity;
    let bestCombo = { cans18: 0, gallons36: 0, quarts09: 0 };
    
    const maxCans18 = Math.ceil(litersNeeded / 18) + 1;
    const maxGallons36 = Math.ceil(litersNeeded / 3.6) + 1;
    const maxQuarts09 = Math.ceil(litersNeeded / 0.9) + 1;
    
    for (let c18 = 0; c18 <= maxCans18; c18++) {
        for (let c36 = 0; c36 <= Math.min(5, maxGallons36); c36++) {
            for (let c09 = 0; c09 <= Math.min(4, maxQuarts09); c09++) {
                const currentVol = (c18 * 18) + (c36 * 3.6) + (c09 * 0.9);
                if (currentVol >= litersNeeded && currentVol < minVolume) {
                    minVolume = currentVol;
                    bestCombo = { cans18: c18, gallons36: c36, quarts09: c09 };
                }
            }
        }
    }
    return { combo: bestCombo, totalVolume: minVolume };
}
