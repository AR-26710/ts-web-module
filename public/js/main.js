let ignoreNextClick = false;

document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', (e) => {

        if (ignoreNextClick) {
            ignoreNextClick = false;
            e.preventDefault();
            return;
        }

        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));

        button.classList.add('active');
        const tabId = 'tab-' + button.dataset.tab;
        const panel = document.getElementById(tabId);
        panel.classList.add('active');

        const dataTab = button.dataset.tab;
        const externalTabs = Array.from(document.querySelectorAll('.tab-btn')).map(btn => btn.dataset.tab);
        if (externalTabs.includes(dataTab)) {
            const url = `examples/${dataTab}.html`;
            if (panel.innerHTML.trim() === '') {
                fetch(url)
                    .then(response => response.text())
                    .then(html => {
                        panel.innerHTML = html;
                    })
                    .catch(error => {
                        panel.innerHTML = `<p>加载内容失败: ${error.message}</p>`;
                    });
            }
        }
    });
});
document.querySelector('.tab-btn.active').click();