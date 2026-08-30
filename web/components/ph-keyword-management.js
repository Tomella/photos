const template = document.createElement('template');

template.innerHTML = `
<style>
    :host {
        display: block;
        max-width: 42em;
    }

    .keyword-management {
        display: grid;
        gap: 16px;
    }

    .add-form {
        display: flex;
        gap: 8px;
    }

    input {
        flex: 1;
        min-width: 0;
        padding: 8px 10px;
        border: 1px solid #dadce0;
        border-radius: 6px;
        color: #101010;
        font: inherit;
    }

    button {
        border: 0;
        border-radius: 6px;
        padding: 8px 12px;
        background: #101010;
        color: #fff;
        cursor: pointer;
        font: inherit;
    }

    button:hover {
        background: #3c4043;
    }

    button:disabled {
        cursor: not-allowed;
        opacity: .5;
    }

    .keywords {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .keyword {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 8px 5px 10px;
        border-radius: 10px;
        background: #e8eaed;
        color: #101010;
    }

    .remove {
        display: inline-grid;
        width: 20px;
        height: 20px;
        padding: 0;
        place-items: center;
        border-radius: 50%;
        background: transparent;
        color: #5f6368;
        font-size: 16px;
        line-height: 1;
    }

    .remove:hover {
        background: #dadce0;
        color: #101010;
    }

    .empty {
        color: #5f6368;
    }

    @media (max-width: 480px) {
        .add-form {
            align-items: stretch;
            flex-direction: column;
        }
    }
</style>
<section class="keyword-management" aria-label="Keyword management">
    <form class="add-form">
        <input type="text" maxlength="100" placeholder="Add keyword" aria-label="New keyword">
        <button type="submit">Add</button>
    </form>
    <ul class="keywords"></ul>
    <span class="empty">No keywords</span>
</section>
`;

customElements.define('ph-keyword-management', class KeywordManagement extends HTMLElement {
    constructor() {
        super();
        const root = this.attachShadow({ mode: 'open' });
        root.appendChild(template.content.cloneNode(true));
        this._keywords = [];

        this.$('.add-form').addEventListener('submit', (event) => {
            event.preventDefault();
            const input = this.$('input');
            const name = input.value.trim();
            if (!name || this._keywords.some(keyword => keyword.name.toLowerCase() === name.toLowerCase())) {
                return;
            }

            const keyword = { name };
            this._keywords = [...this._keywords, keyword];
            input.value = '';
            this.render();
            this.emit('keywordadd', keyword);
            this.emit('keywordschange', this._keywords);
        });
    }

    $(selector) {
        return this.shadowRoot.querySelector(selector);
    }

    set data(value) {
        this._keywords = Array.isArray(value)
            ? value.map(keyword => typeof keyword === 'string' ? { name: keyword } : keyword).filter(keyword => keyword && keyword.name)
            : [];
        this.render();
    }

    get data() {
        return [...this._keywords];
    }

    render() {
        const list = this.$('.keywords');
        const empty = this.$('.empty');
        list.replaceChildren();
        empty.hidden = this._keywords.length > 0;

        this._keywords.forEach((keyword, index) => {
            const item = document.createElement('li');
            item.className = 'keyword';
            item.append(document.createTextNode(keyword.name));

            const remove = document.createElement('button');
            remove.className = 'remove';
            remove.type = 'button';
            remove.textContent = 'x';
            remove.setAttribute('aria-label', `Remove ${keyword.name}`);
            remove.addEventListener('click', () => {
                const [removed] = this._keywords.splice(index, 1);
                this.render();
                this.emit('keywordremove', removed);
                this.emit('keywordschange', this._keywords);
            });

            item.append(remove);
            list.append(item);
        });
    }

    emit(type, detail) {
        this.dispatchEvent(new CustomEvent(type, {
            bubbles: true,
            composed: true,
            detail
        }));
    }
});
