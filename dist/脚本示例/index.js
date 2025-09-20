import { default as default_0 } from "https://testingcf.jsdelivr.net/npm/dedent/+esm";
/******/ var __webpack_modules__ = ({

<<<<<<< HEAD
/***/ 306:
/***/ (() => {


eventOn(tavern_events.MESSAGE_UPDATED, (message_id) => {
    toastr.error(`谁让你动我第 ${message_id} 楼消息的😡`, `干什么!`);
=======
/***/ 4:
/***/ (() => {


$(() => {
    replaceScriptButtons([{ name: '晚上好', visible: true }]);
    eventOn(getButtonEvent('晚上好'), () => {
        toastr.warning('晚安, 络络');
    });
>>>>>>> 41f3c61 (4)
});


/***/ }),

<<<<<<< HEAD
/***/ 357:
/***/ (() => {


// 在加载脚本时执行某个函数
$(() => {
    toastr.success('你已经成功加载示例脚本!', '恭喜你!');
});
// 在卸载脚本时执行某个函数
$(window).on('pagehide', () => {
    toastr.info('你已经卸载示例脚本!', '再见!');
=======
/***/ 33:
/***/ (() => {


eventOn(tavern_events.MESSAGE_UPDATED, (message_id) => {
    toastr.error(`谁让你动我第 ${message_id} 楼消息的😡`, `干什么!`);
>>>>>>> 41f3c61 (4)
});


/***/ }),

<<<<<<< HEAD
/***/ 505:
/***/ (() => {


$(() => {
    replaceScriptButtons([{ name: '晚上好', visible: true }]);
    eventOn(getButtonEvent('晚上好'), () => {
        toastr.warning('晚安, 络络');
    });
=======
/***/ 478:
/***/ (() => {


// 在加载脚本时执行某个函数
$(() => {
    toastr.success('你已经成功加载示例脚本!', '恭喜你!');
});
// 在卸载脚本时执行某个函数
$(window).on('pagehide', () => {
    toastr.info('你已经卸载示例脚本!', '再见!');
>>>>>>> 41f3c61 (4)
});


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/

// EXTERNAL MODULE: ./src/脚本示例/加载和卸载时执行函数.ts
<<<<<<< HEAD
var _ = __webpack_require__(357);
// EXTERNAL MODULE: ./src/脚本示例/添加按钮和注册按钮事件.ts
var src_ = __webpack_require__(505);
// EXTERNAL MODULE: ./src/脚本示例/监听消息修改.ts
var src_0 = __webpack_require__(306);
=======
var _ = __webpack_require__(478);
// EXTERNAL MODULE: ./src/脚本示例/添加按钮和注册按钮事件.ts
var src_ = __webpack_require__(4);
// EXTERNAL MODULE: ./src/脚本示例/监听消息修改.ts
var src_0 = __webpack_require__(33);
>>>>>>> 41f3c61 (4)
;// external "https://testingcf.jsdelivr.net/npm/dedent/+esm"

;// ./src/脚本示例/调整消息楼层.ts

$(async () => {
    const message_id = getLastMessageId();
    if (message_id !== 0) {
        return;
    }
    await createChatMessages([
        {
            role: 'assistant',
            message: default_0(`
                   [查看日记: 这是第二次看我的日记了呢~]
                   <roleplay_options>
                   接受日记本并翻阅: 青空黎接过她递来的粉色日记本，在天台阳光下缓缓翻开第一页
                   保持沉默盯着她看: 青空黎没有接本子，只是盯着她略显紧张的表情和轻颤的声音
                   坐到她身边: 青空黎没有立刻回应，而是缓缓走到络络身边坐下，等待她自己继续说
                   开玩笑化解气氛: 青空黎微微一笑，开玩笑地说「所以，是要让我当监督官啦？」
                   跳过时间: 青空黎接过日记本，安静地翻了几页，时间悄然流逝至黄昏深处
                   和络络聊天: 青空黎试探性地问：「这本是从哪天开始写的？都写些什么呀？」
                   </roleplay_options>
                 `),
        },
        {
            role: 'assistant',
            message: default_0(`
                   [查看日记: 真是的, 就这么喜欢看吗(v〃ω〃)]
                   <roleplay_options>
                   阅读日记第一页：青空黎打开粉色的日记本，从第一页开始认真阅读络络的记录内容。
                   问她封面上的兔子贴纸：青空黎好奇那枚蓝色兔子贴纸的来历，转头向络络询问。
                   观察络络的小动作：青空黎不急着翻开日记，而是注意到络络表情里一丝期待与不安。
                   和她闲聊天气：青空黎随口聊起傍晚风有点凉，试图舒缓紧张气氛。
                   调侃她：“有哪页是‘不许看’的？”青空黎轻松地试图化解她的小慌乱。
                   转身回教室：青空黎接过日记却并未立刻翻开，而是表示回教室再看，打算慢慢阅读。
                   </roleplay_options>
                 `),
        },
    ], { refresh: 'all' });
});

;// ./src/脚本示例/index.ts





