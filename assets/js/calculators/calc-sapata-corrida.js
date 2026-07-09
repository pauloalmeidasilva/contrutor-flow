function initCalcSapataCorrida() {
    const form = document.getElementById('sapata-corrida-form');
    const resultadoBox = document.getElementById('resultado-sapata-corrida');
    const valorResultado = document.getElementById('valor-resultado-sapata-corrida');
    const infoResultado = document.getElementById('info-resultado-sapata-corrida');
    const btnTraco = document.getElementById('btn-traco-sapata-corrida');

    if (!form || !resultadoBox || !valorResultado || !infoResultado || !btnTraco) {
        return;
    }

    const formatarVolume = (valor) => `${valor.toFixed(3).replace('.', ',')} m³`;

    form.addEventListener('submit', () => {
        const comprimento = parseFloat(document.getElementById('comprimento-sapata-corrida').value);
        const largura = parseFloat(document.getElementById('largura-sapata-corrida').value);
        const altura = parseFloat(document.getElementById('altura-sapata-corrida').value);

        if ([comprimento, largura, altura].some((valor) => Number.isNaN(valor) || valor <= 0)) {
            alert('Informe todos os valores corretamente para calcular o volume.');
            return;
        }

        const volume = comprimento * largura * altura;

        valorResultado.textContent = formatarVolume(volume);
        infoResultado.textContent = `Dimensões: ${comprimento.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} x ${largura.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} x ${altura.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m`;

        resultadoBox.style.display = 'block';
        resultadoBox.style.opacity = '0';
        resultadoBox.style.transform = 'translateY(8px)';
        btnTraco.style.display = 'block';

        requestAnimationFrame(() => {
            resultadoBox.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            resultadoBox.style.opacity = '1';
            resultadoBox.style.transform = 'translateY(0)';
        });
    });
}
