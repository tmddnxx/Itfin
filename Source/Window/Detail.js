
Detail = class Detail extends AView
{
	constructor()
	{
		super()
        
		this.selectData = null;
        this.READ_ONLY_MODE_ID = 'unique-lock-id';
	}

	init(context, evtListener)
	{
		super.init(context, evtListener)
        this.createCkEditor(this.content.element);


	}

	onInitDone()
	{
		super.onInitDone()

		//TODO:edit here

	}

    createCkEditor(target)
    {   
        const thisObj = this;
        return ClassicEditor.create(target, {
            language: 'ko',
            extraPlugins: [customUploadAdapterPlugin],
            link: {
            addTargetToExternalLinks: true  // 외부 링크에 자동으로 target="_blank" 추가
            }
        })
        .then(editor => {
            editor.editing.view.change(writer => writer.setStyle('height', '620px', editor.editing.view.document.getRoot()))
            editor.enableReadOnlyMode(thisObj.READ_ONLY_MODE_ID); // readonly 부여
            this.content = editor;

        })
        .catch(console.error);

        function customUploadAdapterPlugin(editor) {
            editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                return new UploadAdapter(loader, `${config.SERVER_ADDRESS}:${config.SERVER_PORT}/upload`);
            };
        }
    }

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)
        
        // 상세보기 모달
		this.selectData = this.getContainer().getData();

        this.index.setText(this.selectData.index);
        this.type.setText(this.selectData.type);
        this.title.setText(this.selectData.title);
        this.content.setData(this.selectData.content);
        let content = this.content.getData();

        if (!content.includes("<figure>")) {
            // HTML 태그를 제거하고, 'https://'로 시작하는 부분에 <a> 링크를 추가
            this.content.setData(content.replace(/<\/?[^>]+(>|$)/g, "")); // HTML 태그 제거
            this.content.setData(content.replace(/https?:\/\/[^\s]+/g, function(url) {
                return `<a href="${url}" target="_blank">${url}</a>`; // 'https://' 링크에 <a> 태그 추가
            }));
        }
                
    }    
}

