// This is a template for the thin header used in the website.
// It replaces <thin-header> html elements with the bellow html code
// Also it grabs <thin-header> attributes "name" and "link" to use for the header's title
class ThinHeader extends HTMLElement {
    connectedCallback(){
        this.innerHTML = `
        <header id="sky">
            <div class="headerFlex">
                <div class="left">
                    <a href="index.html">
                        <img
                            class="logoSmall"
                            src="images/LogoBetterTrans-Small.png"
                            alt="Link thumbnail"
                        />
                    </a>
                </div>
                <div class="mid">
                    <a href="` + this.getAttribute("link") + `" class="themeTXT">
                        <h1>` + this.getAttribute("name") + `</h1>
                    </a>
                </div>
                <div
                    class="right"
                    style="visibility: hidden; width: 79px; margin-right: 8%"
                ></div>
            </div>
            <div class="stripe"></div>
        </header>
        `
    }
}

customElements.define('thin-header', ThinHeader)
