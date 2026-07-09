function initCalcArea() {
    const form = document.getElementById('area-form');
    const tipoArea = document.getElementById('tipo-area');
    const grupoDimB = document.getElementById('grupo-dim-b');
    const labelDimA = document.getElementById('label-dim-a');
    const labelDimB = document.getElementById('label-dim-b');
    const inputDimA = document.getElementById('dim-a');
    const inputDimB = document.getElementById('dim-b');

    const resultado = document.getElementById('resultado-area');
    const resAreaTotal = document.getElementById('res-area-total');
    const resAreaDetalhe = document.getElementById('res-area-detalhe');
    const resAreaMargem = document.getElementById('res-area-margem');

    if (!form || !tipoArea || !grupoDimB || !labelDimA || !labelDimB || !inputDimA || !inputDimB ||
        !resultado || !resAreaTotal || !resAreaDetalhe || !resAreaMargem) {
        return;
    }

    function atualizarCamposPorTipo() {
        const tipo = tipoArea.value;

        if (tipo === 'retangulo') {
            labelDimA.textContent = 'Comprimento (m)';
            labelDimB.textContent = 'Largura (m)';
            inputDimA.placeholder = 'Ex: 5.00';
            inputDimB.placeholder = 'Ex: 3.50';
            grupoDimB.style.display = 'block';
            inputDimB.required = true;
            return;
        }

        if (tipo === 'triangulo') {
            labelDimA.textContent = 'Base (m)';
            labelDimB.textContent = 'Altura (m)';
            inputDimA.placeholder = 'Ex: 4.00';
            inputDimB.placeholder = 'Ex: 2.50';
            grupoDimB.style.display = 'block';
            inputDimB.required = true;
            return;
        }

        labelDimA.textContent = 'Raio (m)';
        inputDimA.placeholder = 'Ex: 1.20';
        grupoDimB.style.display = 'none';
        inputDimB.required = false;
    }

    function formatarM2(valor) {
        return `${valor.toFixed(2).replace('.', ',')} m²`;
    }

    tipoArea.addEventListener('change', atualizarCamposPorTipo);

    form.addEventListener('submit', () => {
        const tipo = tipoArea.value;
        const dimA = parseFloat(inputDimA.value);
        const dimB = parseFloat(inputDimB.value);
        const quantidade = parseInt(document.getElementById('qtde-area').value, 10);
        const margemPercent = parseFloat(document.getElementById('margem-area').value);

        if (Number.isNaN(dimA) || dimA <= 0 || Number.isNaN(quantidade) || quantidade <= 0 || Number.isNaN(margemPercent) || margemPercent < 0) {
            alert('Preencha os campos com valores válidos.');
            return;
        }

        let areaUnitaria = 0;
        let formulaTexto = '';

        if (tipo === 'retangulo') {
            if (Number.isNaN(dimB) || dimB <= 0) {
                alert('Informe a largura corretamente.');
                return;
            }
            areaUnitaria = dimA * dimB;
            formulaTexto = `Fórmula: comprimento x largura = ${dimA.toFixed(2).replace('.', ',')} x ${dimB.toFixed(2).replace('.', ',')}`;
        } else if (tipo === 'triangulo') {
            if (Number.isNaN(dimB) || dimB <= 0) {
                alert('Informe a altura corretamente.');
                return;
            }
            areaUnitaria = (dimA * dimB) / 2;
            formulaTexto = `Fórmula: (base x altura) / 2 = (${dimA.toFixed(2).replace('.', ',')} x ${dimB.toFixed(2).replace('.', ',')}) / 2`;
        } else {
            areaUnitaria = Math.PI * dimA * dimA;
            formulaTexto = `Fórmula: pi x raio² = 3,1416 x ${dimA.toFixed(2).replace('.', ',')}²`;
        }

        const areaTotal = areaUnitaria * quantidade;
        const areaComMargem = areaTotal * (1 + (margemPercent / 100));

        resAreaTotal.textContent = formatarM2(areaTotal);
        resAreaDetalhe.textContent = `${formulaTexto} | Quantidade: ${quantidade}`;
        resAreaMargem.textContent = margemPercent > 0
            ? `Com margem de ${margemPercent.toFixed(1).replace('.', ',')}%: ${formatarM2(areaComMargem)}`
            : 'Sem margem adicional aplicada.';

        resultado.classList.add('active');
        resAreaTotal.style.transition = 'transform 0.2s ease';
        resAreaTotal.style.transform = 'scale(1.08)';
        setTimeout(() => {
            resAreaTotal.style.transform = 'scale(1)';
        }, 200);
    });

    atualizarCamposPorTipo();
}
