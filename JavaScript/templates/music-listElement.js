// This is a template for the thin header used in the website.
// It replaces <thin-header> html elements with the bellow html code
// Also it grabs <thin-header> attributes "name" and "link" to use for the header's title
class MusicListElement extends HTMLElement {
    connectedCallback(){
        this.innerHTML = `
        		<div class="filler">
			<img class="tnail" src="` + this.getAttribute("thumb") + `" alt="song thumbnail">
			<img class="playpause" src="/images/transparent.png" alt="PLAY/PAUSE" onclick="doAudio(this.parentNode.lastElementChild)">
			<div class="name"><h3>` + this.getAttribute("title") + `</h3></div>
			<div class="buttonlinks">
				<a class="aqmark" href="` + this.getAttribute("about") + `" target="_blank">
					<img class="qmark" src="/images/QuestionMark.png" alt="About this song" title="About this song">
				</a>
				<a class="aqmark" href="` + this.getAttribute("audio") + `" download>
					<img class="qmark" src="/images/Download.png" alt="Download" title="Download">
				</a>
			</div>
			<audio id="` + this.getAttribute("ident") + `" onended="showPlay(this)">
				<source src="` + this.getAttribute("audio") + `" type="audio/mpeg">
				Your browser does not support the audio element.
			</audio>
		</div>
        `
    }
}

customElements.define('music-li', MusicListElement)
