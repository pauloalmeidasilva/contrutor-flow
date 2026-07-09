function initCalcSapataIsolada() {
    const form = document.getElementById('sapata-isolada-form');
    const resultadoBox = document.getElementById('resultado-sapata-isolada');
    const valorResultado = document.getElementById('valor-resultado-sapata-isolada');
    const infoResultado = document.getElementById('info-resultado-sapata-isolada');
    const btnMateriais = document.getElementById('btn-materiais-sapata-isolada');

    if (!form || !resultadoBox || !valorResultado || !infoResultado || !btnMateriais) {
        return;
    }

    const formatarVolume = (valor) => `${valor.toFixed(3).replace('.', ',')} m³`;

    form.addEventListener('submit', () => {
        const comprimento = parseFloat(document.getElementById('comprimento-sapata-isolada').value);
        const largura = parseFloat(document.getElementById('largura-sapata-isolada').value);
        const altura = parseFloat(document.getElementById('altura-sapata-isolada').value);
        const quantidade = parseFloat(document.getElementById('quantidade-sapata-isolada').value);

        if ([comprimento, largura, altura, quantidade].some((valor) => Number.isNaN(valor) || valor <= 0)) {
            alert('Informe todos os valores corretamente para calcular o volume.');
            return;
        }

        const volumeUnitario = comprimento * largura * altura;
        const volumeTotal = volumeUnitario * quantidade;

        valorResultado.textContent = formatarVolume(volumeTotal);
        infoResultado.textContent = `Volume unitário: ${formatarVolume(volumeUnitario)} • Quantidade: ${quantidade.toLocaleString('pt-BR')} unidade(s)`;

        resultadoBox.style.display = 'block';
        resultadoBox.style.opacity = '0';
        resultadoBox.style.transform = 'translateY(8px)';
        btnMateriais.style.display = 'block';

        requestAnimationFrame(() => {
            resultadoBox.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            resultadoBox.style.opacity = '1';
            resultadoBox.style.transform = 'translateY(0)';
        });
    });
}
