const template = document.createElement('template');

template.innerHTML = `
<style>
	:host {
		display: contents;
	}

	dialog {
		width: min(90vw, 640px);
		max-height: 85vh;
		margin: auto;
		padding: 0;
		border: 0;
		border-radius: 8px;
		background: #ffffff;
		color: #101010;
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.24);
	}

	dialog::backdrop {
		background: rgba(16, 16, 16, 0.56);
	}

	.ph-modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 16px 20px;
		border-bottom: 1px solid #dadce0;
	}

	.ph-modal-title {
		margin: 0;
		font-size: 1.25rem;
	}

	.ph-modal-close {
		border: 0;
		padding: 6px 10px;
		border-radius: 4px;
		background: transparent;
		color: #5f6368;
		cursor: pointer;
		font-size: 1.25rem;
		line-height: 1;
	}

	.ph-modal-close:hover,
	.ph-modal-close:focus-visible {
		background: #f1f3f4;
		color: #101010;
	}

	.ph-modal-content {
		overflow: auto;
		padding: 20px;
	}

	::slotted(p) {
		text-align: center;
		padding-bottom: 16px !important;
	}

	::slotted(.ph-modal-button) {
		min-width: 96px;
		min-height: 44px;
		margin: 12px 6px 0 0;
		padding: 10px 22px;
		border: 1px solid #101010;
		border-radius: 6px;
		background: #101010;
		color: #ffffff;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;
	}

	::slotted(.ph-modal-button:first-of-type) {
		float: left;
	}

	::slotted(.ph-modal-button:last-of-type) {
		float: right;
		margin-right: 0;
	}

	::slotted(.ph-modal-button:hover) {
		background: #3c4043;
	}

	::slotted(.ph-modal-button:focus-visible) {
		outline: 3px solid #8ab4f8;
		outline-offset: 2px;
	}
</style>

<dialog aria-labelledby="modal-title">
	<div class="ph-modal-header">
		<h2 class="ph-modal-title" id="modal-title"></h2>
		<button class="ph-modal-close" type="button" aria-label="Close">&times;</button>
	</div>
	<div class="ph-modal-content">
        <slot></slot> 
    </div>
</dialog>
`;

customElements.define('ph-modal', class Modal extends HTMLElement {
	static get observedAttributes() { return ['title']; }

	constructor() {
		super();
		const root = this.attachShadow({ mode: 'open' });
		root.appendChild(template.content.cloneNode(true));

		this.dialog = root.querySelector('dialog');
		this.titleElement = root.querySelector('.ph-modal-title');
		this.contentElement = root.querySelector('.ph-modal-content');

		root.querySelector('.ph-modal-close').addEventListener('click', () => {
			this.close();
		});

		this.dialog.addEventListener('close', () => {
			this.dispatchEvent(new CustomEvent('dismiss', { bubbles: true }));
		});
	}

	connectedCallback() {
		this.titleElement.textContent = this.getAttribute('title') || '';
	}

	attributeChangedCallback(attribute, oldValue, newValue) {
		if (attribute === 'title' && this.titleElement) {
			this.titleElement.textContent = newValue || '';
		}
	}

	open(html) {
		if (html !== undefined) {
			this.setContent(html);
		}

		if (!this.dialog.open) {
			this.dialog.showModal();
		}
	}

	close() {
		if (this.dialog.open) {
			this.dialog.close();
		}
	}

	setContent(html) {
		this.contentElement.innerHTML = html;
	}

	get content() {
		return this.contentElement.innerHTML;
	}

	set content(html) {
		this.setContent(html);
	}
});
