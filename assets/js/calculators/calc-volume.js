/**
 * Lógica da Calculadora de Volume
 * Gerencia a lista de elementos e o cálculo de volume total.
 */

function initCalcVolume() {
    let elementos = [];
    let proximoId = 1;

    const form = document.getElementById('concreto-form');
    const tbody = document.getElementById('tbody-elementos');
    const tabela = document.getElementById('tabela-elementos');
    const listaVazia = document.getElementById('lista-vazia');
    const badgeCount = document.getElementById('badge-count');
    const btnCalcular = document.getElementById('btn-calcular');
    const resultadoBox = document.getElementById('resultado-concreto');
    const valorResultado = document.getElementById('valor-resultado-concreto');
    const infoResultado = document.getElementById('info-resultado-concreto');

    // ── Evento: Adicionar elemento à lista ────────────────────────────────
    form.addEventListener('submit', () => {
        const nome = document.getElementById('nome-elemento').value.trim();
        const comprimento = parseFloat(document.getElementById('comprimento-elem').value);
        const largura = parseFloat(document.getElementById('largura-elem').value);
        const altura = parseFloat(document.getElementById('altura-elem').value);
        const qtde = parseInt(document.getElementById('qtde-elem').value);

        if (!nome || isNaN(comprimento) || isNaN(largura) || isNaN(altura) || isNaN(qtde)) {
            alert('Preencha todos os campos corretamente.');
            return;
        }

        const volumeUnitario = comprimento * largura * altura;
        const volumeTotal = volumeUnitario * qtde;

        elementos.push({ id: proximoId++, nome, comprimento, largura, altura, qtde, volumeTotal });
        renderizarTabela();
        form.reset();
        document.getElementById('qtde-elem').value = 1;
    });

    // ── Evento: Calcular o volume final ───────────────────────────────────
    btnCalcular.addEventListener('click', () => {
        const total = calcularVolumeTotal();

        valorResultado.textContent = formatarM3(total);
        infoResultado.textContent = `Com 10% de margem de segurança: ${formatarM3(total * 1.10)}`;
        resultadoBox.classList.add('active');

        valorResultado.style.transition = 'transform 0.2s ease';
        valorResultado.style.transform = 'scale(1.1)';
        setTimeout(() => valorResultado.style.transform = 'scale(1)', 200);
    });

    // ── Renderizar a tabela ───────────────────────────────────────────────
    function renderizarTabela() {
        tbody.innerHTML = '';
        elementos.forEach(el => {
            const tr = document.createElement('tr');
            tr.classList.add('tr-linha');
            tr.innerHTML = `
                <td class="td">${el.nome}</td>
                <td class="td td-dim">${el.comprimento} × ${el.largura} × ${el.altura}</td>
                <td class="td" style="text-align: center;">${el.qtde}</td>
                <td class="td" style="font-weight: 600;">${formatarM3(el.volumeTotal)}</td>
                <td class="td" style="text-align: center;">
                    <button class="btn-remover" data-id="${el.id}" title="Remover">✕</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll('.btn-remover').forEach(btn => {
            btn.addEventListener('click', () => {
                elementos = elementos.filter(el => el.id !== parseInt(btn.dataset.id));
                renderizarTabela();
                if (elementos.length === 0) resultadoBox.classList.remove('active');
            });
        });

        atualizarUI();
    }

    function calcularVolumeTotal() {
        return elementos.reduce((acc, el) => acc + el.volumeTotal, 0);
    }

    function atualizarUI() {
        const qtde = elementos.length;
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

    function formatarM3(valor) {
        return `${valor.toFixed(3).replace('.', ',')} m³`;
    }
}
