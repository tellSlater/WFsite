// This is a template for the thin header used in the website.
// It replaces <thin-header> html elements with the bellow html code
// Also it grabs <thin-header> attributes "name" and "link" to use for the header's title


class ProjectBoxElement extends HTMLElement {


    static currentPaper = 3;

    nextPaper(){
        ProjectBoxElement.currentPaper++;
        if (ProjectBoxElement.currentPaper > 3) {
            ProjectBoxElement.currentPaper = 0;
        }
        return ProjectBoxElement.currentPaper + 1;
    }

    connectedCallback(){
        this.innerHTML = `
        <div class="contBlock">
            <a
                class="contBlockLink"
                href="` + this.getAttribute("link") + `"
            >
                <img
                    src="` + this.getAttribute("thumb") + `"
                    alt="` + this.getAttribute("thumb").substring(this.getAttribute("thumb").lastIndexOf('/') + 1) + `"
                />`
                + this.innerHTML +
                `<div
                    class="paper"
                    style="background: url(/images/Paper` + this.nextPaper() + `.png)"
                ></div>
            </a>
        </div>
        `
    }
}

customElements.define('project-box', ProjectBoxElement)



