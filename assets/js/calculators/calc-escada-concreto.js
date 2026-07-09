function initCalcEscadaConcreto() {
    const form = document.getElementById('escada-concreto-form');
    const resultado = document.getElementById('resultado-escada-concreto');
    const resVolume = document.getElementById('res-volume-escada-concreto');
    const resDetalhe = document.getElementById('res-detalhe-escada-concreto');

    if (!form || !resultado || !resVolume || !resDetalhe) {
        return;
    }

    form.addEventListener('submit', () => {
        const numDegraus = parseFloat(document.getElementById('num-degraus-concreto').value);
        const pisoCm = parseFloat(document.getElementById('piso-escada-concreto').value);
        const espelhoCm = parseFloat(document.getElementById('espelho-escada-concreto').value);
        const larguraM = parseFloat(document.getElementById('largura-escada-concreto').value);

        if ([numDegraus, pisoCm, espelhoCm, larguraM].some((valor) => Number.isNaN(valor) || valor <= 0)) {
            alert('Preencha os campos com valores válidos para calcular o volume.');
            return;
        }

        const pisoM = pisoCm / 100;
        const espelhoM = espelhoCm / 100;

        const volumeM3 = numDegraus * pisoM * espelhoM * larguraM;

        resVolume.textContent = `${volumeM3.toFixed(3).replace('.', ',')} m³`;
        resDetalhe.textContent = `Cálculo: ${numDegraus.toLocaleString('pt-BR')} × ${pisoM.toFixed(3).replace('.', ',')} × ${espelhoM.toFixed(3).replace('.', ',')} × ${larguraM.toFixed(2).replace('.', ',')} = ${volumeM3.toFixed(3).replace('.', ',')} m³`;

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
