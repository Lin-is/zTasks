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