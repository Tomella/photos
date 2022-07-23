
const template = document.createElement('template');

template.innerHTML = `
<style>
form {
   width: 265px;
   background-color: white;
   border:  2px solid rgb(0,0,0,0.2);
   border-radius: 6px;
   padding: 6px;
   line-height: 1.6;
}
label {
   display: inline-block;
   width: 6em;
   font-weight: bold;
}
button {
   margin-top: 6px;
   padding: 5px;
   font-weight: bolder;
   border: 2px solid rgb(0,0,0,0.2);
   border-radius: 4px;
}
</style>
<div class="ph-login">
   <button class="ph-login-show">Login...</button>
   <form action="/login" method="post" hidden="hidden">
      <label for="username">User Name</label><input type="text" name="username" placeholder="Username"></input>
      <br/>
      <label for="password">Password</label><input type="password" name="password" placeholder="Password"></input>
      <br/>
      <button type="submit" class="ph-submit" disabled="disabled">Sign in</button>
      <button style="float: right" class="ph-cancel">Cancel</button>
   </form>
</div>
`;

customElements.define('ph-login', class LoginElement extends HTMLElement {

   $(selector) {
      return this.shadowRoot && this.shadowRoot.querySelector(selector)
   }

   $$(selector) {
      return this.shadowRoot && this.shadowRoot.querySelectorAll(selector)
   }

   constructor() {
      super();
      // Normally you are adding the template
      const root = this.attachShadow({ mode: 'open' })
      root.appendChild(template.content.cloneNode(true));
   }

   connectedCallback() {
      const form = this.$("form");
      const show = this.$(".ph-login-show");
      const cancel = this.$(".ph-cancel");
      const submit = this.$(".ph-submit");
      const username = this.$("[name='username']");
      const password = this.$("[name='password']");

      //this.shadowRoot.addEventListener('jobexpand', (e) => console.log(e));
      show.addEventListener("click", ev => {
         show.setAttribute("hidden", "hidden");
         form.removeAttribute("hidden");
         username.focus();
      });

      username.addEventListener("input", ev => {
         if (username.value && password.value) {
            submit.removeAttribute("disabled");
         } else {
            submit.setAttribute("disabled", "disabled");
         }

      });
      
      password.addEventListener("input", ev => {
         if (username.value && password.value) {
            submit.removeAttribute("disabled");
         } else {
            submit.setAttribute("disabled", "disabled");
         }
      });

      cancel.addEventListener("click", ev => {
         form.setAttribute("hidden", "hidden");
         show.removeAttribute("hidden");
         ev.preventDefault();
         return false;
      });

   }

});
