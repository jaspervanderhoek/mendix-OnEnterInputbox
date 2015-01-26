/**
	OnChange Inputbox
	========================

	@file      : OnChangeInputbox.js
	@version   : 2.0
	@author    : Robert van 't Hof
	@date      : 28-9-2011
	@copyright : Mendix
	@license   : Please contact our sales department.
	@Aangepast door Richard --- voor een on enter event

	Documentation
	=============
	
*/
dojo.provide("OnEnterInputbox.widget.OnEnterInputbox");

mendix.widget.declare('OnEnterInputbox.widget.OnEnterInputbox', {
	//DECLARATION
	addons: [dijit._Templated],
    inputargs: {
		name 			: '',
		onchangemf		: '',
		onleavemf 		: '',
		delay			: 0,
		chartreshold	: 0
    },
	templateString 		: '<div dojoAttachPoint="divNode" class="divNode"><input dojoAttachPoint="inputBox" class="mendixFormView_textBox form-control"></div>',
	
	//CACHES
	divNode 			: '',
	inputBox 			: '',
	handle				: '',
	delay_timer			: '',
	currValue 			: '',
	objId				: 0,
	
	postCreate : function(){
		this.initInputbox();
		this.actRendered();
	},
	applyContext : function(context, callback){
		if (context)
			this.objId = context.getActiveGUID();
		else
			logger.warn(this.id + ".applyContext received empty context");
		callback && callback();
	},
	initInputbox : function() {
		this.inputBox.value = this.currValue;
		this.connect(this.inputBox, "onkeyup", dojo.hitch(this, this.eventOnKeyUp));
		this.connect(this.inputBox, "onblur", dojo.hitch(this, this.onLeaveMicroflow));
		this.connect(this.inputBox, "onfocus", dojo.hitch(this, this.eventInputFocus));
	},
	eventInputFocus : function () {
		dojo.addClass(this.inputBox, "MxClient_formFocus");
	},
	_getValueAttr : function () {
		return this.inputBox.value;
	},
	_setValueAttr : function (value) {
		this.inputBox.value = value || '';
	},
	onChange : function () {
	},
	eventOnKeyUp : function(e) {
		if (e.keyCode == null || e.keyCode == dojo.keys.ENTER){
			this.onChange();
			this.eventCheckDelay();
		}
	},
	eventCheckDelay : function () {
		if (this.delay > 0) {
			if (this.delay_timer) {
				clearTimeout(this.delay_timer);
				this.delay_timer = setTimeout(dojo.hitch(this, this.onChangeMicroflow), this.delay); // in milliseconds, seconds * 1000 !
			}
			else
				this.delay_timer = setTimeout(dojo.hitch(this, this.onChangeMicroflow), this.delay); // in milliseconds, seconds * 1000 !
		} else {
			this.onChangeMicroflow();
		}
		
	},
	onChangeMicroflow : function () {
		this.delay_timer = null
		this.executeMicroflow(this.onchangemf);
	},
	onLeaveMicroflow : function () {
		this.delay_timer = null
        this.executeMicroflow(this.onleavemf);
	},
	executeMicroflow : function (mf) {
		if (mf && this.objId > 0) {
            mx.processor.xasAction({
                error       : function() {
                    logger.error("OnChangeInputbox.widget.OnChangeInputbox.triggerMicroFlow: XAS error executing microflow")
                },
                actionname  : mf,
                applyto     : 'selection',
                guids       : [this.objId]
            });
		}
	},
	uninitialize : function(){
	}
});