const template = document.createElement('template');

template.innerHTML = `
<style>
    .ph-dialog-heading {
        font-weight:bold;
        text-align: center;
        font-size: 130%;
    }
    .ph-dialog-btn {
        font-weight:bold;
        margin-top:10px;
    }
    .ph-dialog-lbl {
       margin:10px;
    }

    .ph-dialog-wrapper span {
        font-weight:bold;
    }
    .ph-dialog-wrapper {
        padding:10px;
    }
    .ph-end-date, .ph-start-date {
        width: 11em;
    }
</style>
<div class="ph-dialog-wrapper">
   <div class="ph-filter-heading">Filter</div>
   <div>Date(s)</div>
   <div class="date-panel">
        <div>
            <span>Start Date</span></br/>
            <input class="ph-start-date" type="date" min="1800-01-01"/><button class="ph-dialog-clear-btn">X</button>
        </div>
        <div>
            <span>End Date</span><br/>
            <input class="ph-end-date" type="date"/><button class="ph-dialog-clear-btn">X</button>
        </div>
    
        <button class="ph-dialog-btn">Apply</button>
    </div>
    <div>Keyword(s)</div>
    <div class="keyword-panel">
         <div>
            <input type="text" placeholder="Find Keyword(s)"></input>
         </div>
         <div class="keywords-container">
         </div>
     
         <button class="ph-dialog-btn">Apply</button>
     </div>
</div>
`;

customElements.define('ph-dialog', class Dialog extends HTMLElement {
    

    $(selector) {
        return this.shadowRoot && this.shadowRoot.querySelector(selector)
    }

    $$(selector) {
        return this.shadowRoot && this.shadowRoot.querySelectorAll(selector)
    }

    constructor() {
    }
});
