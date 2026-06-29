/**
 * Calculadora de Concreto — Traço e Materiais
 *
 * Consumo por m³ de concreto (traço em volume 1:A:B):
 *   - Fórmula baseada em densidade aparente dos materiais (método ABNT prático)
 *   - Cimento: dc = 1.450 kg/m³ | Areia: da = 1.500 kg/m³ | Brita: db = 1.550 kg/m³
 *   - Coeficiente de empolamento/rendimento ke = 0,65
 *   - consumo_cimento_kg = (1 / (1 + A*(dc/da) + B*(dc/db))) * (1/ke) * dc
 */

function initCalcConcreto() {

    // Traços pré-definidos: consumo por 1m³ de concreto já calculado
    // (valores de referência amplamente usados no Brasil)
    const tracosPreDefinidos = {
        '1:1:2':    { cimento: 550, areia: 0.50, brita: 0.48, label: '1 : 1 : 2' },
        '1:1.5:2.5':{ cimento: 440, areia: 0.63, brita: 0.68, label: '1 : 1,5 : 2,5' },
        '1:2:3':    { cimento: 360, areia: 0.72, brita: 0.87, label: '1 : 2 : 3' },
        '1:2:4':    { cimento: 310, areia: 0.72, brita: 0.96, label: '1 : 2 : 4' },
        '1:3:3':    { cimento: 290, areia: 0.83, brita: 0.78, label: '1 : 3 : 3' },
    };

    // Densidades para traço personalizado (kg/m³)
    const DC = 1450; // cimento
    const DA = 1500; // areia
    const DB = 1550; // brita
    const KE = 0.65; // coeficiente de rendimento

    const selectTraco = document.getElementById('traco-select');
    const camposCustom = document.getElementById('campos-traco-custom');
    const btnCalcular = document.getElementById('btn-calcular-concreto');
    const resultadoBox = document.getElementById('resultado-materiais');
    const placeholder = document.getElementById('placeholder-resultado');

    // ── Exibe/oculta campos de traço personalizado ────────────────────────
    selectTraco.addEventListener('change', () => {
        camposCustom.style.display = selectTraco.value === 'personalizado' ? 'block' : 'none';
    });

    // ── Evento: Calcular ──────────────────────────────────────────────────
    btnCalcular.addEventListener('click', () => {
        const volume = parseFloat(document.getElementById('volume-concreto').value);
        const traco = selectTraco.value;

        if (isNaN(volume) || volume <= 0) {
            alert('Informe o volume de concreto em m³ (ex: 1.500).');
            return;
        }

        if (!traco) {
            alert('Selecione o traço desejado.');
            return;
        }

        let consumoCimentoKg, consumoAreia_m3, consumoBrita_m3, tracoLabel;

        if (traco === 'personalizado') {
            const parteCimento = parseFloat(document.getElementById('traco-cimento').value);
            const parteAreia   = parseFloat(document.getElementById('traco-areia').value);
            const parteBrita   = parseFloat(document.getElementById('traco-brita').value);

            if (isNaN(parteCimento) || isNaN(parteAreia) || isNaN(parteBrita) ||
                parteCimento <= 0 || parteAreia <= 0 || parteBrita <= 0) {
                alert('Informe as partes do traço personalizado corretamente.');
                return;
            }

            // Fórmula de consumo por m³
            const A = parteAreia / parteCimento;
            const B = parteBrita / parteCimento;
            consumoCimentoKg = DC / ((1 + A * (DC / DA) + B * (DC / DB)) * KE);
            consumoAreia_m3  = (consumoCimentoKg * A) / DA;
            consumoBrita_m3  = (consumoCimentoKg * B) / DB;
            tracoLabel = `${parteCimento} : ${parteAreia} : ${parteBrita} (personalizado)`;

        } else {
            const dados = tracosPreDefinidos[traco];
            consumoCimentoKg = dados.cimento;
            consumoAreia_m3  = dados.areia;
            consumoBrita_m3  = dados.brita;
            tracoLabel = dados.label;
        }

        // ── Calcula total com margem de 10% ───────────────────────────────
        const margem = 1.10;

        const totalCimentoKg   = consumoCimentoKg * volume * margem;
        const totalAreia_m3    = consumoAreia_m3  * volume * margem;
        const totalBrita_m3    = consumoBrita_m3  * volume * margem;

        const sacosInteiros = Math.ceil(totalCimentoKg / 50);
        const kgRestante    = sacosInteiros * 50;

        // ── Exibe os resultados ────────────────────────────────────────────
        document.getElementById('traco-utilizado').textContent = `Traço ${tracoLabel}`;
        document.getElementById('volume-utilizado').textContent =
            `${volume.toFixed(3).replace('.', ',')} m³`;

        // Cimento
        document.getElementById('res-cimento-sacos').textContent =
            `${sacosInteiros} sacos de 50 kg`;
        document.getElementById('res-cimento-kg').textContent =
            `≈ ${Math.round(totalCimentoKg)} kg necessários`;

        // Areia
        document.getElementById('res-areia-m3').textContent =
            `${totalAreia_m3.toFixed(2).replace('.', ',')} m³`;
        document.getElementById('res-areia-kg').textContent =
            `≈ ${Math.round(totalAreia_m3 * DA).toLocaleString('pt-BR')} kg`;

        // Brita
        document.getElementById('res-brita-m3').textContent =
            `${totalBrita_m3.toFixed(2).replace('.', ',')} m³`;
        document.getElementById('res-brita-kg').textContent =
            `≈ ${Math.round(totalBrita_m3 * DB).toLocaleString('pt-BR')} kg`;

        // Animação de exibição
        placeholder.style.display = 'none';
        resultadoBox.style.display = 'block';
        resultadoBox.style.opacity = '0';
        resultadoBox.style.transform = 'translateY(8px)';
        requestAnimationFrame(() => {
            resultadoBox.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            resultadoBox.style.opacity = '1';
            resultadoBox.style.transform = 'translateY(0)';
        });
    });
}
