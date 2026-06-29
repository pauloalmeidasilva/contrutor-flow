/**
 * Lógica da Calculadora de Pisos
 * Gerencia a lista de ambientes e calcula o total de peças necessárias.
 */

function initCalcPiso() {
    // Estado local
    let ambientes = [];
    let proximoId = 1;

    // Dimensões das peças padrão em cm
    const pecasPadrao = {
        '30x30':   { comp: 30,  larg: 30 },
        '45x45':   { comp: 45,  larg: 45 },
        '60x60':   { comp: 60,  larg: 60 },
        '60x120':  { comp: 60,  larg: 120 },
        '80x80':   { comp: 80,  larg: 80 },
        '90x90':   { comp: 90,  larg: 90 },
    };

    // Referências DOM
    const form = document.getElementById('piso-form');
    const selectPeca = document.getElementById('peca-piso');
    const camposPersonalizados = document.getElementById('campos-peca-personalizada');
    const tbody = document.getElementById('tbody-piso');
    const tabela = document.getElementById('tabela-piso');
    const listaVazia = document.getElementById('lista-vazia-piso');
    const badgeCount = document.getElementById('badge-count-piso');
    const btnCalcular = document.getElementById('btn-calcular-piso');
    const resultadoBox = document.getElementById('resultado-piso');
    const valorAreaTotal = document.getElementById('valor-area-total');
    const valorPecasTotal = document.getElementById('valor-pecas-total');
    const infoResultado = document.getElementById('info-resultado-piso');

    // ── Exibe/oculta campos de peça personalizada ─────────────────────────
    selectPeca.addEventListener('change', () => {
        const isPersonalizado = selectPeca.value === 'personalizado';
        camposPersonalizados.style.display = isPersonalizado ? 'block' : 'none';
        camposPersonalizados.querySelectorAll('input').forEach(input => {
            isPersonalizado ? input.setAttribute('required', '') : input.removeAttribute('required');
        });
    });

    // ── Evento: Adicionar ambiente ────────────────────────────────────────
    form.addEventListener('submit', () => {
        const nome = document.getElementById('nome-ambiente').value.trim();
        const comprimento = parseFloat(document.getElementById('comprimento-amb').value);
        const largura = parseFloat(document.getElementById('largura-amb').value);
        const tipoPeca = selectPeca.value;

        if (!nome || isNaN(comprimento) || isNaN(largura) || !tipoPeca) {
            alert('Preencha todos os campos corretamente.');
            return;
        }

        let pecaComp, pecaLarg, pecaLabel;

        if (tipoPeca === 'personalizado') {
            pecaComp = parseFloat(document.getElementById('peca-comp-custom').value);
            pecaLarg = parseFloat(document.getElementById('peca-larg-custom').value);

            if (isNaN(pecaComp) || isNaN(pecaLarg) || pecaComp <= 0 || pecaLarg <= 0) {
                alert('Informe as dimensões da peça personalizada corretamente.');
                return;
            }
            pecaLabel = `${pecaComp}×${pecaLarg} cm`;
        } else {
            pecaComp = pecasPadrao[tipoPeca].comp;
            pecaLarg = pecasPadrao[tipoPeca].larg;
            pecaLabel = `${tipoPeca} cm`;
        }

        const areaAmbiente = comprimento * largura;
        // Área da peça em m²
        const areaPeca = (pecaComp / 100) * (pecaLarg / 100);
        // Peças necessárias sem margem
        const pecasBase = areaAmbiente / areaPeca;

        const ambiente = {
            id: proximoId++,
            nome,
            comprimento,
            largura,
            areaAmbiente,
            pecaLabel,
            areaPeca,
            pecasBase,
        };

        ambientes.push(ambiente);
        renderizarTabela();
        form.reset();
        camposPersonalizados.style.display = 'none';
    });

    // ── Evento: Calcular o total ──────────────────────────────────────────
    btnCalcular.addEventListener('click', () => {
        const areaTotal = ambientes.reduce((acc, a) => acc + a.areaAmbiente, 0);
        const pecasTotalBruto = ambientes.reduce((acc, a) => acc + a.pecasBase, 0);
        const pecasComMargem = Math.ceil(pecasTotalBruto * 1.10);

        valorAreaTotal.textContent = `${areaTotal.toFixed(2).replace('.', ',')} m²`;
        valorPecasTotal.textContent = `${pecasComMargem} peças`;
        infoResultado.textContent = `Já inclui 10% de margem para cortes e quebras. Área total: ${areaTotal.toFixed(2).replace('.', ',')} m².`;
        resultadoBox.classList.add('active');

        valorPecasTotal.style.transition = 'transform 0.2s ease';
        valorPecasTotal.style.transform = 'scale(1.1)';
        setTimeout(() => valorPecasTotal.style.transform = 'scale(1)', 200);
    });

    // ── Renderizar tabela ─────────────────────────────────────────────────
    function renderizarTabela() {
        tbody.innerHTML = '';

        ambientes.forEach(amb => {
            const tr = document.createElement('tr');
            tr.classList.add('tr-linha');
            tr.innerHTML = `
                <td class="td">${amb.nome}</td>
                <td class="td" style="font-weight: 600;">${amb.areaAmbiente.toFixed(2).replace('.', ',')} m²</td>
                <td class="td td-dim">${amb.pecaLabel}</td>
                <td class="td">${Math.ceil(amb.pecasBase)} un</td>
                <td class="td" style="text-align: center;">
                    <button class="btn-remover" data-id="${amb.id}" title="Remover">✕</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll('.btn-remover').forEach(btn => {
            btn.addEventListener('click', () => removerAmbiente(parseInt(btn.dataset.id)));
        });

        atualizarUI();
    }

    // ── Remover ambiente ──────────────────────────────────────────────────
    function removerAmbiente(id) {
        ambientes = ambientes.filter(a => a.id !== id);
        renderizarTabela();
        if (ambientes.length === 0) resultadoBox.classList.remove('active');
    }

    // ── Atualizar UI ──────────────────────────────────────────────────────
    function atualizarUI() {
        const qtde = ambientes.length;
        badgeCount.textContent = `${qtde} ${qtde === 1 ? 'item' : 'itens'}`;

        if (qtde === 0) {
            tabela.style.display = 'none';
            listaVazia.style.display = 'block';
            btnCalcular.disabled = true;
        } else {
            tabela.style.display = 'table';
            listaVazia.style.display = 'none';
            btnCalcular.disabled = false;
        }
    }
}
