function initCalcDegrausEscada() {
    const form = document.getElementById('degraus-escada-form');
    const resultado = document.getElementById('resultado-degraus-escada');
    const resPrincipal = document.getElementById('res-degraus-principal');
    const resDetalhe = document.getElementById('res-degraus-detalhe');
    const resConforto = document.getElementById('res-degraus-conforto');

    if (!form || !resultado || !resPrincipal || !resDetalhe || !resConforto) {
        return;
    }

    form.addEventListener('submit', () => {
        const alturaTotalM = parseFloat(document.getElementById('altura-total-escada').value);
        const comprimentoEscadaM = parseFloat(document.getElementById('comprimento-escada').value);

        if ([alturaTotalM, comprimentoEscadaM].some((valor) => Number.isNaN(valor) || valor <= 0)) {
            alert('Informe valores válidos para altura e comprimento da escada.');
            return;
        }

        const alturaTotalCm = alturaTotalM * 100;
        const comprimentoEscadaCm = comprimentoEscadaM * 100;

        // Busca a quantidade de degraus que melhor aproxima 2E + P de 63 cm.
        let melhorOpcao = null;
        for (let degraus = 2; degraus <= 60; degraus += 1) {
            const espelhoCm = alturaTotalCm / degraus;
            const pisoCm = comprimentoEscadaCm / (degraus - 1);
            const blondel = (2 * espelhoCm) + pisoCm;

            let penalidade = Math.abs(blondel - 63);
            if (espelhoCm < 14 || espelhoCm > 20) {
                penalidade += 5;
            }
            if (pisoCm < 24 || pisoCm > 32) {
                penalidade += 5;
            }

            if (!melhorOpcao || penalidade < melhorOpcao.penalidade) {
                melhorOpcao = {
                    degraus,
                    espelhoCm,
                    pisoCm,
                    blondel,
                    penalidade,
                };
            }
        }

        if (!melhorOpcao) {
            alert('Não foi possível calcular os degraus com os dados informados.');
            return;
        }

        const numeroDegraus = melhorOpcao.degraus;
        const espelhoRealCm = melhorOpcao.espelhoCm;
        const pisoRealCm = melhorOpcao.pisoCm;
        const blondelValor = melhorOpcao.blondel;
        const pisoMinCm = 62 - (2 * espelhoRealCm);
        const pisoMaxCm = 64 - (2 * espelhoRealCm);

        const statusConforto = (blondelValor >= 62 && blondelValor <= 64)
            ? 'Dimensionamento em faixa confortável de Blondel (62 a 64 cm).'
            : 'Resultado fora da faixa ideal de Blondel. Avalie ajustar altura ou comprimento do lance.';

        resPrincipal.textContent = `${numeroDegraus} degraus`;
        resDetalhe.textContent = `Espelho: ${espelhoRealCm.toFixed(1).replace('.', ',')} cm | Piso: ${pisoRealCm.toFixed(1).replace('.', ',')} cm | 2E + P: ${blondelValor.toFixed(1).replace('.', ',')} cm`;
        resConforto.textContent = `Faixa de piso recomendada para este espelho: ${pisoMinCm.toFixed(1).replace('.', ',')} cm a ${pisoMaxCm.toFixed(1).replace('.', ',')} cm. ${statusConforto}`;

        resultado.style.display = 'block';
        resultado.style.opacity = '0';
        resultado.style.transform = 'translateY(8px)';
        requestAnimationFrame(() => {
            resultado.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            resultado.style.opacity = '1';
            resultado.style.transform = 'translateY(0)';
        });
    });
}
