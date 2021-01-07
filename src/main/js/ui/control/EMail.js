// JS-класс, расширяющий функциональность текстового поля, добавляющий проверку
// значения на соответствие регулярному выражению для адреса E-Mail
// Данный класс используется для поля таблицы Document, см. Documents.bl
// Аргументы Z8.define():
//    - имя определяемого класса
//    - конфигурация класса, в которой определяется:
Z8.define('org.zenframework.z8.template.controls.EMail', {
	// Имя наследуемого класса
	extend: 'Z8.form.field.Text',

	// Переопределение метода validate(), который вызывается при каждом изменении значения поля
	validate: function() {
		var value = this.getValue();
		this.setValid(/.+@.+/.test(value));
	}

});

Z8.define('org.zenframework.z8.template.controls.Youtube', {
	extend: 'Z8.form.field.Text',
	
	getYoutubeVideoId: function(url) {
	    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
	    var match = url.match(regExp);
	    if (match && match[2].length == 11) {
	        return match[2];
		} else {
		    return 'error';
		}
	},
	
	renderVideo: function(value) {
		let container = DOM.create("div", "row embed-responsive embed-responsive-16by9");
		this.video = DOM.create("iframe", "embed-responsive-item");
		container.append(this.video);
		this.updateVideo(value);
		return container;
	},
	
	updateVideo: function(value) {
		let videoId = this.getYoutubeVideoId(value.trim());
		this.video.src = "//www.youtube.com/embed/" + videoId;
	},
	
	onInput: function() {
		
		var rawValue = this.getRawValue();
		var value = this.rawToValue(rawValue);
		this.mixins.field.setValue.call(this, value);

		if (value && value != '') {
			if (this.video) {
				this.updateVideo(value);
			} else {
				let place = this.getBox().parentElement.parentElement.parentElement.parentElement;
				let history = place.lastChild;
				let container = this.renderVideo(value);
				place.insertBefore(container, history);
			}
		} else {
			if (this.video) {
				this.video.parentElement.remove();
				this.video = null;
			}
		}
	},
});

Z8.define('org.zenframework.z8.template.controls.xml', {
	extend: 'Z8.form.field.TextArea',
	scrollable: true,
	readOnly: false,
	
	setContainersStyles: function(){
		this.wrapper.style.overflow = "hidden";
		this.wrapper.style.position = "absolute";
		this.wrapper.style.width = "100%";
		this.wrapper.style.height = "100%";
		this.wrapper.style.top = "0";
		this.wrapper.style.left = "0";
		this.wrapper.style.zIndex = "0";
		this.wrapper.style.font = "inherit";
		this.pre.style.overflow = "hidden";
		this.pre.style.position = "absolute";
		this.pre.style.width = "100%";
		this.pre.style.height = "100%";
		this.pre.style.top = "0";
		this.pre.style.left = "0";
		this.pre.style.margin = "0";
		this.pre.style.padding = "0";
		this.pre.style.background = "transparent";
		this.pre.style.font = "inherit";
		this.code.style.overflow = "hidden";
		this.code.style.position = "absolute";
		this.code.style.width = "100%";
		this.code.style.height = "100%";
		this.code.style.top = "0";
		this.code.style.left = "0";
		this.code.style.font = "inherit";
		this.code.style.padding= "0.14285714em";
		this.code.style.whiteSpace = "pre-wrap";
		this.code.style.wordWrap = "break-word";
		this.code.style.background = "transparent";
	},
	
	setMainStyles: function() {
		this.elem.style.background = "transparent";
		this.elem.style.zIndex = "1";
		this.elem.style.color = "transparent";
		this.elem.style.caretColor = "#222";
	},
	
	createContainers: function() {
		if (!this.code){
			this.wrapper = DOM.create("div", "wrapper");
			this.pre = DOM.create("pre", "pre");
			this.code = DOM.create("code", "code textarea control");
			this.wrapper.append(this.pre);
			this.pre.append(this.code);
		} else {
			return;
		}
	},
	
	validate: function() {
		
		let text = this.getValue();

		if (this.code) {
			text = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
			this.code.innerHTML = text;
		}
	},
	
	completeRender: function() {
		Control.prototype.completeRender.call(this);
		
		DOM.on(this, 'click', this.onClick, this);
		DOM.on(this, 'keyDown', this.onKeyDown, this);

		var input = this.input = this.selectNode(this.getInputTag() + '[name=' + this.getInputName() + ']');

		if(this.editor)
			DOM.on(input, 'input', this.onInput, this);

		
		this.elem = DOM.selectNode(this.getCls());
		if (!this.code) {
			this.createContainers();
		}
		if (this.elem && this.wrapper && this.elem.parentElement.children.length < 3) {
			this.elem.parentElement.insertBefore(this.wrapper, this.elem);
			this.setMainStyles();
			this.setContainersStyles();
		}
	}

});

Z8.define('org.zenfraemwork.z8.template.controls.audio', {
	extend: 'Z8.form.field.Text',
	tag: 'audio',
	
	findInput: function() {
		let input = document.querySelector(".col-lg-3.col-md-3.col-sm-3.cell input[type=file]");
		return input;
	},
	
	getAudio: function(e) {
		let player = document.querySelector(".audioPlayer");
		var file = e.target.files[0];
		var reader = new FileReader();
		reader.onload = function(evt) {
		    player.src = evt.target.result;
			player.load();
		};
		reader.readAsDataURL(file);
	},
	
	createPlayer: function() {
		this.audio = DOM.create("audio", "audioPlayer");
		this.audio.controls = "controls";
	},
	
	completeRender: function() {
		Z8.form.field.Text.prototype.completeRender.call(this);
		let box = this.getBox();
		box.firstElementChild.remove();
		if (!this.audio) {
			this.createPlayer();
		}
		box.appendChild(this.audio);
		
		let input = this.findInput();
		input.addEventListener("change", this.getAudio);
	}
	});