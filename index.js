// A HackerNews API funciona em duas etapas:
// 1. Busca a lista dos IDs das top stories
// 2. Para cada ID, busca os detalhes da notícia

const BASE = 'https://hacker-news.firebaseio.com/v0';

async function carregarNoticias() {
    try {
        // Passo 1: busca os IDs das 500 top stories e pega só os 10 primeiros
        const resIds = await fetch(`${BASE}/topstories.json`);
        const ids = await resIds.json();
        const top10 = ids.slice(0, 10);

        // Passo 2: busca os detalhes de cada notícia em paralelo com Promise.all
        const noticias = await Promise.all(
            top10.map(id => fetch(`${BASE}/item/${id}.json`).then(r => r.json()))
        );

        exibirNoticias(noticias);

    } catch (e) {
        document.getElementById('loading').textContent =
            '⚠️ Erro ao carregar. Verifique a conexão.';
    }
}

function exibirNoticias(noticias) {
    document.getElementById('loading').style.display = 'none';

    const lista = document.getElementById('lista');

    noticias.forEach((n, i) => {
        // Calcula há quantas horas a notícia foi postada
        const horas = Math.floor((Date.now() / 1000 - n.time) / 3600);

        const div = document.createElement('div');
        div.className = 'noticia';

        div.innerHTML = `
            <div class="num">${i + 1}</div>

            <div class="info">
                <a class="titulo" href="${n.url || '#'}" target="_blank">
                    ${n.title}
                </a>

                <div class="meta">
                    <span>⬆️ ${n.score} pontos</span>
                    <span>💬 ${n.descendants || 0} comentários</span>
                    <span>👤 ${n.by}</span>
                    <span>🕒 há ${horas}h</span>
                </div>
            </div>
        `;

        lista.appendChild(div);
    });
}

// Inicia ao carregar a página
carregarNoticias();