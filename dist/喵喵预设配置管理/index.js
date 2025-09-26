/******/ var __webpack_modules__ = ({

/***/ 42:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   c: () => (/* binding */ showBatchExportPopup),
/* harmony export */   handleMegaBundleImport: () => (/* binding */ handleMegaBundleImport),
/* harmony export */   startBatchImportFlow: () => (/* binding */ startBatchImportFlow),
/* harmony export */   x: () => (/* binding */ showBatchDeletePopup)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(482);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(304);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(337);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(903);




async function showBatchExportPopup() {
    const popupId = 'preset-manager-batch-export-popup';
    $(`#${popupId}`).remove();
    const configs = Object.values(await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)());
    if (configs.length === 0) {
        toastr.info('没有可导出的配置。');
        return;
    }
    const configsHtml = configs
        .map(config => {
        const safeName = $('<div/>').text(config.name).html();
        return `
            <div style="padding: 8px 5px; border-bottom: 1px solid #eee; display: flex; align-items: center;">
                <label style="cursor:pointer; display:flex; align-items:center; width: 100%;">
                    <input type="checkbox" class="pm-batch-export-item" value="${config.id}" style="margin-right: 10px; transform: scale(1.2);">
                    <span>${safeName}</span>
                </label>
            </div>
        `;
    })
        .join('');
    const popupHtml = `
        <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
            <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
                <h4 style="margin-top:0; color:#6a4226; text-align: center;">选择要批量导出的配置</h4>
                <div style="margin: 10px 0; display: flex; justify-content: space-around;">
                   <button id="batch-export-select-all" style="padding: 6px 12px; background-color:#a5d6f9; border:none; border-radius:6px; cursor:pointer;">全选</button>
                   <button id="batch-export-deselect-all" style="padding: 6px 12px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer;">全不选</button>
                </div>
                <div style="flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 20px; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;">
                    ${configsHtml}
                </div>
                <div style="text-align: right; display:flex; justify-content:flex-end; gap: 10px;">
                    <button id="batch-export-cancel" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;">取消</button>
                    <button id="batch-export-confirm" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">确认导出</button>
                </div>
            </div>
        </div>
    `;
    $('body').append(popupHtml);
    const mobileStyles = `<style>
        @media (max-width: 600px) { #${popupId} > div { margin-top: 5vh; } }
    </style>`;
    $(`#${popupId}`).append(mobileStyles);
    $('#batch-export-select-all').on('click', () => $('.pm-batch-export-item').prop('checked', true));
    $('#batch-export-deselect-all').on('click', () => $('.pm-batch-export-item').prop('checked', false));
    $('#batch-export-cancel').on('click', () => $(`#${popupId}`).remove());
    $('#batch-export-confirm').on('click', async () => {
        const selectedIds = new Set();
        $('.pm-batch-export-item:checked').each(function () {
            selectedIds.add($(this).val());
        });
        const allConfigs = await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)();
        const selectedConfigs = Object.values(allConfigs).filter(c => selectedIds.has(c.id));
        batchExportConfigs(selectedConfigs);
        $(`#${popupId}`).remove();
    });
}
async function batchExportConfigs(selectedConfigs) {
    if (selectedConfigs.length === 0) {
        toastr.info('未选择任何配置。');
        return;
    }
    try {
        let userRemark = '';
        const addRemarkChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "是否要为这个批量导出的整合包添加备注信息？"`);
        if (addRemarkChoice === '1') {
            userRemark = await triggerSlash(`/input multiline=true placeholder="请输入备注，例如这批配置的共同特点..." "为整合包添加备注"`);
        }
        const megaBundle = {
            type: 'MiaoMiaoPresetMegaBundle',
            version: 1,
            remark: userRemark || '',
            presetConfigs: {},
            presets: {},
            regexData: [],
        };
        const uniquePresetNames = new Set();
        for (const configData of selectedConfigs) {
            megaBundle.presetConfigs[configData.id] = configData;
            if (configData.presetName) {
                uniquePresetNames.add(configData.presetName);
            }
        }
        if (uniquePresetNames.size > 0) {
            const presetList = Array.from(uniquePresetNames).join(', ');
            const includePresetsChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "您选择的配置关联了以下预设：${presetList}。是否要将这些预设文件一同打包导出？"`);
            if (includePresetsChoice === '1') {
                let includedCount = 0;
                for (const presetName of uniquePresetNames) {
                    if (TavernHelper.getPresetNames().includes(presetName)) {
                        const presetData = TavernHelper.getPreset(presetName);
                        if (presetData) {
                            megaBundle.presets[presetName] = presetData;
                            includedCount++;
                        }
                    }
                }
                toastr.info(`已将 ${includedCount} 个预设文件打包。`);
            }
            else {
                toastr.info('跳过预设文件导出。');
            }
        }
        const includeRegexChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "是否需要选择一些全局正则脚本一同打包导出？"`);
        if (includeRegexChoice === '1') {
            const allGlobalRegexes = await TavernHelper.getTavernRegexes({ scope: 'global' });
            if (allGlobalRegexes.length === 0) {
                toastr.info('没有可供导出的全局正则脚本。');
            }
            else {
                const selectedRegexes = await (0,___WEBPACK_IMPORTED_MODULE_2__.showRegexExportSelectionPopup)(allGlobalRegexes);
                if (selectedRegexes) {
                    megaBundle.regexData = selectedRegexes;
                    toastr.info(`已将 ${selectedRegexes.length} 条正则打包。`);
                }
                else {
                    toastr.info('已取消选择正则，将不导出任何正则脚本。');
                }
            }
        }
        else {
            toastr.info('跳过正则导出。');
        }
        const defaultFileName = 'MiaoMiao_Batch_Export';
        let userFileName = await triggerSlash(`/input default="${defaultFileName}" "请输入批量导出的文件名（无需后缀）"`);
        if (!userFileName || userFileName.trim() === '') {
            userFileName = defaultFileName;
            toastr.info('文件名为空，已使用默认名称。');
        }
        userFileName = userFileName.trim().replace(/\.json$/, '');
        const jsonString = JSON.stringify(megaBundle, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${userFileName}.json`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        a.remove();
        toastr.success(`已成功导出 ${selectedConfigs.length} 个配置的整合包。`);
    }
    catch (error) {
        console.error('批量导出失败:', error);
        toastr.error('批量导出失败，请检查控制台。');
    }
}
async function startBatchImportFlow(configsToImport) {
    const userChoices = await (0,___WEBPACK_IMPORTED_MODULE_2__/* .showBatchImportConfigSelectionPopup */ .HA)(configsToImport);
    if (!userChoices) {
        toastr.info('配置导入已取消。');
        return;
    }
    const importList = userChoices.filter((choice) => choice.import);
    if (importList.length === 0) {
        toastr.info('未选择要导入的配置。');
        return;
    }
    const storedConfigs = await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)();
    importList.forEach((choice) => {
        const config = configsToImport.find(c => c.id === choice.originalId);
        if (config) {
            const newConfig = { ...config }; // Create a copy
            newConfig.name = choice.newName;
            newConfig.id = (0,___WEBPACK_IMPORTED_MODULE_0__/* .generateUniqueId */ .Ij)(); // Assign a new unique ID on import
            storedConfigs[newConfig.id] = newConfig;
        }
    });
    await (0,___WEBPACK_IMPORTED_MODULE_3__/* .setStoredConfigs */ .BR)(storedConfigs);
    toastr.success(`成功导入 ${importList.length} 个配置。`);
    await (0,___WEBPACK_IMPORTED_MODULE_3__/* .renderConfigsList */ .sd)();
}
async function handleMegaBundleImport(megaBundle) {
    // 1. 导入预设
    const presetsToImport = megaBundle.presets;
    if (presetsToImport && Object.keys(presetsToImport).length > 0) {
        const presetNames = Object.keys(presetsToImport).join(', ');
        const importPresetChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "此文件包含预设: ${presetNames}。是否全部导入/覆盖？"`);
        if (importPresetChoice === '1') {
            for (const presetName in presetsToImport) {
                await TavernHelper.createOrReplacePreset(presetName, presetsToImport[presetName]);
            }
            toastr.success(`已导入 ${Object.keys(presetsToImport).length} 个预设。`);
        }
    }
    // 2. 导入正则
    const regexToImport = megaBundle.regexData;
    if (regexToImport && regexToImport.length > 0) {
        const importRegexChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "此文件包含 ${regexToImport.length} 条正则脚本。是否导入？"`);
        if (importRegexChoice === '1') {
            await (0,___WEBPACK_IMPORTED_MODULE_1__/* .importRegexLogic */ .P)(regexToImport);
        }
    }
    // 3. 导入配置
    const configsToImport = Object.values(megaBundle.presetConfigs);
    await startBatchImportFlow(configsToImport);
}
async function showBatchDeletePopup() {
    const popupId = 'preset-manager-batch-delete-popup';
    $(`#${popupId}`).remove();
    const configs = Object.values(await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)());
    if (configs.length === 0) {
        toastr.info('没有可删除的配置。');
        return;
    }
    const configsHtml = configs
        .map(config => {
        const safeName = $('<div/>').text(config.name).html();
        return `
            <div style="padding: 8px 5px; border-bottom: 1px solid #eee; display: flex; align-items: center;">
                <label style="cursor:pointer; display:flex; align-items:center; width: 100%;">
                    <input type="checkbox" class="pm-batch-delete-item" value="${config.id}" style="margin-right: 10px; transform: scale(1.2);">
                    <span title="${safeName}">${safeName}</span>
                </label>
            </div>
        `;
    })
        .join('');
    const popupHtml = `
        <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
            <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
                <h4 style="margin-top:0; color:#c62828; text-align: center;">选择要批量删除的配置</h4>
                <div style="margin: 10px 0; display: flex; justify-content: space-around;">
                   <button id="batch-delete-select-all" style="padding: 6px 12px; background-color:#a5d6f9; border:none; border-radius:6px; cursor:pointer;">全选</button>
                   <button id="batch-delete-deselect-all" style="padding: 6px 12px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer;">全不选</button>
                </div>
                <div style="flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 20px; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;">
                    ${configsHtml}
                </div>
                <div style="text-align: right; display:flex; justify-content:flex-end; gap: 10px;">
                    <button id="batch-delete-cancel" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;">取消</button>
                    <button id="batch-delete-confirm" style="padding: 8px 16px; background-color:#f44336; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#fff;">确认删除</button>
                </div>
            </div>
        </div>
    `;
    $('body').append(popupHtml);
    const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 200px; } }</style>`;
    $(`#${popupId}`).append(mobileStyles);
    $('#batch-delete-select-all').on('click', () => $('.pm-batch-delete-item').prop('checked', true));
    $('#batch-delete-deselect-all').on('click', () => $('.pm-batch-delete-item').prop('checked', false));
    $('#batch-delete-cancel').on('click', () => $(`#${popupId}`).remove());
    $('#batch-delete-confirm').on('click', () => {
        const selectedIds = [];
        $('.pm-batch-delete-item:checked').each(function () {
            selectedIds.push($(this).val());
        });
        batchDeleteConfigs(selectedIds);
        $(`#${popupId}`).remove();
    });
}
async function batchDeleteConfigs(configIds) {
    if (configIds.length === 0) {
        toastr.info('未选择任何要删除的配置。');
        return;
    }
    const confirm = await triggerSlash(`/popup okButton="确认删除" cancelButton="取消" result=true "警告：您确定要删除选中的 ${configIds.length} 个配置吗？此操作无法撤销。"`);
    if (confirm !== '1') {
        toastr.info('批量删除操作已取消。');
        return;
    }
    try {
        const storedConfigs = await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)();
        const idsToDelete = new Set(configIds);
        Object.keys(storedConfigs).forEach(id => {
            if (idsToDelete.has(id))
                delete storedConfigs[id];
        });
        await (0,___WEBPACK_IMPORTED_MODULE_3__/* .setStoredConfigs */ .BR)(storedConfigs);
        toastr.success(`已成功删除 ${configIds.length} 个配置。`);
        await (0,___WEBPACK_IMPORTED_MODULE_3__/* .renderConfigsList */ .sd)();
    }
    catch (error) {
        console.error('批量删除失败:', error);
        toastr.error('批量删除失败，请检查控制台。');
    }
}


/***/ }),

/***/ 165:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RD: () => (/* binding */ createUI),
/* harmony export */   jS: () => (/* binding */ toggleUI),
/* harmony export */   oz: () => (/* binding */ updateConfigListCache)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(482);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(842);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(42);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(406);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(337);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(903);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(825);







function createUI() {
    if ($(`#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl}`).length > 0) {
        // UI已存在，只需重新绑定事件
        bindUIEvents();
        return;
    }
    const uiContainer = $(`
        <div id="${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl}">
            <style>
                #${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl}{display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10000;background-color:#fff8f0;color:#3a2c2c;border:1px solid #e0c9a6;border-radius:16px;padding:20px;box-shadow:0 4px 25px rgba(120,90,60,.25);width:90%;max-width:550px;max-height:80vh;font-family:'Segoe UI',sans-serif;display:flex;flex-direction:column}#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl} h4{margin-top:0;border-bottom:2px solid #f0d8b6;padding-bottom:10px;color:#6a4226}#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl} h5{margin:8px 0;color:#7a5235}#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl} button{transition:all .2s ease}#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl} button:hover{opacity:.85}#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl} #preset-manager-list-section{flex:1;overflow-y:auto}@media (max-width:600px){#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl}{top:0;left:0;transform:none;width:100%;height:100vh;max-width:none;max-height:none;border-radius:0;padding:10px;box-shadow:none;display:flex;flex-direction:column}#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl} h4{font-size:18px;text-align:center;padding:12px 0;margin:0;border-bottom:2px solid #f0d8b6}#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl} #preset-manager-close{top:10px;right:10px;font-size:28px}#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl} #preset-manager-save-section{flex-wrap:wrap}#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl} #preset-manager-name-input{width:100%;margin-left:0;margin-bottom:10px}}
                .pm-switch{position:relative;display:inline-block;width:40px;height:20px;flex-shrink:0}.pm-switch input{opacity:0;width:0;height:0}.pm-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s;border-radius:20px}.pm-slider:before{position:absolute;content:"";height:16px;width:16px;left:2px;bottom:2px;background-color:#fff;transition:.4s;border-radius:50%}input:checked+.pm-slider{background-color:#4CAF50}input:checked+.pm-slider:before{transform:translateX(20px)}
                #preset-manager-tips-section { margin-top: 15px; padding: 10px; background-color: #f9f3ea; border-radius: 8px; font-size: 12px; color: #7a5235; text-align: center; flex-shrink: 0; }
                .pm-config-group summary { cursor: pointer; padding: 8px; background-color: #f7f0e4; border-radius: 6px; margin-top: 5px; font-weight: bold; } .pm-config-group summary:hover { background-color: #f0e2d0; } .pm-config-count { color: #888; font-weight: normal; margin-left: 5px; } .pm-config-sublist { list-style: none; padding-left: 15px; border-left: 2px solid #f0e2d0; margin-left: 8px; }
                .pm-actions-container { display: flex; align-items: center; gap: 5px; justify-content: flex-end; }
                .pm-actions-container > button, .pm-more-btn-wrapper > button { flex-shrink: 0; padding: 6px 12px; font-size: 13px; font-weight: 500; border-radius: 6px; cursor: pointer; border: none; }
                .pm-more-btn-wrapper { position: relative; }
                .pm-submenu { display: none; position: absolute; right: 0; top: calc(100% + 5px); background-color: #fff; border: 1px solid #e0c9a6; border-radius: 8px; box-shadow: 0 3px 15px rgba(120,90,60,.15); z-index: 10003; padding: 5px; min-width: 100px; }
                .pm-submenu button { display: block; width: 100%; text-align: left; padding: 8px 12px; border: none; background: none; font-size: 13px; border-radius: 4px; color: #3a2c2c; cursor: pointer; }
                .pm-submenu button:hover { background-color: #f0e2d0; }
            </style>

            <h4>喵喵预设配置管理by小n</h4>
            <button id="preset-manager-close" style="position:absolute; top:12px; right:16px; background:none; border:none; color:#9a6b4f; font-size:24px; cursor:pointer;">&times;</button>
            
            <div id="preset-manager-save-section" style="margin-bottom: 20px; margin-top:15px;">
                <div style="display:flex; flex-wrap: wrap; align-items:center;">
                    <label for="preset-manager-name-input" style="font-weight:bold; flex-shrink:0;">配置名称:</label>
                    <input type="text" id="preset-manager-name-input" placeholder="例如：仅破限" style="flex:1; min-width: 100px; margin-left: 10px; background-color: #fff; border: 1px solid #d4b58b; color:#3a2c2c; padding: 6px 8px; border-radius: 6px; font-size:14px;" />
                    <button id="preset-manager-save-btn" style="margin-left: 10px; padding:6px 12px; background-color:#f4c78e; border:none; border-radius:6px; color:#3a2c2c; cursor:pointer; font-weight:bold;">保存</button>
                </div>
                <div style="margin-top: 10px; display:flex; align-items:center; padding-left: 5px;">
                   <label for="preset-manager-bind-char" style="cursor:pointer;">绑定到当前角色</label>
                   <label class="pm-switch" style="margin-left: auto;">
                      <input type="checkbox" id="preset-manager-bind-char"/>
                      <span class="pm-slider"></span>
                   </label>
                </div>
                <!-- 分割线 -->
                <hr style="margin: 15px 0; border: none; border-top: 1px solid #e0c9a6; opacity: 0.6;">
                <div style="display:flex; flex-wrap: wrap; gap: 10px; align-items:center;">
                    <button id="preset-manager-help-btn" style="padding:6px 12px; background-color:#bcaaa4; border:none; border-radius:6px; color:#3a2c2c; cursor:pointer; font-weight:bold;">使用说明</button>
                    <button id="preset-manager-import-btn" style="padding:6px 12px; background-color:#a5d6f9; border:none; border-radius:6px; color:#3a2c2c; cursor:pointer; font-weight:bold;">导入</button>
                    <button id="preset-manager-batch-export-btn" style="padding:6px 12px; background-color:#81c784; border:none; border-radius:6px; color:#3a2c2c; cursor:pointer; font-weight:bold;">批量导出</button>
                    <button id="preset-manager-batch-delete-btn" style="padding:6px 12px; background-color:#ef9a9a; border:none; border-radius:6px; color:#fff; cursor:pointer; font-weight:bold;">批量删除</button>
                    <button id="preset-manager-grouping-btn" style="padding:6px 12px; background-color:#9c27b0; border:none; border-radius:6px; color:#fff; cursor:pointer; font-weight:bold;">预设编辑器</button>
                </div>
            </div>

            <div id="preset-manager-list-section">
                <h5>已保存的配置:</h5>
                <ul id="preset-manager-list" style="list-style:none; padding:0; margin:0;"></ul>
            </div>

            <div id="preset-manager-tips-section"></div>
        </div>
    `);
    $('body').append(uiContainer);
    $('body').append('<input type="file" id="preset-manager-import-file" accept=".json" style="display:none;">');
    $(`#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl}`).hide();
    // 绑定事件处理器
    bindUIEvents();
}
function bindUIEvents() {
    console.log('🔗 开始绑定UI事件...');
    // 先解绑所有事件，避免重复绑定
    $('#preset-manager-close').off('click');
    $('#preset-manager-help-btn').off('click');
    $('#preset-manager-save-btn').off('click');
    $('#preset-manager-import-btn').off('click');
    $('#preset-manager-batch-export-btn').off('click');
    $('#preset-manager-batch-delete-btn').off('click');
    $('#preset-manager-grouping-btn').off('click');
    $('#preset-manager-import-file').off('change');
    $('#preset-manager-close').on('click', () => {
        console.log('🖱️ 关闭按钮被点击');
        toggleUI();
    });
    $('#preset-manager-help-btn').on('click', () => {
        console.log('🖱️ 帮助按钮被点击');
        (0,___WEBPACK_IMPORTED_MODULE_4__/* .showHelpPopup */ .V9)();
    });
    $('#preset-manager-save-btn').on('click', () => {
        console.log('🖱️ 保存按钮被点击');
        (0,___WEBPACK_IMPORTED_MODULE_6__.saveCurrentConfig)();
    });
    $('#preset-manager-import-btn').on('click', () => {
        console.log('🖱️ 导入按钮被点击');
        $('#preset-manager-import-file').click();
    });
    $('#preset-manager-batch-export-btn').on('click', () => {
        console.log('🖱️ 批量导出按钮被点击');
        (0,___WEBPACK_IMPORTED_MODULE_2__/* .showBatchExportPopup */ .c)();
    });
    $('#preset-manager-batch-delete-btn').on('click', () => {
        console.log('🖱️ 批量删除按钮被点击');
        (0,___WEBPACK_IMPORTED_MODULE_2__/* .showBatchDeletePopup */ .x)();
    });
    $('#preset-manager-grouping-btn').on('click', () => {
        console.log('🖱️ 条目分组按钮被点击');
        (0,___WEBPACK_IMPORTED_MODULE_3__/* .showPromptGroupingUI */ .XZ)();
    });
    $('#preset-manager-import-file').on('change', event => {
        console.log('🖱️ 文件选择发生变化');
        (0,___WEBPACK_IMPORTED_MODULE_1__/* .handleFileImport */ .k)(event);
    });
    console.log('✅ UI事件绑定完成');
}
// 缓存配置列表，避免重复渲染
let configListCache = null;
let lastConfigUpdateTime = 0;
const CACHE_DURATION = 5000; // 5秒缓存
function toggleUI() {
    const ui = $(`#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl}`);
    if (ui.is(':visible')) {
        ui.fadeOut(200); // 减少动画时间
    }
    else {
        // 检查缓存是否有效
        const now = Date.now();
        if (!configListCache || now - lastConfigUpdateTime > CACHE_DURATION) {
            (0,___WEBPACK_IMPORTED_MODULE_5__/* .renderConfigsList */ .sd)();
            lastConfigUpdateTime = now;
        }
        else {
            // 使用缓存的配置列表
            $('#preset-manager-list').html(configListCache);
        }
        const randomTip = ___WEBPACK_IMPORTED_MODULE_0__/* .TIPS */ .df[Math.floor(Math.random() * ___WEBPACK_IMPORTED_MODULE_0__/* .TIPS */ .df.length)];
        $('#preset-manager-tips-section').text('小贴士：' + randomTip);
        ui.fadeIn(200); // 减少动画时间
    }
}
// 更新缓存
function updateConfigListCache() {
    configListCache = $('#preset-manager-list').html();
    lastConfigUpdateTime = Date.now();
}


/***/ }),

/***/ 304:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   P: () => (/* binding */ importRegexLogic),
/* harmony export */   showRegexBindingPopup: () => (/* binding */ showRegexBindingPopup)
/* harmony export */ });
/* unused harmony export sortRegexes */
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(337);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(903);


async function showRegexBindingPopup(configId) {
    const popupId = 'preset-manager-regex-popup';
    $(`#${popupId}`).remove();
    try {
        const allRegexes = await TavernHelper.getTavernRegexes({ scope: 'global' });
        if (allRegexes.length === 0) {
            toastr.info('没有可绑定的全局正则。');
            return;
        }
        const configs = await (0,___WEBPACK_IMPORTED_MODULE_1__.getStoredConfigs)();
        const currentConfig = configs[configId];
        if (!currentConfig)
            return;
        const savedStates = new Map(currentConfig.regexStates?.map(r => [r.id, r.enabled]) ?? []);
        const regexesHtml = allRegexes
            .map((regex) => {
            const isChecked = savedStates.has(regex.id) ? savedStates.get(regex.id) : regex.enabled;
            const safeName = $('<div/>').text(regex.script_name).html();
            return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 5px; border-bottom: 1px solid #eee;">
                    <label for="regex-toggle-${regex.id}" style="cursor: pointer; flex: 1; margin-right: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${safeName}">${safeName}</label>
                    <label class="pm-switch">
                       <input type="checkbox" id="regex-toggle-${regex.id}" data-id="${regex.id}" ${isChecked ? 'checked' : ''}/>
                       <span class="pm-slider"></span>
                    </label>
                </div>
            `;
        })
            .join('');
        const popupHtml = `
            <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
                <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
                    <h4 style="margin-top:0; color:#c62828; text-align: center;">请选择绑定正则</h4>
                    <div style="flex: 1; min-height: 0; overflow-y: auto; margin: 15px 0; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;">
                        ${regexesHtml}
                    </div>
                    <div style="text-align: right; display:flex; justify-content:flex-end; gap: 10px;">
                        <button id="regex-bind-clear" style="padding: 8px 16px; background-color:#f5a8a0; border:none; border-radius:6px; cursor:pointer; color:#fff;">清除绑定</button>
                        <button id="regex-bind-cancel" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;">取消</button>
                        <button id="regex-bind-save" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">保存</button>
                    </div>
                </div>
            </div>
        `;
        $('body').append(popupHtml);
        const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 5vh; } }</style>`;
        $(`#${popupId}`).append(mobileStyles);
        $('#regex-bind-cancel').on('click', () => $(`#${popupId}`).remove());
        $('#regex-bind-clear').on('click', async () => {
            const configs = await (0,___WEBPACK_IMPORTED_MODULE_1__.getStoredConfigs)();
            if (configs[configId] && configs[configId].regexStates) {
                delete configs[configId].regexStates;
                await (0,___WEBPACK_IMPORTED_MODULE_1__/* .setStoredConfigs */ .BR)(configs);
                toastr.success(`配置 "${configs[configId].name}" 的正则绑定已清除。`);
            }
            else {
                toastr.info(`配置没有正则绑定。`);
            }
            $(`#${popupId}`).remove();
            (0,___WEBPACK_IMPORTED_MODULE_1__/* .renderConfigsList */ .sd)();
        });
        $('#regex-bind-save').on('click', async () => {
            const newRegexStates = allRegexes.map((regex) => ({
                id: regex.id,
                enabled: $(`#regex-toggle-${regex.id}`).is(':checked'),
            }));
            const configs = await (0,___WEBPACK_IMPORTED_MODULE_1__.getStoredConfigs)();
            if (!configs[configId])
                return;
            configs[configId].regexStates = newRegexStates;
            await (0,___WEBPACK_IMPORTED_MODULE_1__/* .setStoredConfigs */ .BR)(configs);
            toastr.success(`配置 "${configs[configId].name}" 的正则绑定已保存。`);
            $(`#${popupId}`).remove();
            (0,___WEBPACK_IMPORTED_MODULE_1__/* .renderConfigsList */ .sd)();
            const currentPresetName = configs[configId].presetName;
            if (!currentPresetName)
                return;
            const otherConfigIds = Object.keys(configs).filter(id => id !== configId && configs[id].presetName === currentPresetName);
            if (otherConfigIds.length > 0) {
                const confirmMessage = `是否要将此正则绑定应用到其他使用预设 "${currentPresetName}" 的 ${otherConfigIds.length} 个配置上？`;
                const userChoice = await triggerSlash(`/popup okButton="应用" cancelButton="取消" result=true "${confirmMessage}"`);
                if (userChoice === '1') {
                    otherConfigIds.forEach(id => {
                        configs[id].regexStates = newRegexStates;
                    });
                    await (0,___WEBPACK_IMPORTED_MODULE_1__/* .setStoredConfigs */ .BR)(configs);
                    toastr.success(`已成功将正则绑定应用到 ${otherConfigIds.length} 个同名预设配置上。`);
                }
            }
        });
    }
    catch (error) {
        console.error('打开正则绑定界面失败:', error);
        toastr.error('无法加载全局正则列表。');
    }
}
function sortRegexes(regexes) {
    const getSortNumber = (name) => {
        const match = name.trim().match(/^(?:\[|【|\(|（)?(\d+)(?:\]|】|\)|）|\.|-|_|\s)?/);
        if (match && match[1]) {
            return parseInt(match[1], 10);
        }
        return Infinity;
    };
    return regexes.sort((a, b) => {
        const numA = getSortNumber(a.script_name);
        const numB = getSortNumber(b.script_name);
        if (numA !== numB) {
            return numA - numB;
        }
        return a.script_name.localeCompare(b.script_name);
    });
}
async function importRegexLogic(regexToImport) {
    const currentRegexes = await TavernHelper.getTavernRegexes({ scope: 'global' });
    let remainingRegexes = currentRegexes;
    if (currentRegexes && currentRegexes.length > 0) {
        remainingRegexes = await (0,___WEBPACK_IMPORTED_MODULE_0__/* .showRegexDeletionPopup */ .rb)(currentRegexes);
    }
    const combinedRegexes = [...regexToImport, ...remainingRegexes];
    const sortedRegexes = sortRegexes(combinedRegexes);
    await TavernHelper.replaceTavernRegexes(sortedRegexes, { scope: 'global' });
    toastr.success(`成功导入 ${regexToImport.length} 条正则，并重新排序。`);
}


/***/ }),

/***/ 337:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HA: () => (/* binding */ showBatchImportConfigSelectionPopup),
/* harmony export */   V9: () => (/* binding */ showHelpPopup),
/* harmony export */   eS: () => (/* binding */ showNewEntriesPopup),
/* harmony export */   rb: () => (/* binding */ showRegexDeletionPopup),
/* harmony export */   showConfigSelectionPopup: () => (/* binding */ showConfigSelectionPopup),
/* harmony export */   showRegexExportSelectionPopup: () => (/* binding */ showRegexExportSelectionPopup),
/* harmony export */   showRemarkPopup: () => (/* binding */ showRemarkPopup),
/* harmony export */   showViewConfigPopup: () => (/* binding */ showViewConfigPopup)
/* harmony export */ });
function showHelpPopup() {
    const popupId = 'preset-manager-help-popup';
    $(`#${popupId}`).remove();
    const helpContent = `
        <div style="padding: 0 10px; font-size: 14px; line-height: 1.6;">
            <h5>主要功能</h5>
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 16px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #4CAF50;">
                    <b>保存/更新配置:</b> 保存或更新当前预设中所有"条目"的启用/禁用状态。更新时可选择是否同步正则状态。
                </li>
                <li style="margin-bottom: 16px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #2196F3;">
                    <b>加载配置:</b> 一键切换到指定的预设并将所有"条目"恢复到已保存的状态。
                </li>
                <li style="margin-bottom: 16px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #FF9800;">
                    <b>查看配置:</b> 在"更多"菜单中点击"查看"，可详细查看配置的基本信息、条目状态统计、启用/禁用的具体条目列表和绑定的正则信息。
                </li>
                <li style="margin-bottom: 16px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #9C27B0;">
                    <b>预设编辑器:</b> 强大的条目管理工具，支持创建、编辑、删除条目，以及多级分组管理。所有修改会实时保存到浏览器本地存储，分组设置与当前预设绑定。
                </li>
                <li style="margin-bottom: 16px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #00BCD4;">
                    <b>导入/导出:</b> 以 .json 文件的形式分享单个配置。导出时可以为配置包添加备注，方便分享和识别。整合包可以附带预设本身、绑定的正则和分组配置。
                </li>
                <li style="margin-bottom: 16px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #795548;">
                    <b>兼容世界书导入:</b> 支持直接导入通过酒馆世界书功能导出的、含有本插件数据的备份文件。
                </li>
                <li style="margin-bottom: 16px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #607D8B;">
                    <b>批量导入/导出:</b> 一次性分享多个配置、关联的预设和正则脚本，方便备份和迁移。
                </li>
                <li style="margin-bottom: 16px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #F44336;">
                    <b>批量删除:</b> 在主界面勾选多个配置进行一次性删除，方便清理。
                </li>
                <li style="margin-bottom: 16px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #E91E63;">
                    <b>角色绑定:</b> 将配置与特定角色关联，切换到该角色时会自动提示加载。
                </li>
                <li style="margin-bottom: 16px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #3F51B5;">
                    <b>正则绑定:</b> 将配置与一组全局正则的开关状态关联，加载配置时会自动应用。
                </li>
                <li style="margin-bottom: 16px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #FF5722;">
                    <b>重命名与分组:</b> 您可以重命名任何配置，同名预设的配置会自动折叠在一个分组下，使界面更清晰。
                </li>
            </ul>
        </div>
    `;
    const usageNotice = `
        <div style="padding: 12px; font-size: 14px; line-height: 1.6; background-color: #f9f3ea; border-radius: 8px; margin-top: 15px;">
            <h5 style="color: #c62828; margin-top:0;">使用须知</h5>
            <p style="font-weight: bold; margin-bottom: 0;">
                本脚本免费在旅程、喵喵电波服务器发布，作者MoM小n，不允许某个虐男char预设与该作者另一个梦女预设使用，也不支持鉴抄MoM那位的预设使用。
            </p>
        </div>
    `;
    const popupHtml = `
        <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10002; display: flex; align-items: center; justify-content: center;">
            <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 500px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
                <h4 style="margin-top:0; color:#6a4226; text-align: center; border-bottom: 2px solid #f0d8b6; padding-bottom: 10px; flex-shrink: 0;">喵喵预设配置管理 - 使用说明</h4>
                <div style="flex: 1; min-height: 0; overflow-y: auto; margin: 15px 0;">
                    ${helpContent}
                </div>
                ${usageNotice}
                <div style="text-align: right; margin-top: 15px; flex-shrink: 0;">
                    <button id="help-popup-close" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">关闭</button>
                </div>
            </div>
        </div>
    `;
    $('body').append(popupHtml);
    const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 10vh; max-height: 75vh !important; } }</style>`;
    $(`#${popupId}`).append(mobileStyles);
    $('#help-popup-close').on('click', () => $(`#${popupId}`).remove());
}
function showRemarkPopup(remarkText) {
    return new Promise(resolve => {
        const popupId = 'preset-manager-remark-popup';
        $(`#${popupId}`).remove();
        // Simple Markdown to HTML converter
        function convertMarkdown(text) {
            const sanitize = (s) => $('<div/>').text(s).html();
            const lines = text.split('\n');
            let html = '';
            let inList = false;
            const processInline = (line) => {
                return sanitize(line)
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/`(.*?)`/g, '<code>$1</code>');
            };
            for (const line of lines) {
                const trimmedLine = line.trim();
                const isList = trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ');
                if (inList && !isList && trimmedLine) {
                    html += '</ul>';
                    inList = false;
                }
                if (trimmedLine.startsWith('# ')) {
                    html += `<h1>${processInline(trimmedLine.substring(2))}</h1>`;
                }
                else if (trimmedLine.startsWith('## ')) {
                    html += `<h2>${processInline(trimmedLine.substring(3))}</h2>`;
                }
                else if (trimmedLine.startsWith('### ')) {
                    html += `<h3>${processInline(trimmedLine.substring(4))}</h3>`;
                }
                else if (isList) {
                    if (!inList) {
                        html += '<ul>';
                        inList = true;
                    }
                    html += `<li>${processInline(trimmedLine.substring(2))}</li>`;
                }
                else if (trimmedLine) {
                    html += `<p>${processInline(line)}</p>`;
                }
            }
            if (inList)
                html += '</ul>';
            return html;
        }
        const contentHtml = convertMarkdown(remarkText);
        const popupHtml = `
            <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10002; display: flex; align-items: center; justify-content: center;">
                <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 600px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
                    <style>
                        #${popupId} .remark-content h1, #${popupId} .remark-content h2, #${popupId} .remark-content h3 { margin: 12px 0 6px 0; padding-bottom: 6px; border-bottom: 1px solid #e0c9a6; }
                        #${popupId} .remark-content h1 { font-size: 1.4em; color: #6a4226; }
                        #${popupId} .remark-content h2 { font-size: 1.2em; color: #7a5235; }
                        #${popupId} .remark-content h3 { font-size: 1.1em; color: #7a5235; }
                        #${popupId} .remark-content p { margin: 0 0 10px 0; }
                        #${popupId} .remark-content ul { margin: 10px 0; padding-left: 25px; }
                        #${popupId} .remark-content li { margin-bottom: 5px; }
                        #${popupId} .remark-content code { background-color: #e0d8cd; padding: 2px 5px; border-radius: 4px; font-family: monospace; color: #3a2c2c; font-size: 0.9em; }
                    </style>
                    <h4 style="margin-top:0; color:#6a4226; text-align: center; border-bottom: 2px solid #f0d8b6; padding-bottom: 10px;">导入备注</h4>
                    <div class="remark-content" style="flex: 1; min-height: 200px; overflow-y: auto; margin: 15px 0; background-color: #fdfaf5; border: 1px solid #f0e2d0; border-radius: 8px; padding: 15px; line-height: 1.6; word-wrap: break-word;">
                        ${contentHtml}
                    </div>
                    <div style="text-align: right;">
                        <button id="remark-popup-continue" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">继续导入</button>
                    </div>
                </div>
            </div>
        `;
        $('body').append(popupHtml);
        const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 5vh; max-height: 85vh !important; } }</style>`;
        $(`#${popupId}`).append(mobileStyles);
        $('#remark-popup-continue').on('click', () => {
            $(`#${popupId}`).remove();
            resolve(true);
        });
    });
}
function showNewEntriesPopup(newEntries, promptIdToNameMap) {
    return new Promise(resolve => {
        const popupId = 'preset-manager-new-entries-popup';
        $(`#${popupId}`).remove();
        const entriesHtml = newEntries
            .map((entry, index) => {
            const entryName = promptIdToNameMap.get(entry.id) || `未知条目 (ID: ${entry.id})`;
            const isChecked = entry.enabled ? 'checked' : '';
            const safeEntryName = $('<div/>').text(entryName).html();
            return `
                <div class="entry-item" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                    <label for="new-entry-toggle-${index}" style="cursor: pointer; flex: 1; margin-right: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${safeEntryName}">${safeEntryName}</label>
                    <label class="pm-switch">
                       <input type="checkbox" id="new-entry-toggle-${index}" data-id="${entry.id}" ${isChecked}/>
                       <span class="pm-slider"></span>
                    </label>
                </div>
            `;
        })
            .join('');
        const popupHtml = `
            <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
                <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 90vh; box-sizing: border-box;">
                    <h4 style="margin-top:0; color:#6a4226; text-align: center;">检测到新条目</h4>
                    <p style="font-size: 14px; color: #6a4226; margin: 10px 0; flex-shrink: 0;">请选择以下新增条目的默认启用状态(勾选为需要启用)：</p>
                    <div style="flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 20px; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;">
                        ${entriesHtml}
                    </div>
                    <div class="button-container" style="text-align: right; margin-top: auto; flex-shrink: 0; display:flex; justify-content:flex-end;">
                        <button id="new-entries-cancel" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333; margin-right: 10px;">取消</button>
                        <button id="new-entries-confirm" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">确认</button>
                    </div>
                </div>
            </div>
        `;
        $('body').append(popupHtml);
        const mobileStyles = `<style>@media (max-width: 600px) {#${popupId} { align-items: flex-start !important; } #${popupId} > div{ margin-top: 5vh; width: 95% !important;max-width: none !important;height: auto !important;max-height: 85vh !important;border-radius: 12px !important;padding: 15px !important;}#${popupId} h4{font-size: 18px !important;margin-bottom: 10px !important;}#${popupId} p{font-size: 14px !important;margin: 5px 0 15px 0 !important;}#${popupId} .entry-item{padding: 10px 0 !important;}#${popupId} .button-container{flex-direction: row !important;gap: 10px !important;justify-content: flex-end;}#${popupId} .button-container button{width: auto !important;margin: 0 !important;flex-grow: 1;}}</style>`;
        $(`#${popupId}`).append(mobileStyles);
        $('#new-entries-confirm').on('click', () => {
            const updatedEntries = newEntries.map((entry, index) => ({
                ...entry,
                enabled: $(`#new-entry-toggle-${index}`).is(':checked'),
            }));
            $(`#${popupId}`).remove();
            resolve(updatedEntries);
        });
        $('#new-entries-cancel').on('click', () => {
            $(`#${popupId}`).remove();
            resolve(null);
        });
    });
}
function showConfigSelectionPopup(configs, charName) {
    return new Promise(resolve => {
        const popupId = 'preset-manager-config-selection-popup';
        $(`#${popupId}`).remove();
        const configsHtml = configs
            .map((config, index) => {
            const safeName = $('<div/>').text(config.name).html();
            return `
                <div class="config-item" style="padding: 10px 5px; border-bottom: 1px solid #eee; cursor: pointer; border-radius: 4px; display: flex; align-items: center;">
                    <input type="radio" id="config-select-${index}" name="config-selection" value="${config.id}" style="margin-right: 10px; transform: scale(1.2);">
                    <label for="config-select-${index}" style="cursor: pointer; width: 100%;">${safeName}</label>
                </div>
            `;
        })
            .join('');
        const popupHtml = `
            <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
                <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 400px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 90vh;">
                    <h4 style="margin-top:0; color:#6a4226; text-align: center; border-bottom: 2px solid #f0d8b6; padding-bottom: 10px;">选择配置</h4>
                    <p style="font-size: 14px; color: #6a4226; margin: 15px 0; text-align: center;">角色 "${$('<div/>').text(charName).html()}" 绑定了多个配置，请选择一个进行加载：</p>
                    <div style="flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 20px; padding: 5px;">
                        ${configsHtml}
                    </div>
                    <div style="text-align: right; display:flex; justify-content:flex-end; gap: 10px;">
                        <button id="config-select-cancel" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;">取消</button>
                        <button id="config-select-confirm" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">加载</button>
                    </div>
                </div>
            </div>
        `;
        $('body').append(popupHtml);
        const mobileStyles = `<style> @media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 5vh; max-height: 85vh !important; } }</style>`;
        $(`#${popupId}`).append(mobileStyles);
        if (configs.length > 0)
            $(`#config-select-0`).prop('checked', true);
        $(`#${popupId} .config-item`).on('click', function () {
            $(this).find('input[type="radio"]').prop('checked', true);
        });
        $('#config-select-confirm').on('click', () => {
            const selectedId = $('input[name="config-selection"]:checked').val();
            if (selectedId) {
                $(`#${popupId}`).remove();
                resolve(selectedId);
            }
            else {
                toastr.warning('请选择一个配置。');
            }
        });
        $('#config-select-cancel').on('click', () => {
            $(`#${popupId}`).remove();
            resolve(null);
        });
    });
}
function showRegexExportSelectionPopup(boundRegexes) {
    return new Promise(resolve => {
        const popupId = 'preset-manager-regex-export-popup';
        $(`#${popupId}`).remove();
        const regexesHtml = boundRegexes
            .map(regex => {
            const safeName = $('<div/>').text(regex.script_name).html();
            return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 5px; border-bottom: 1px solid #eee;">
                    <label for="regex-export-toggle-${regex.id}" style="cursor: pointer; flex: 1; margin-right: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${safeName}">${safeName}</label>
                    <label class="pm-switch">
                       <input type="checkbox" class="regex-export-checkbox" id="regex-export-toggle-${regex.id}" data-id="${regex.id}" checked/>
                       <span class="pm-slider"></span>
                    </label>
                </div>
            `;
        })
            .join('');
        const popupHtml = `
            <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
                <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
                    <h4 style="margin-top:0; color:#6a4226; text-align: center;">选择要导出的正则</h4>
                    <div style="margin: 10px 0; display: flex; justify-content: space-around;">
                       <button id="regex-export-select-all" style="padding: 6px 12px; background-color:#a5d6f9; border:none; border-radius:6px; cursor:pointer;">全选</button>
                       <button id="regex-export-deselect-all" style="padding: 6px 12px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer;">全不选</button>
                    </div>
                    <div style="flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 20px; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;">
                        ${regexesHtml}
                    </div>
                    <div style="text-align: right; display:flex; justify-content:flex-end; gap: 10px;">
                        <button id="regex-export-cancel" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;">取消</button>
                        <button id="regex-export-confirm" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">确认导出</button>
                    </div>
                </div>
            </div>
        `;
        $('body').append(popupHtml);
        const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 5vh; } }</style>`;
        $(`#${popupId}`).append(mobileStyles);
        $('#regex-export-select-all').on('click', () => $('.regex-export-checkbox').prop('checked', true));
        $('#regex-export-deselect-all').on('click', () => $('.regex-export-checkbox').prop('checked', false));
        $('#regex-export-cancel').on('click', () => {
            $(`#${popupId}`).remove();
            resolve(null);
        });
        $('#regex-export-confirm').on('click', () => {
            const selectedIds = new Set();
            $('.regex-export-checkbox:checked').each(function () {
                selectedIds.add($(this).data('id'));
            });
            const selectedRegexes = boundRegexes.filter(r => selectedIds.has(r.id));
            $(`#${popupId}`).remove();
            resolve(selectedRegexes);
        });
    });
}
function showRegexDeletionPopup(existingRegexes) {
    return new Promise(resolve => {
        const popupId = 'preset-manager-regex-delete-popup';
        $(`#${popupId}`).remove();
        const regexesHtml = existingRegexes
            .map(regex => {
            const safeName = $('<div/>').text(regex.script_name).html();
            return `
                <div style="display: flex; align-items: center; padding: 10px 5px; border-bottom: 1px solid #eee;">
                    <input type="checkbox" class="regex-delete-checkbox" id="regex-delete-toggle-${regex.id}" data-id="${regex.id}" style="margin-right: 15px; transform: scale(1.3);">
                    <label for="regex-delete-toggle-${regex.id}" style="cursor: pointer; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${safeName}">${safeName}</label>
                </div>
            `;
        })
            .join('');
        const popupHtml = `
            <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10002; display: flex; align-items: center; justify-content: center;">
                <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
                    <h4 style="margin-top:0; color:#c62828; text-align: center;">删除已有正则 (可选)</h4>
                    <p style="font-size: 13px; color: #777; text-align: center; margin-bottom: 15px;">在导入新正则前，你可以选择删除一些不再需要的旧正则。</p>
                    <div style="flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 20px; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;">
                        ${regexesHtml}
                    </div>
                    <div style="text-align: right; display:flex; justify-content:flex-end; gap: 10px;">
                        <button id="regex-delete-skip" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;">跳过并导入</button>
                        <button id="regex-delete-confirm" style="padding: 8px 16px; background-color:#f5a8a0; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#fff;">删除选中并导入</button>
                    </div>
                </div>
            </div>
        `;
        $('body').append(popupHtml);
        const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 5vh; } }</style>`;
        $(`#${popupId}`).append(mobileStyles);
        $('#regex-delete-skip').on('click', () => {
            $(`#${popupId}`).remove();
            resolve(existingRegexes);
        });
        $('#regex-delete-confirm').on('click', () => {
            const idsToDelete = new Set();
            $('.regex-delete-checkbox:checked').each(function () {
                idsToDelete.add($(this).data('id'));
            });
            const remainingRegexes = existingRegexes.filter(r => !idsToDelete.has(r.id));
            if (idsToDelete.size > 0) {
                toastr.info(`已删除 ${idsToDelete.size} 条旧正则。`);
            }
            $(`#${popupId}`).remove();
            resolve(remainingRegexes);
        });
    });
}
function showBatchImportConfigSelectionPopup(configsToImport) {
    return new Promise(resolve => {
        const popupId = 'preset-manager-batch-import-popup';
        $(`#${popupId}`).remove();
        const configsHtml = configsToImport
            .map(config => {
            const safeName = $('<div/>').text(config.name).html();
            return `
                <div style="padding: 8px 5px; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" class="pm-batch-import-checkbox" data-original-id="${config.id}" checked style="transform: scale(1.2);">
                    <label style="font-weight: bold; flex-shrink: 0;" title="${safeName}">${safeName}</label>
                    <input type="text" class="pm-batch-import-newname" value="${safeName}" style="flex: 1; min-width: 100px; background-color: #fff; border: 1px solid #d4b58b; color:#3a2c2c; padding: 4px 6px; border-radius: 4px; font-size:13px;">
                </div>
            `;
        })
            .join('');
        const popupHtml = `
             <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
                <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 500px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
                    <h4 style="margin-top:0; color:#6a4226; text-align: center;">选择要导入的配置</h4>
                    <p style="font-size: 13px; color: #777; text-align: center; margin-bottom: 15px;">勾选要导入的配置，可修改导入后的名称。</p>
                    <div style="flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 20px; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;">
                        ${configsHtml}
                    </div>
                    <div style="text-align: right; display:flex; justify-content:flex-end; gap: 10px;">
                        <button id="batch-import-cancel" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;">取消</button>
                        <button id="batch-import-confirm" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">导入选中项</button>
                    </div>
                </div>
            </div>
        `;
        $('body').append(popupHtml);
        const mobileStyles = `<style>
            @media (max-width: 600px) { #${popupId} > div { margin-top: 600px; } }
        </style>`;
        $(`#${popupId}`).append(mobileStyles);
        $('#batch-import-cancel').on('click', () => {
            $(`#${popupId}`).remove();
            resolve(null);
        });
        $('#batch-import-confirm').on('click', () => {
            const choices = [];
            let hasError = false;
            $('#preset-manager-batch-import-popup .pm-batch-import-checkbox').each(function () {
                const checkbox = $(this);
                const newName = checkbox.siblings('.pm-batch-import-newname').val()?.toString().trim();
                if (!newName && checkbox.is(':checked')) {
                    toastr.error(`有已勾选的配置新名称为空。`);
                    hasError = true;
                    return false;
                }
                choices.push({
                    originalId: checkbox.data('original-id'),
                    newName: newName,
                    import: checkbox.is(':checked'),
                });
            });
            if (!hasError) {
                $(`#${popupId}`).remove();
                resolve(choices);
            }
        });
    });
}
// 显示查看配置弹窗
async function showViewConfigPopup(configId) {
    const { getStoredConfigs } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 903));
    const configs = await getStoredConfigs();
    const configData = configs[configId];
    if (!configData) {
        toastr.error('配置不存在');
        return;
    }
    // 获取所有正则信息，用于显示名称
    let allRegexes = [];
    try {
        allRegexes = await TavernHelper.getTavernRegexes({ scope: 'global' });
    }
    catch (error) {
        console.warn('获取正则信息失败:', error);
    }
    const popupId = 'preset-manager-view-config-popup';
    $(`#${popupId}`).remove();
    // 统计配置信息
    const totalStates = configData.states.length;
    const enabledStates = configData.states.filter((state) => state.enabled).length;
    const disabledStates = totalStates - enabledStates;
    // 分组显示状态
    const enabledStatesHtml = configData.states
        .filter((state) => state.enabled)
        .map((state) => `<div style="padding: 4px 8px; margin: 2px; background-color: #e8f5e8; border-radius: 4px; font-size: 12px;">${$('<div/>').text(state.name).html()}</div>`)
        .join('');
    const disabledStatesHtml = configData.states
        .filter((state) => !state.enabled)
        .map((state) => `<div style="padding: 4px 8px; margin: 2px; background-color: #ffebee; border-radius: 4px; font-size: 12px;">${$('<div/>').text(state.name).html()}</div>`)
        .join('');
    // 正则绑定信息
    const regexInfo = configData.regexStates && configData.regexStates.length > 0
        ? `<div style="margin-top: 15px;">
         <h5 style="color: #6a4226; margin-bottom: 8px;">绑定正则 (${configData.regexStates.length}个)</h5>
         <div class="item-list" style="max-height: 100px; overflow-y: auto; border: 1px solid #e0c9a6; border-radius: 4px; padding: 8px;">
           ${configData.regexStates
            .map((regex) => {
            // 从所有正则中查找对应的正则信息
            const fullRegexInfo = allRegexes.find(r => r.id === regex.id);
            const regexName = fullRegexInfo?.script_name ||
                fullRegexInfo?.scriptName ||
                regex.scriptName ||
                regex.script_name ||
                regex.name ||
                `正则ID: ${regex.id}`;
            return `<div style="padding: 4px 8px; margin: 2px; background-color: ${regex.enabled ? '#e3f2fd' : '#fafafa'}; border-radius: 4px; font-size: 12px;">
                ${$('<div/>').text(regexName).html()} ${regex.enabled ? '(启用)' : '(禁用)'}
              </div>`;
        })
            .join('')}
         </div>
       </div>`
        : '';
    const popupHtml = `
    <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10002; display: flex; align-items: center; justify-content: center;">
      <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 600px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
        <h4 style="margin-top:0; color:#6a4226; text-align: center; border-bottom: 2px solid #f0d8b6; padding-bottom: 10px;">查看配置详情</h4>
        
        <div style="flex: 1; min-height: 0; overflow-y: auto; margin: 15px 0;">
          <div style="margin-bottom: 15px;">
            <h5 style="color: #6a4226; margin-bottom: 8px;">基本信息</h5>
            <div style="background-color: #f9f3ea; padding: 10px; border-radius: 6px;">
              <div><strong>配置名称:</strong> ${$('<div/>').text(configData.name).html()}</div>
              <div><strong>关联预设:</strong> ${$('<div/>').text(configData.presetName).html()}</div>
              <div><strong>创建时间:</strong> ${new Date(configData.id).toLocaleString()}</div>
              ${configData.boundCharName ? `<div><strong>绑定角色:</strong> <span style="color: #4CAF50;">${$('<div/>').text(configData.boundCharName).html()}</span></div>` : ''}
            </div>
          </div>

          <div style="margin-bottom: 15px;">
            <h5 style="color: #6a4226; margin-bottom: 8px;">条目状态统计</h5>
            <div class="stats-container" style="display: flex; gap: 10px; margin-bottom: 10px;">
              <div class="stats-item" style="background-color: #e8f5e8; padding: 8px; border-radius: 6px; flex: 1; text-align: center;">
                <div style="font-weight: bold; color: #2e7d32;">启用</div>
                <div style="font-size: 18px; font-weight: bold;">${enabledStates}</div>
              </div>
              <div class="stats-item" style="background-color: #ffebee; padding: 8px; border-radius: 6px; flex: 1; text-align: center;">
                <div style="font-weight: bold; color: #c62828;">禁用</div>
                <div style="font-size: 18px; font-weight: bold;">${disabledStates}</div>
              </div>
              <div class="stats-item" style="background-color: #f0f4f8; padding: 8px; border-radius: 6px; flex: 1; text-align: center;">
                <div style="font-weight: bold; color: #546e7a;">总计</div>
                <div style="font-size: 18px; font-weight: bold;">${totalStates}</div>
              </div>
            </div>
          </div>

          ${enabledStates > 0
        ? `
          <div style="margin-bottom: 15px;">
            <h5 style="color: #6a4226; margin-bottom: 8px;">启用的条目 (${enabledStates}个)</h5>
            <div class="item-list" style="max-height: 150px; overflow-y: auto; border: 1px solid #e0c9a6; border-radius: 4px; padding: 8px;">
              ${enabledStatesHtml}
            </div>
          </div>
          `
        : ''}

          ${disabledStates > 0
        ? `
          <div style="margin-bottom: 15px;">
            <h5 style="color: #6a4226; margin-bottom: 8px;">禁用的条目 (${disabledStates}个)</h5>
            <div class="item-list" style="max-height: 150px; overflow-y: auto; border: 1px solid #e0c9a6; border-radius: 4px; padding: 8px;">
              ${disabledStatesHtml}
            </div>
          </div>
          `
        : ''}

          ${regexInfo}
        </div>

        <div style="text-align: right; margin-top: 15px; display: flex; gap: 10px; justify-content: flex-end;">
          <button id="view-config-load" data-id="${configId}" style="padding: 8px 16px; background-color:#4CAF50; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#fff;">加载此配置</button>
          <button id="view-config-close" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">关闭</button>
        </div>
      </div>
    </div>
  `;
    $('body').append(popupHtml);
    // 绑定事件
    $('#view-config-close').on('click', () => {
        $(`#${popupId}`).remove();
    });
    $('#view-config-load').on('click', async () => {
        const configId = $('#view-config-load').data('id');
        $(`#${popupId}`).remove();
        const { loadConfig } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 825));
        await loadConfig(configId);
    });
    // 移动端样式
    const mobileStyles = `<style>
    @media (max-width: 600px) { 
      #${popupId} { 
        align-items: flex-start !important; 
        padding: 10px;
      } 
      #${popupId} > div { 
        margin-top: 5vh; 
        max-height: 90vh !important; 
        width: 95% !important;
        padding: 15px;
        border-radius: 12px;
      }
      #${popupId} h4 {
        font-size: 18px !important;
        margin-bottom: 15px !important;
      }
      #${popupId} h5 {
        font-size: 15px !important;
        margin-bottom: 10px !important;
      }
      #${popupId} button {
        font-size: 14px !important;
        padding: 10px 16px !important;
        min-height: 44px;
      }
      #${popupId} .stats-container {
        flex-direction: column !important;
        gap: 8px !important;
      }
      #${popupId} .stats-item {
        flex: none !important;
        padding: 12px !important;
      }
      #${popupId} .item-list {
        max-height: 120px !important;
        font-size: 13px !important;
      }
      #${popupId} .item-list div {
        padding: 6px 10px !important;
        margin: 3px !important;
        font-size: 12px !important;
      }
    }
    @media (max-width: 480px) {
      #${popupId} > div {
        margin-top: 2vh !important;
        max-height: 96vh !important;
        padding: 12px;
      }
      #${popupId} h4 {
        font-size: 16px !important;
      }
      #${popupId} .stats-item {
        padding: 10px !important;
      }
      #${popupId} .stats-item div:first-child {
        font-size: 13px !important;
      }
      #${popupId} .stats-item div:last-child {
        font-size: 16px !important;
      }
    }
  </style>`;
    $(`#${popupId}`).append(mobileStyles);
}


/***/ }),

/***/ 406:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ec: () => (/* binding */ restoreGroupingFromConfig),
/* harmony export */   XZ: () => (/* binding */ showPromptGroupingUI),
/* harmony export */   aY: () => (/* binding */ triggerGroupingRestore),
/* harmony export */   clearAllGrouping: () => (/* binding */ clearAllGrouping),
/* harmony export */   nO: () => (/* binding */ forceRestoreGrouping),
/* harmony export */   pM: () => (/* binding */ exportPresetGrouping),
/* harmony export */   q$: () => (/* binding */ importPresetGrouping),
/* harmony export */   s8: () => (/* binding */ restoreGroupingDelayed)
/* harmony export */ });
/* unused harmony exports getCurrentPresetPrompts, restoreGroupingImmediate, getAllPresetGroupings, clearPresetGrouping */
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(482);
// 防重复加载检查
if (window.miaomiaoPromptGroupingLoaded) {
    console.log('喵喵预设配置管理 - 条目分组功能已加载，跳过重复加载');
    // 直接返回，不执行后续代码
    throw new Error('Script already loaded');
}
window.miaomiaoPromptGroupingLoaded = true;
console.log('喵喵预设配置管理 - 条目分组功能首次加载');

// 分组数据存储键名（基于预设名称）
function getGroupingStorageKey(presetName) {
    return `miaomiao_preset_groups_${presetName}`;
}
// 获取预设的分组配置
function getPresetGrouping(presetName) {
    try {
        const stored = localStorage.getItem(getGroupingStorageKey(presetName));
        return stored ? JSON.parse(stored) : [];
    }
    catch (error) {
        console.error('获取分组配置失败:', error);
        return [];
    }
}
// 保存预设的分组配置
function savePresetGrouping(presetName, groups) {
    try {
        localStorage.setItem(getGroupingStorageKey(presetName), JSON.stringify(groups));
    }
    catch (error) {
        console.error('保存分组配置失败:', error);
    }
}
// 缓存DOM查询结果
let cachedPromptElements = null;
let lastPromptQueryTime = 0;
const PROMPT_CACHE_DURATION = 3000; // 3秒缓存
// 触发一次预设保存，避免条目更改丢失
function triggerPresetSave() {
    try {
        const $btn = $('#update_oai_preset');
        if ($btn.length) {
            $btn.trigger('click');
            console.log('已触发预设保存');
        }
        else {
            console.warn('未找到预设保存按钮 #update_oai_preset');
        }
    }
    catch (err) {
        console.error('触发预设保存时出错:', err);
    }
}
// 获取当前预设的所有条目
function getCurrentPresetPrompts() {
    const prompts = [];
    // 检查缓存是否有效
    const now = Date.now();
    if (!cachedPromptElements || now - lastPromptQueryTime > PROMPT_CACHE_DURATION) {
        cachedPromptElements = $('.completion_prompt_manager_prompt');
        lastPromptQueryTime = now;
    }
    const promptElements = cachedPromptElements;
    promptElements.each(function () {
        const element = $(this);
        const id = element.data('pm-identifier') || element.find('[data-pm-identifier]').data('pm-identifier');
        if (!id)
            return; // 早期跳出，避免不必要的DOM查询
        const nameElement = element.find('.completion_prompt_manager_prompt_name');
        const name = nameElement.find('a').text().trim() || nameElement.text().trim();
        if (!name)
            return; // 早期跳出
        const isEnabled = element.find('.prompt-manager-toggle-action').hasClass('fa-toggle-on');
        prompts.push({
            id: id,
            name: name,
            element: element,
            enabled: isEnabled,
        });
    });
    return prompts;
}
// 全局标记，防止重复绑定事件
let groupingEventsBound = false;
// 显示条目分组界面
async function showPromptGroupingUI() {
    const popupId = 'preset-manager-grouping-popup';
    $(`#${popupId}`).remove();
    const prompts = getCurrentPresetPrompts();
    if (prompts.length === 0) {
        toastr.warning('当前预设没有可分组的条目。');
        return;
    }
    // 获取当前预设的分组信息
    const currentPresetName = TavernHelper.getLoadedPresetName();
    const existingGroups = getPresetGrouping(currentPresetName);
    // 递归查找条目所在的分组路径
    function findPromptGroupPath(promptId, groups, parentPath = '') {
        for (const group of groups) {
            // 检查是否在直接条目中
            if (group.promptIds.includes(promptId)) {
                return parentPath ? `${parentPath}/${group.name}` : group.name;
            }
            // 递归检查子分组
            if (group.subGroups.length > 0) {
                const subPath = findPromptGroupPath(promptId, group.subGroups, parentPath ? `${parentPath}/${group.name}` : group.name);
                if (subPath) {
                    return subPath;
                }
            }
        }
        return null;
    }
    const promptsHtml = prompts
        .map((prompt, index) => {
        const groupPath = findPromptGroupPath(prompt.id, existingGroups);
        const isInGroup = groupPath !== null;
        return `
      <div class="prompt-item" data-prompt-id="${prompt.id}" data-index="${index}" 
           style="display: flex; align-items: flex-start; padding: 10px; border: 1px solid #e0e0e0; margin: 3px 0; border-radius: 6px; cursor: pointer; background-color: ${isInGroup ? '#e8f5e8' : '#fff'}; min-height: 44px;">
        <input type="checkbox" class="prompt-checkbox" style="margin-right: 12px; transform: scale(1.3); flex-shrink: 0; margin-top: 2px;">
        <div class="prompt-text" style="flex: 1; min-width: 0;">
          <div style="font-weight: ${prompt.enabled ? 'bold' : 'normal'}; color: ${prompt.enabled ? '#000' : '#666'}; font-size: 14px; line-height: 1.4; word-wrap: break-word; overflow-wrap: break-word;">
          ${$('<div/>').text(prompt.name).html()}
          </div>
          ${isInGroup ? `<div style="color: #666; font-size: 12px; margin-top: 4px; word-wrap: break-word; overflow-wrap: break-word;">📁 ${groupPath}</div>` : ''}
        </div>
        ${isInGroup ? `<span class="group-tag" style="background-color: #4CAF50; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; margin-left: 8px; flex-shrink: 0; align-self: flex-start; margin-top: 2px;">已分组</span>` : ''}
      </div>
    `;
    })
        .join('');
    const popupHtml = `
    <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
      <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 700px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 85vh; position: relative;">
        <button id="grouping-close" style="position: absolute; top: 15px; right: 15px; background: none; border: none; color: #9a6b4f; font-size: 24px; cursor: pointer; z-index: 10003; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background-color 0.2s;">&times;</button>
        <h4 style="margin-top:0; color:#6a4226; text-align: center; border-bottom: 2px solid #f0d8b6; padding-bottom: 10px; padding-right: 40px;">预设编辑器</h4>
        
        <!-- 操作区域 - 并排布局 -->
        <div class="操作区域" style="margin: 15px 0; display: flex; gap: 12px; flex-wrap: wrap;">
          <!-- 分组管理区域 -->
          <div style="flex: 1; min-width: 280px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #4CAF50;">
            <div style="font-size: 14px; font-weight: bold; color: #2e7d32; margin-bottom: 8px;">📁 分组管理</div>
            <input type="text" id="group-name-input" placeholder="输入分组名称..." style="width: 100%; padding: 8px 12px; border: 1px solid #d4b58b; border-radius: 6px; background: #fff; color: #333; font-size: 14px; margin-bottom: 10px; box-sizing: border-box;">
            <div style="position: relative; display: inline-block; width: 100%;">
              <button id="group-management-btn" style="width: 100%; padding: 10px 16px; background-color:#4CAF50; border:none; border-radius:6px; color:#fff; cursor:pointer; font-weight:bold; font-size: 14px; display: flex; align-items: center; justify-content: space-between;">
                <span>分组操作</span>
                <span style="font-size: 12px;">▼</span>
              </button>
              <div id="group-management-menu" style="display: none; position: absolute; top: 100%; left: 0; right: 0; background-color: #fff; border: 1px solid #d4b58b; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10002; margin-top: 2px;">
                <button id="create-group-btn" style="width: 100%; padding: 10px 16px; border:none; background:none; color:#333; cursor:pointer; font-size: 13px; text-align: left; border-bottom: 1px solid #f0f0f0;">创建分组</button>
                <button id="add-to-group-btn" style="width: 100%; padding: 10px 16px; border:none; background:none; color:#9C27B0; cursor:pointer; font-size: 13px; text-align: left; border-bottom: 1px solid #f0f0f0;">加入分组</button>
                <button id="remove-from-group-btn" style="width: 100%; padding: 10px 16px; border:none; background:none; color:#FF5722; cursor:pointer; font-size: 13px; text-align: left; border-bottom: 1px solid #f0f0f0;">移出分组</button>
                <button id="dissolve-group-btn" style="width: 100%; padding: 10px 16px; border:none; background:none; color:#ff9800; cursor:pointer; font-size: 13px; text-align: left; border-bottom: 1px solid #f0f0f0;">解散分组</button>
                <button id="clear-all-groups-btn" style="width: 100%; padding: 10px 16px; border:none; background:none; color:#ff5722; cursor:pointer; font-size: 13px; text-align: left; border-bottom: 1px solid #f0f0f0;">清除所有</button>
                <div style="border-top: 1px solid #eee; margin: 5px 0;"></div>
                <button class="dropdown-close-btn" style="width: 100%; padding: 10px 16px; border:none; background:none; color:#888; cursor:pointer; font-size: 13px; text-align: center;">关闭</button>
              </div>
          </div>
        </div>

          <!-- 条目操作区域 -->
          <div style="flex: 1; min-width: 280px; padding: 12px; background-color: #f0f8ff; border-radius: 8px; border-left: 4px solid #2196F3;">
            <div style="font-size: 14px; font-weight: bold; color: #1976D2; margin-bottom: 8px;">✏️ 条目操作</div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <div style="position: relative; display: inline-block; flex: 1; min-width: 120px;">
                <button id="item-selection-btn" style="width: 100%; padding: 10px 16px; background-color:#2196F3; border:none; border-radius:6px; color:#fff; cursor:pointer; font-weight:bold; font-size: 13px; display: flex; align-items: center; justify-content: space-between;">
                  <span>选择操作</span>
                  <span style="font-size: 12px;">▼</span>
                </button>
                <div id="item-selection-menu" style="display: none; position: absolute; top: 100%; left: 0; right: 0; background-color: #fff; border: 1px solid #d4b58b; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10002; margin-top: 2px;">
                  <button id="select-all-btn" style="width: 100%; padding: 10px 16px; border:none; background:none; color:#333; cursor:pointer; font-size: 13px; text-align: left; border-bottom: 1px solid #f0f0f0;">全选</button>
                  <button id="select-none-btn" style="width: 100%; padding: 10px 16px; border:none; background:none; color:#9E9E9E; cursor:pointer; font-size: 13px; text-align: left; border-bottom: 1px solid #f0f0f0;">全不选</button>
                  <button id="move-prompts-btn" style="width: 100%; padding: 10px 16px; border:none; background:none; color:#673AB7; cursor:pointer; font-size: 13px; text-align: left; border-bottom: 1px solid #f0f0f0;">移动条目</button>
                  <div style="border-top: 1px solid #eee; margin: 5px 0;"></div>
                  <button class="dropdown-close-btn" style="width: 100%; padding: 10px 16px; border:none; background:none; color:#888; cursor:pointer; font-size: 13px; text-align: center;">关闭</button>
                </div>
              </div>
              <div style="position: relative; display: inline-block; flex: 1; min-width: 120px;">
                <button id="item-edit-btn" style="width: 100%; padding: 10px 16px; background-color:#4CAF50; border:none; border-radius:6px; color:#fff; cursor:pointer; font-weight:bold; font-size: 13px; display: flex; align-items: center; justify-content: space-between;">
                  <span>编辑操作</span>
                  <span style="font-size: 12px;">▼</span>
                </button>
                <div id="item-edit-menu" style="display: none; position: absolute; top: 100%; left: 0; right: 0; background-color: #fff; border: 1px solid #d4b58b; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10002; margin-top: 2px;">
                  <button id="add-prompt-btn" style="width: 100%; padding: 10px 16px; border:none; background:none; color:#4CAF50; cursor:pointer; font-size: 13px; text-align: left; border-bottom: 1px solid #f0f0f0;">新增条目</button>
                  <button id="edit-prompt-btn" style="width: 100%; padding: 10px 16px; border:none; background:none; color:#FF9800; cursor:pointer; font-size: 13px; text-align: left; border-bottom: 1px solid #f0f0f0;">编辑条目</button>
                  <button id="delete-prompts-btn" style="width: 100%; padding: 10px 16px; border:none; background:none; color:#F44336; cursor:pointer; font-size: 13px; text-align: left; border-bottom: 1px solid #f0f0f0;">删除条目</button>
                  <div style="border-top: 1px solid #eee; margin: 5px 0;"></div>
                  <button class="dropdown-close-btn" style="width: 100%; padding: 10px 16px; border:none; background:none; color:#888; cursor:pointer; font-size: 13px; text-align: center;">关闭</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style="flex: 1; min-height: 300px; max-height: 400px; overflow-y: auto; border: 1px solid #f0e2d0; border-radius: 8px; padding: 16px; margin-bottom: 15px; background-color: #fafafa;">
          <div style="font-size: 13px; color: #666; margin-bottom: 12px; line-height: 1.4;">💡 提示：选中条目后可以创建分组，支持多级分组。分组后的条目会在预设界面中折叠显示，便于管理</div>
          <div id="prompts-container">
            ${promptsHtml}
          </div>
        </div>


        <div style="display: flex; flex-wrap: wrap; justify-content: flex-start; align-items: flex-start; gap: 10px; flex-shrink: 0; margin-top: auto; padding: 8px 0; min-height: 30px;">
          <div id="existing-groups-info" style="font-size: 12px; color: #666; flex: 1; min-width: 200px; word-wrap: break-word; overflow-wrap: break-word; line-height: 1.4; max-width: 100%; min-height: 20px; display: block;"></div>
        </div>
      </div>
    </div>
  `;
    $('body').append(popupHtml);
    // 显示现有分组信息
    console.log('现有分组:', existingGroups);
    updateExistingGroupsInfo(existingGroups);
    // 绑定事件（防止重复绑定）
    if (!groupingEventsBound) {
        bindGroupingEvents(prompts, existingGroups);
        groupingEventsBound = true;
    }
    else {
        console.log('分组事件已绑定，重新绑定以确保事件正确');
        // 即使已绑定，也要重新绑定以确保事件正确（适配脚本重复加载）
        bindGroupingEvents(prompts, existingGroups);
    }
    // 立即绑定关闭按钮事件，确保能正常工作
    setTimeout(() => {
        $('.dropdown-close-btn')
            .off('click')
            .on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            const menu = $(this).closest('[id$="-menu"]');
            if (menu.length > 0) {
                menu.hide();
                console.log('下拉菜单已关闭:', menu.attr('id'));
            }
            else {
                console.warn('未找到对应的菜单元素');
            }
        });
        console.log('关闭按钮事件已重新绑定');
    }, 100);
    // 移动端样式
    const mobileStyles = `<style>
    #${popupId} #grouping-close:hover {
      background-color: rgba(154, 107, 79, 0.1) !important;
    }
    .dropdown-close-btn:hover {
      background-color: rgba(153, 153, 153, 0.1) !important;
    }
    
    /* 平板端适配 (768px - 1024px) */
    @media (max-width: 1024px) {
      #${popupId} > div {
        width: 92% !important;
        max-width: 650px !important;
        max-height: 88vh !important;
      }
      #${popupId} .操作区域 {
        gap: 10px !important;
      }
      #${popupId} .操作区域 > div {
        min-width: 250px !important;
      }
    }
    
    /* 小屏幕适配 (600px - 768px) */
    @media (max-width: 768px) {
      #${popupId} { 
        align-items: flex-start !important; 
        padding: 8px !important;
      } 
      #${popupId} > div { 
        width: 96% !important;
        max-width: none !important;
        margin-top: 1vh !important;
        max-height: 96vh !important;
        padding: 16px !important;
      }
      #${popupId} h4 {
        font-size: 17px !important;
        margin-bottom: 12px !important;
        padding-right: 35px !important;
      }
      #${popupId} .操作区域 {
        flex-direction: column !important;
        gap: 8px !important;
        margin: 12px 0 !important;
      }
      #${popupId} .操作区域 > div {
        min-width: 100% !important;
        flex: none !important;
        padding: 10px !important;
      }
      #${popupId} #grouping-close {
        top: 12px !important;
        right: 12px !important;
        font-size: 26px !important;
        width: 32px !important;
        height: 32px !important;
      }
    }
    
    /* 手机端适配 (480px - 600px) */
    @media (max-width: 600px) {
      #${popupId} {
        padding: 5px !important;
      }
      #${popupId} > div {
        width: 98% !important;
        margin-top: 0.5vh !important;
        max-height: 98vh !important;
        padding: 14px !important;
        border-radius: 12px !important;
      }
      #${popupId} h4 {
        font-size: 16px !important;
        padding-right: 30px !important;
      }
      #${popupId} .操作区域 {
        margin: 10px 0 !important;
        gap: 6px !important;
      }
      #${popupId} .操作区域 > div {
        padding: 8px !important;
        border-radius: 6px !important;
      }
      #${popupId} .操作区域 h5 {
        font-size: 13px !important;
        margin-bottom: 8px !important;
      }
      #${popupId} .操作区域 input {
        font-size: 14px !important;
        padding: 8px 10px !important;
      }
      #${popupId} .操作区域 button {
        font-size: 13px !important;
        padding: 8px 12px !important;
      }
      #${popupId} #grouping-close {
        top: 8px !important;
        right: 8px !important;
        font-size: 24px !important;
        width: 30px !important;
        height: 30px !important;
      }
      #${popupId} #prompts-container {
        min-height: 250px !important;
        max-height: 350px !important;
        padding: 12px !important;
      }
      #${popupId} .prompt-item {
        padding: 8px 10px !important;
        margin-bottom: 6px !important;
        font-size: 13px !important;
        word-wrap: break-word !important;
        white-space: normal !important;
        line-height: 1.4 !important;
      }
      #${popupId} .prompt-item input[type="checkbox"] {
        width: 16px !important;
        height: 16px !important;
        margin-right: 8px !important;
        flex-shrink: 0 !important;
      }
      #${popupId} .prompt-item .prompt-text {
        flex: 1 !important;
        min-width: 0 !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
      }
      #${popupId} [id$="-menu"] {
        position: fixed !important;
        top: 20vh !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        width: 85% !important;
        max-width: 320px !important;
        z-index: 10003 !important;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3) !important;
        border-radius: 8px !important;
        padding: 12px !important;
        max-height: 60vh !important;
        overflow-y: auto !important;
      }
      #${popupId} [id$="-menu"] button {
        padding: 10px 14px !important;
        font-size: 13px !important;
        min-height: 44px !important;
        margin: 2px 0 !important;
      }
    }
    
    /* 小屏手机适配 (360px - 480px) */
    @media (max-width: 480px) {
      #${popupId} > div {
        width: 99% !important;
        margin-top: 0 !important;
        max-height: 99vh !important;
        padding: 12px !important;
        border-radius: 10px !important;
      }
      #${popupId} h4 {
        font-size: 15px !important;
        padding-right: 28px !important;
      }
      #${popupId} .操作区域 {
        margin: 8px 0 !important;
        gap: 5px !important;
      }
      #${popupId} .操作区域 > div {
        padding: 6px !important;
        border-radius: 5px !important;
      }
      #${popupId} .操作区域 h5 {
        font-size: 12px !important;
        margin-bottom: 6px !important;
      }
      #${popupId} .操作区域 input {
        font-size: 13px !important;
        padding: 6px 8px !important;
      }
      #${popupId} .操作区域 button {
        font-size: 12px !important;
        padding: 6px 10px !important;
      }
      #${popupId} #grouping-close {
        top: 6px !important;
        right: 6px !important;
        font-size: 22px !important;
        width: 28px !important;
        height: 28px !important;
      }
      #${popupId} #prompts-container {
        min-height: 200px !important;
        max-height: 300px !important;
        padding: 10px !important;
      }
      #${popupId} .prompt-item {
        padding: 6px 8px !important;
        margin-bottom: 4px !important;
        font-size: 12px !important;
        word-wrap: break-word !important;
        white-space: normal !important;
        line-height: 1.3 !important;
      }
      #${popupId} .prompt-item input[type="checkbox"] {
        width: 14px !important;
        height: 14px !important;
        margin-right: 6px !important;
        flex-shrink: 0 !important;
      }
      #${popupId} .prompt-item .prompt-text {
        flex: 1 !important;
        min-width: 0 !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
      }
      #${popupId} #existing-groups-info {
        font-size: 10px !important;
        line-height: 1.2 !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        max-width: 100% !important;
        padding: 4px 0 !important;
      }
      #${popupId} [id$="-menu"] {
        position: fixed !important;
        top: 15vh !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        width: 90% !important;
        max-width: 300px !important;
        padding: 10px !important;
        max-height: 70vh !important;
        overflow-y: auto !important;
      }
      #${popupId} [id$="-menu"] button {
        padding: 8px 12px !important;
        font-size: 12px !important;
        min-height: 40px !important;
      }
    }
    
    /* 超小屏适配 (320px - 360px) */
    @media (max-width: 360px) {
      #${popupId} > div {
        width: 100% !important;
        margin: 0 !important;
        max-height: 100vh !important;
        padding: 10px !important;
        border-radius: 8px !important;
      }
      #${popupId} h4 {
        font-size: 14px !important;
        padding-right: 25px !important;
      }
      #${popupId} .操作区域 {
        margin: 6px 0 !important;
        gap: 4px !important;
      }
      #${popupId} .操作区域 > div {
        padding: 5px !important;
        border-radius: 4px !important;
      }
      #${popupId} .操作区域 h5 {
        font-size: 11px !important;
        margin-bottom: 4px !important;
      }
      #${popupId} .操作区域 input {
        font-size: 12px !important;
        padding: 5px 6px !important;
      }
      #${popupId} .操作区域 button {
        font-size: 11px !important;
        padding: 5px 8px !important;
      }
      #${popupId} #grouping-close {
        top: 5px !important;
        right: 5px !important;
        font-size: 20px !important;
        width: 26px !important;
        height: 26px !important;
      }
      #${popupId} #prompts-container {
        min-height: 180px !important;
        max-height: 280px !important;
        padding: 8px !important;
      }
      #${popupId} .prompt-item {
        padding: 5px 6px !important;
        margin-bottom: 3px !important;
        font-size: 11px !important;
        word-wrap: break-word !important;
        white-space: normal !important;
        line-height: 1.2 !important;
      }
      #${popupId} .prompt-item input[type="checkbox"] {
        width: 12px !important;
        height: 12px !important;
        margin-right: 5px !important;
        flex-shrink: 0 !important;
      }
      #${popupId} .prompt-item .prompt-text {
        flex: 1 !important;
        min-width: 0 !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
      }
      #${popupId} #existing-groups-info {
        font-size: 9px !important;
        line-height: 1.1 !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        max-width: 100% !important;
        padding: 3px 0 !important;
      }
      #${popupId} [id$="-menu"] {
        position: fixed !important;
        top: 10vh !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        width: 95% !important;
        max-width: 280px !important;
        padding: 8px !important;
        max-height: 80vh !important;
        overflow-y: auto !important;
      }
      #${popupId} [id$="-menu"] button {
        padding: 6px 10px !important;
        font-size: 11px !important;
        min-height: 36px !important;
      }
    }
  </style>`;
    $(`#${popupId}`).append(mobileStyles);
}
function updateExistingGroupsInfo(groups) {
    const infoElement = $('#existing-groups-info');
    if (!infoElement.length) {
        console.warn('分组信息元素未找到');
        return;
    }
    if (groups.length === 0) {
        infoElement.html('当前没有分组');
    }
    else {
        const groupNames = getGroupNamesRecursively(groups);
        const groupText = groupNames.length > 0 ? groupNames.join(', ') : '无';
        infoElement.html(`现有分组: ${groupText}`);
    }
}
// 递归获取所有分组名称（包括子分组）
function getGroupNamesRecursively(groups) {
    const names = [];
    groups.forEach(group => {
        names.push(group.name);
        if (group.subGroups.length > 0) {
            const subGroupNames = getGroupNamesRecursively(group.subGroups);
            subGroupNames.forEach(subName => {
                names.push(`${group.name}/${subName}`);
            });
        }
    });
    return names;
}
function bindGroupingEvents(_prompts, existingGroups) {
    let selectedPrompts = [];
    // 先解绑所有可能重复的事件，防止重复绑定
    $('.prompt-item').off('click');
    $('.prompt-checkbox').off('change');
    $('#select-all-btn').off('click');
    $('#select-none-btn').off('click');
    $('#move-prompts-btn').off('click');
    $('#add-prompt-btn').off('click');
    $('#edit-prompt-btn').off('click');
    $('#delete-prompts-btn').off('click');
    $('#create-group-btn').off('click');
    $('#remove-group-btn').off('click');
    $('#dissolve-group-btn').off('click');
    $('#clear-all-groups-btn').off('click');
    $('#grouping-close').off('click');
    // 新增的下拉菜单按钮
    $('#group-management-btn').off('click');
    $('#item-selection-btn').off('click');
    $('#item-edit-btn').off('click');
    $('#add-to-group-btn').off('click');
    $('#remove-from-group-btn').off('click');
    $('.dropdown-close-btn').off('click');
    // 解绑文档级别的事件，防止重复绑定
    $(document).off('click', '.dropdown-close-btn');
    $(document).off('click', '[id$="-btn"], [id$="-menu"]');
    // 条目选择
    $('.prompt-item').on('click', function (e) {
        if (e.target.type === 'checkbox')
            return;
        const checkbox = $(this).find('.prompt-checkbox');
        checkbox.prop('checked', !checkbox.prop('checked'));
        updateSelectedPrompts();
    });
    $('.prompt-checkbox').on('change', updateSelectedPrompts);
    function updateSelectedPrompts() {
        selectedPrompts = [];
        $('.prompt-checkbox:checked').each(function () {
            const promptId = $(this).closest('.prompt-item').data('prompt-id');
            selectedPrompts.push(promptId);
        });
    }
    // 全选/全不选
    $('#select-all-btn').on('click', () => {
        $('.prompt-checkbox').prop('checked', true);
        updateSelectedPrompts();
    });
    $('#select-none-btn').on('click', () => {
        $('.prompt-checkbox').prop('checked', false);
        updateSelectedPrompts();
    });
    // 移动条目
    $('#move-prompts-btn').on('click', async () => {
        if (selectedPrompts.length === 0) {
            toastr.error('请选择要移动的条目');
            return;
        }
        // 显示目标位置选择弹窗
        await showPositionSelectionPopup(_prompts, selectedPrompts, (targetPromptId, position) => {
            movePromptsToPosition(selectedPrompts, targetPromptId, position);
            // 清除选择状态
            $('.prompt-checkbox').prop('checked', false);
            selectedPrompts = [];
            toastr.success('条目移动完成，将在关闭分组界面时应用到预设');
        });
    });
    // 新增条目
    $('#add-prompt-btn').on('click', async () => {
        await showAddPromptPopup(() => {
            // 重新加载分组界面以显示新条目
            setTimeout(() => {
                $('#preset-manager-grouping-popup').remove();
                showPromptGroupingUI();
            }, 100);
        });
    });
    // 编辑条目
    $('#edit-prompt-btn').on('click', async () => {
        if (selectedPrompts.length !== 1) {
            toastr.error('请选择一个条目进行编辑');
            return;
        }
        const promptId = selectedPrompts[0];
        const prompt = _prompts.find(p => p.id === promptId);
        if (!prompt) {
            toastr.error('未找到要编辑的条目');
            return;
        }
        await showEditPromptPopup(prompt, () => {
            // 重新加载分组界面以显示更新后的条目
            setTimeout(() => {
                $('#preset-manager-grouping-popup').remove();
                showPromptGroupingUI();
            }, 100);
        });
    });
    // 删除条目
    $('#delete-prompts-btn').on('click', async () => {
        if (selectedPrompts.length === 0) {
            toastr.error('请选择要删除的条目');
            return;
        }
        const confirmChoice = await triggerSlash(`/popup okButton="确认删除" cancelButton="取消" result=true "确定要删除选中的 ${selectedPrompts.length} 个条目吗？此操作不可撤销。"`);
        if (confirmChoice === '1') {
            await deleteSelectedPrompts(selectedPrompts);
            // 重新加载分组界面
            setTimeout(() => {
                $('#preset-manager-grouping-popup').remove();
                showPromptGroupingUI();
            }, 100);
        }
    });
    // 加入分组
    $('#add-to-group-btn').on('click', async () => {
        if (selectedPrompts.length === 0) {
            toastr.error('请选择要加入分组的条目');
            return;
        }
        // 检查选中的条目是否已经在其他分组中
        const alreadyGroupedPrompts = [];
        selectedPrompts.forEach(promptId => {
            const existingGroup = findPromptInGroups(existingGroups, promptId);
            if (existingGroup) {
                alreadyGroupedPrompts.push(promptId);
            }
        });
        if (alreadyGroupedPrompts.length > 0) {
            // 获取已分组条目的名称
            const alreadyGroupedNames = alreadyGroupedPrompts.map(promptId => {
                const promptItem = $(`.prompt-item[data-prompt-id="${promptId}"]`);
                return promptItem.find('.prompt-text div:first').text().trim();
            });
            toastr.error(`以下条目已在其他分组中，无法重复分组：${alreadyGroupedNames.slice(0, 3).join('、')}${alreadyGroupedNames.length > 3 ? '等' : ''}`);
            return;
        }
        // 显示分组选择弹窗
        await showGroupSelectionPopup(selectedPrompts, existingGroups);
    });
    // 移出分组
    $('#remove-from-group-btn').on('click', async () => {
        if (selectedPrompts.length === 0) {
            toastr.error('请选择要移出分组的条目');
            return;
        }
        // 检查选中的条目是否在分组中
        const groupedPrompts = [];
        selectedPrompts.forEach(promptId => {
            const existingGroup = findPromptInGroups(existingGroups, promptId);
            if (existingGroup) {
                groupedPrompts.push(promptId);
            }
        });
        if (groupedPrompts.length === 0) {
            toastr.error('选中的条目都不在任何分组中');
            return;
        }
        const confirmChoice = await triggerSlash(`/popup okButton="确认移出" cancelButton="取消" result=true "确定要将选中的 ${groupedPrompts.length} 个条目移出分组吗？"`);
        if (confirmChoice === '1') {
            await removePromptsFromGroups(groupedPrompts, existingGroups);
            // 重新加载分组界面
            setTimeout(() => {
                $('#preset-manager-grouping-popup').remove();
                showPromptGroupingUI();
            }, 100);
        }
    });
    // 创建分组
    $('#create-group-btn').on('click', async () => {
        const groupName = $('#group-name-input').val()?.toString().trim();
        if (!groupName) {
            toastr.error('请输入分组名称');
            return;
        }
        if (selectedPrompts.length === 0) {
            toastr.error('请选择要分组的条目');
            return;
        }
        // 检测选中条目是否都属于同一个分组
        const parentGroup = detectCommonParentGroup(selectedPrompts, existingGroups);
        if (parentGroup) {
            // 选中的条目都属于同一个分组，创建子分组
            await createSubGroup(parentGroup, groupName, selectedPrompts, existingGroups);
        }
        else {
            // 检查选中的条目是否已经在其他分组中
            const alreadyGroupedPrompts = [];
            selectedPrompts.forEach(promptId => {
                const existingGroup = findPromptInGroups(existingGroups, promptId);
                if (existingGroup) {
                    alreadyGroupedPrompts.push(promptId);
                }
            });
            if (alreadyGroupedPrompts.length > 0) {
                // 获取已分组条目的名称
                const alreadyGroupedNames = alreadyGroupedPrompts.map(promptId => {
                    const promptItem = $(`.prompt-item[data-prompt-id="${promptId}"]`);
                    return promptItem.find('span:first').text().trim();
                });
                toastr.error(`以下条目已在其他分组中，无法重复分组：${alreadyGroupedNames.slice(0, 3).join('、')}${alreadyGroupedNames.length > 3 ? '等' : ''}`);
                return;
            }
            // 检查是否有重名的顶级分组
            if (existingGroups.some(g => g.name === groupName)) {
                toastr.error('分组名称已存在');
                return;
            }
            // 创建新的顶级分组
            await createTopLevelGroup(groupName, selectedPrompts, existingGroups);
        }
        // 更新界面状态
        updateExistingGroupsInfo(existingGroups);
        $('#group-name-input').val('');
        $('.prompt-checkbox').prop('checked', false);
        selectedPrompts = [];
        // 保存分组配置
        const currentPresetName = TavernHelper.getLoadedPresetName();
        const validGroups = existingGroups.filter(g => hasValidContent(g));
        savePresetGrouping(currentPresetName, validGroups);
    });
    // 移除分组
    $('#remove-group-btn').on('click', () => {
        if (selectedPrompts.length === 0) {
            toastr.error('请选择要移除分组的条目');
            return;
        }
        // 递归从所有分组（包括子分组）中移除选中的条目
        function removePromptsFromGroups(groups, promptIds) {
            groups.forEach(group => {
                // 从当前分组的直接条目中移除
                group.promptIds = group.promptIds.filter(id => !promptIds.includes(id));
                // 递归处理子分组
                if (group.subGroups.length > 0) {
                    removePromptsFromGroups(group.subGroups, promptIds);
                }
            });
        }
        // 从所有分组中移除选中的条目
        removePromptsFromGroups(existingGroups, selectedPrompts);
        // 递归移除空分组（包括子分组）
        function removeEmptyGroups(groups) {
            for (let i = groups.length - 1; i >= 0; i--) {
                const group = groups[i];
                // 递归处理子分组
                if (group.subGroups.length > 0) {
                    removeEmptyGroups(group.subGroups);
                }
                // 检查当前分组是否为空（没有直接条目且没有子分组）
                if (group.promptIds.length === 0 && group.subGroups.length === 0) {
                    groups.splice(i, 1);
                }
            }
        }
        removeEmptyGroups(existingGroups);
        // 更新UI
        selectedPrompts.forEach(promptId => {
            const item = $(`.prompt-item[data-prompt-id="${promptId}"]`);
            item.css('background-color', '#fff');
            item.find('.group-tag').remove();
            // 清除分组路径显示
            const promptText = item.find('.prompt-text');
            if (promptText.length > 0) {
                promptText.find('div:last-child').remove(); // 移除分组路径div
            }
        });
        updateExistingGroupsInfo(existingGroups);
        $('.prompt-checkbox').prop('checked', false);
        selectedPrompts = [];
        // 保存分组配置并立即应用
        const currentPresetName = TavernHelper.getLoadedPresetName();
        const validGroups = existingGroups.filter(g => hasValidContent(g));
        savePresetGrouping(currentPresetName, validGroups);
        // 立即应用分组到DOM
        applyGroupingToDOM(validGroups);
        // 延迟恢复以确保DOM更新完成
        setTimeout(() => {
            restoreGroupingImmediate();
        }, 100);
        toastr.success('已移除选中条目的分组');
    });
    // 解散分组
    $('#dissolve-group-btn').on('click', async () => {
        if (existingGroups.length === 0) {
            toastr.info('当前没有分组可以解散');
            return;
        }
        // 显示解散分组弹窗
        await showDissolveGroupPopup(existingGroups);
    });
    // 清除所有分组
    $('#clear-all-groups-btn').on('click', async () => {
        if (existingGroups.length === 0) {
            toastr.info('当前没有分组需要清除');
            return;
        }
        const confirmChoice = await triggerSlash(`/popup okButton="确认清除" cancelButton="取消" result=true "确定要清除当前预设的所有分组吗？此操作不可撤销。"`);
        if (confirmChoice === '1') {
            // 清空分组数组
            existingGroups.length = 0;
            // 更新UI显示
            $('.prompt-item').each(function () {
                $(this).css('background-color', '#fff');
                $(this).find('.group-tag').remove();
                // 清除分组路径显示
                const promptText = $(this).find('.prompt-text');
                if (promptText.length > 0) {
                    promptText.find('div:last-child').remove(); // 移除分组路径div
                }
            });
            updateExistingGroupsInfo(existingGroups);
            $('.prompt-checkbox').prop('checked', false);
            selectedPrompts = [];
            // 保存分组配置并立即应用
            const currentPresetName = TavernHelper.getLoadedPresetName();
            const validGroups = existingGroups.filter(g => g.promptIds.length > 0);
            savePresetGrouping(currentPresetName, validGroups);
            // 立即应用分组到DOM
            applyGroupingToDOM(validGroups);
            // 延迟恢复以确保DOM更新完成
            setTimeout(() => {
                restoreGroupingImmediate();
            }, 100);
            toastr.success('已清除所有分组');
        }
    });
    // 关闭
    $('#grouping-close').on('click', () => {
        // 关闭前确保保存当前的分组状态
        const currentPresetName = TavernHelper.getLoadedPresetName();
        const validGroups = existingGroups.filter(g => hasValidContent(g));
        savePresetGrouping(currentPresetName, validGroups);
        // 确保分组应用到预设界面
        applyGroupingToDOM(validGroups);
        // 重置事件绑定标记
        groupingEventsBound = false;
        $('#preset-manager-grouping-popup').remove();
        console.log('分组界面关闭，已保存并应用分组配置');
    });
    // 下拉菜单交互逻辑
    $('#group-management-btn').on('click', function (e) {
        e.stopPropagation();
        const menu = $('#group-management-menu');
        menu.toggle();
        // 关闭其他菜单
        $('#item-selection-menu, #item-edit-menu').hide();
    });
    $('#item-selection-btn').on('click', function (e) {
        e.stopPropagation();
        const menu = $('#item-selection-menu');
        menu.toggle();
        // 关闭其他菜单
        $('#group-management-menu, #item-edit-menu').hide();
    });
    $('#item-edit-btn').on('click', function (e) {
        e.stopPropagation();
        const menu = $('#item-edit-menu');
        menu.toggle();
        // 关闭其他菜单
        $('#group-management-menu, #item-selection-menu').hide();
    });
    // 关闭按钮事件 - 使用更具体的选择器避免重复绑定
    $(document)
        .off('click', '.dropdown-close-btn')
        .on('click', '.dropdown-close-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const menu = $(this).closest('[id$="-menu"]');
        if (menu.length > 0) {
            menu.hide();
            console.log('下拉菜单已关闭:', menu.attr('id'));
        }
        else {
            console.warn('未找到对应的菜单元素');
        }
    });
    // 为每个具体的关闭按钮单独绑定事件，确保能正常工作
    $('#group-management-menu .dropdown-close-btn')
        .off('click')
        .on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $('#group-management-menu').hide();
        console.log('分组管理菜单已关闭');
    });
    $('#item-selection-menu .dropdown-close-btn')
        .off('click')
        .on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $('#item-selection-menu').hide();
        console.log('条目选择菜单已关闭');
    });
    $('#item-edit-menu .dropdown-close-btn')
        .off('click')
        .on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $('#item-edit-menu').hide();
        console.log('条目编辑菜单已关闭');
    });
    // 点击其他地方关闭所有菜单
    $(document).on('click', function (e) {
        if (!$(e.target).closest('[id$="-btn"], [id$="-menu"]').length) {
            $('#group-management-menu, #item-selection-menu, #item-edit-menu').hide();
        }
    });
}
// 应用分组到DOM
function applyGroupingToDOM(groups) {
    console.log('开始应用分组到DOM，分组数量:', groups.length);
    // 检查是否有预设条目存在
    const promptElements = $('.completion_prompt_manager_prompt');
    if (promptElements.length === 0) {
        console.warn('未找到预设条目，无法应用分组');
        return;
    }
    console.log('找到预设条目数量:', promptElements.length);
    // 先确保所有条目都从分组容器中移出，然后再移除分组容器
    $('.prompt-group-container').each(function () {
        const container = $(this);
        const prompts = container.find('.completion_prompt_manager_prompt');
        // 将条目移动到分组容器之前
        container.before(prompts);
    });
    // 移除现有的分组容器
    $('.prompt-group-container').remove();
    // 递归应用分组
    applyGroupsRecursively(groups, 0);
}
// 递归应用分组到DOM
function applyGroupsRecursively(groups, level) {
    groups.forEach(group => {
        // 检查分组是否有内容（条目或子分组）
        if (!hasValidContent(group))
            return;
        console.log('处理分组:', group.name, '层级:', level, '条目数量:', group.promptIds.length, '子分组数量:', group.subGroups.length);
        // 获取分组中所有条目（包括子分组中的条目）
        const allPromptIds = getAllPromptIdsFromGroup(group);
        if (allPromptIds.length === 0) {
            console.log('分组没有条目，跳过:', group.name);
            return;
        }
        // 找到分组中的第一个条目作为插入点
        let firstPromptElement = null;
        for (const promptId of allPromptIds) {
            const element = $(`.completion_prompt_manager_prompt[data-pm-identifier="${promptId}"]`);
            if (element.length > 0) {
                firstPromptElement = element;
                break;
            }
        }
        if (!firstPromptElement || firstPromptElement.length === 0) {
            console.log('未找到分组的任何条目:', group.name);
            return;
        }
        console.log('找到第一个条目，开始创建分组容器');
        // 统计分组内启用的条目数量（包括子分组）
        const enabledCount = allPromptIds.filter(promptId => {
            const promptElement = $(`.completion_prompt_manager_prompt[data-pm-identifier="${promptId}"]`);
            return promptElement.find('.prompt-manager-toggle-action').hasClass('fa-toggle-on');
        }).length;
        // 创建分组容器
        const indentStyle = level > 0 ? `margin-left: ${level * 20}px;` : '';
        const groupContainer = $(`
      <div class="prompt-group-container" data-group-id="${group.id}" style="border: 1px solid rgba(128, 128, 128, 0.3); margin: 5px 0; background-color: rgba(0, 0, 0, 0.05); ${indentStyle} overflow: visible;">
        <div class="prompt-group-header" style="padding: 6px 10px; background-color: rgba(0, 0, 0, 0.08); cursor: pointer; display: flex; align-items: center;">
          <span class="group-toggle-icon" style="margin-right: 6px; font-size: 12px; color: inherit;">${group.collapsed ? '▶' : '▼'}</span>
          <span style="font-weight: bold; color: inherit;">${$('<div/>').text(group.name).html()}</span>
          <span style="margin-left: 8px; font-size: 12px; color: #666;">(${enabledCount}/${allPromptIds.length})</span>
        </div>
        <div class="prompt-group-content" style="padding: 3px; min-height: 0; overflow: visible; ${group.collapsed ? 'display: none;' : 'display: block;'}"></div>
      </div>
    `);
        // 将分组插入到第一个条目之前
        firstPromptElement.before(groupContainer);
        console.log('分组容器已插入到DOM');
        // 将分组中的直接条目移动到分组容器中
        group.promptIds.forEach(promptId => {
            // 尝试多种选择器来查找条目
            let promptElement = $(`.completion_prompt_manager_prompt[data-pm-identifier="${promptId}"]`);
            // 如果没找到，尝试在子元素中查找
            if (promptElement.length === 0) {
                promptElement = $(`.completion_prompt_manager_prompt`).filter(function () {
                    return ($(this).data('pm-identifier') === promptId ||
                        $(this).find('[data-pm-identifier]').data('pm-identifier') === promptId);
                });
            }
            if (promptElement.length > 0) {
                groupContainer.find('.prompt-group-content').append(promptElement);
                console.log('移动条目到分组容器:', promptId);
            }
            else {
                console.warn('未找到条目:', promptId);
            }
        });
        // 递归处理子分组
        if (group.subGroups.length > 0) {
            // 创建子分组的容器
            const subGroupsContainer = $('<div class="subgroups-container"></div>');
            groupContainer.find('.prompt-group-content').append(subGroupsContainer);
            // 递归应用子分组
            applySubGroupsToContainer(group.subGroups, subGroupsContainer, level + 1);
        }
        console.log('分组容器创建完成，条目数量:', groupContainer.find('.completion_prompt_manager_prompt').length);
        // 绑定展开/折叠事件（使用立即执行函数避免闭包问题）
        (function (currentGroup) {
            const header = groupContainer.find('.prompt-group-header');
            console.log('为主分组绑定事件:', currentGroup.name, '头部元素数量:', header.length);
            // 先解绑旧事件，防止重复绑定
            header.off('click');
            header.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const content = $(this).siblings('.prompt-group-content');
                const icon = $(this).find('.group-toggle-icon');
                console.log('主分组点击事件触发:', currentGroup.name);
                console.log('内容元素数量:', content.length, '图标元素数量:', icon.length);
                console.log('当前内容可见状态:', content.is(':visible'));
                if (content.is(':visible') && content.css('display') !== 'none') {
                    content.css('display', 'none');
                    icon.text('▶');
                    currentGroup.collapsed = true;
                    console.log('主分组已折叠:', currentGroup.name);
                }
                else {
                    content.css({
                        display: 'block',
                        visibility: 'visible',
                        height: 'auto',
                        overflow: 'visible',
                    });
                    content.show();
                    icon.text('▼');
                    currentGroup.collapsed = false;
                    console.log('主分组已展开:', currentGroup.name);
                    console.log('主分组展开后内容区域子元素数量:', content.children().length);
                }
            });
        })(group);
    });
}
// 应用子分组到指定容器
function applySubGroupsToContainer(subGroups, container, level) {
    subGroups.forEach(subGroup => {
        if (!hasValidContent(subGroup))
            return;
        console.log('处理子分组:', subGroup.name, '层级:', level);
        // 获取子分组中所有条目
        const allPromptIds = getAllPromptIdsFromGroup(subGroup);
        // 统计启用的条目数量
        const enabledCount = allPromptIds.filter(promptId => {
            const promptElement = $(`.completion_prompt_manager_prompt[data-pm-identifier="${promptId}"]`);
            return promptElement.find('.prompt-manager-toggle-action').hasClass('fa-toggle-on');
        }).length;
        // 创建子分组容器
        const subGroupContainer = $(`
      <div class="prompt-group-container subgroup" data-group-id="${subGroup.id}" style="border: 1px solid rgba(128, 128, 128, 0.2); margin: 3px 0; background-color: rgba(0, 0, 0, 0.03); margin-left: 15px; overflow: visible;">
        <div class="prompt-group-header" style="padding: 4px 8px; background-color: rgba(0, 0, 0, 0.05); cursor: pointer; display: flex; align-items: center;">
          <span class="group-toggle-icon" style="margin-right: 6px; font-size: 11px; color: inherit;">${subGroup.collapsed ? '▶' : '▼'}</span>
          <span style="font-weight: bold; color: inherit; font-size: 13px;">${$('<div/>').text(subGroup.name).html()}</span>
          <span style="margin-left: 8px; font-size: 11px; color: #666;">(${enabledCount}/${allPromptIds.length})</span>
        </div>
        <div class="prompt-group-content" style="padding: 2px; min-height: 0; overflow: visible; ${subGroup.collapsed ? 'display: none;' : 'display: block;'}"></div>
      </div>
    `);
        container.append(subGroupContainer);
        // 移动子分组的直接条目
        console.log('开始移动子分组条目:', subGroup.promptIds);
        subGroup.promptIds.forEach(promptId => {
            let promptElement = $(`.completion_prompt_manager_prompt[data-pm-identifier="${promptId}"]`);
            if (promptElement.length === 0) {
                promptElement = $(`.completion_prompt_manager_prompt`).filter(function () {
                    return ($(this).data('pm-identifier') === promptId ||
                        $(this).find('[data-pm-identifier]').data('pm-identifier') === promptId);
                });
            }
            if (promptElement.length > 0) {
                const contentContainer = subGroupContainer.find('.prompt-group-content');
                contentContainer.append(promptElement);
                console.log('移动条目到子分组容器:', promptId, '容器内条目数量:', contentContainer.children().length);
            }
            else {
                console.warn('未找到条目元素:', promptId);
            }
        });
        const finalContentCount = subGroupContainer.find('.prompt-group-content').children().length;
        console.log('子分组最终包含的元素数量:', finalContentCount);
        // 递归处理更深层的子分组
        if (subGroup.subGroups.length > 0) {
            const deeperSubGroupsContainer = $('<div class="subgroups-container"></div>');
            subGroupContainer.find('.prompt-group-content').append(deeperSubGroupsContainer);
            applySubGroupsToContainer(subGroup.subGroups, deeperSubGroupsContainer, level + 1);
        }
        // 绑定展开/折叠事件（使用立即执行函数避免闭包问题）
        (function (currentSubGroup) {
            const header = subGroupContainer.find('.prompt-group-header');
            console.log('为子分组绑定事件:', currentSubGroup.name, '头部元素数量:', header.length);
            // 先解绑旧事件，防止重复绑定
            header.off('click');
            header.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const content = $(this).siblings('.prompt-group-content');
                const icon = $(this).find('.group-toggle-icon');
                console.log('子分组点击事件触发:', currentSubGroup.name);
                console.log('内容元素数量:', content.length, '图标元素数量:', icon.length);
                console.log('当前内容可见状态:', content.is(':visible'));
                console.log('当前内容display样式:', content.css('display'));
                if (content.is(':visible') && content.css('display') !== 'none') {
                    content.css('display', 'none');
                    icon.text('▶');
                    currentSubGroup.collapsed = true;
                    console.log('子分组已折叠:', currentSubGroup.name);
                }
                else {
                    // 强制显示，并检查内容
                    content.css({
                        display: 'block',
                        visibility: 'visible',
                        height: 'auto',
                        overflow: 'visible',
                    });
                    content.show(); // 双重保险
                    icon.text('▼');
                    currentSubGroup.collapsed = false;
                    console.log('子分组已展开:', currentSubGroup.name);
                    console.log('展开后内容区域子元素数量:', content.children().length);
                    console.log('展开后实际高度:', content.height());
                    // 强制重新渲染
                    setTimeout(() => {
                        content.trigger('resize');
                        console.log('强制重新渲染后高度:', content.height());
                    }, 10);
                }
            });
        })(subGroup);
    });
}
// 获取分组中的所有条目ID（递归包括子分组）
function getAllPromptIdsFromGroup(group) {
    let allIds = [...group.promptIds];
    group.subGroups.forEach(subGroup => {
        allIds = allIds.concat(getAllPromptIdsFromGroup(subGroup));
    });
    return allIds;
}
// 加载时恢复分组
function restoreGroupingFromConfig() {
    try {
        const currentPresetName = TavernHelper.getLoadedPresetName();
        const groups = getPresetGrouping(currentPresetName);
        if (groups.length > 0) {
            console.log(`恢复预设 "${currentPresetName}" 的分组配置，共 ${groups.length} 个分组`);
            // 检查是否有预设条目存在
            const promptElements = $('.completion_prompt_manager_prompt');
            if (promptElements.length === 0) {
                console.log('⚠️ 未找到预设条目，延迟恢复分组');
                setTimeout(() => restoreGroupingFromConfig(), 200);
                return;
            }
            // 延迟一点时间确保DOM已加载
            setTimeout(() => {
                applyGroupingToDOM(groups);
            }, 200);
        }
        else {
            console.log(`预设 "${currentPresetName}" 没有分组配置`);
        }
    }
    catch (error) {
        console.error('恢复分组配置失败:', error);
    }
}
// 延迟恢复分组（用于DOM变化后）
// 防抖恢复分组
let restoreTimeout = null;
// 智能延迟恢复，根据操作类型调整延迟时间
function restoreGroupingDelayed(delay = 200, operation = 'unknown') {
    if (restoreTimeout) {
        clearTimeout(restoreTimeout);
    }
    // 根据操作类型调整延迟时间
    let actualDelay = delay;
    switch (operation) {
        case 'toggle':
            actualDelay = 100; // 开关操作最快
            break;
        case 'settings':
            actualDelay = 200; // 设置更新中等
            break;
        case 'dom_change':
            actualDelay = 150; // DOM变化较快
            break;
        case 'preset_change':
            actualDelay = 100; // 预设切换最快
            break;
        default:
            actualDelay = delay;
    }
    restoreTimeout = window.setTimeout(() => {
        console.log(`🔄 延迟恢复分组开始... (操作: ${operation}, 延迟: ${actualDelay}ms)`);
        restoreGroupingFromConfig();
        restoreTimeout = null;
    }, actualDelay);
}
// 立即恢复分组（用于关键操作）
function restoreGroupingImmediate() {
    console.log('⚡ 立即恢复分组...');
    restoreGroupingFromConfig();
}
// 强制恢复分组（多次尝试确保成功）
function forceRestoreGrouping() {
    const tryRestore = (attempt) => {
        const currentPresetName = TavernHelper.getLoadedPresetName();
        const groups = getPresetGrouping(currentPresetName);
        const promptElements = $('.completion_prompt_manager_prompt');
        console.log(`第${attempt}次尝试恢复分组，预设: ${currentPresetName}, 分组数: ${groups.length}, 条目数: ${promptElements.length}`);
        if (groups.length > 0 && promptElements.length > 0) {
            applyGroupingToDOM(groups);
            console.log('✅ 分组恢复成功');
        }
        else if (attempt < 5) {
            // 如果还没有条目或分组，继续尝试
            setTimeout(() => tryRestore(attempt + 1), 200);
        }
        else {
            console.log('⚠️ 分组恢复失败，已达到最大尝试次数');
        }
    };
    tryRestore(1);
}
// 主动触发分组恢复（用于关键操作后）
function triggerGroupingRestore() {
    console.log('🔄 主动触发分组恢复...');
    // 先清除现有的分组效果
    clearAllGrouping();
    // 然后延迟恢复
    restoreGroupingDelayed(150, 'dom_change');
}
// 清除所有分组
function clearAllGrouping() {
    $('.prompt-group-container').each(function () {
        const prompts = $(this).find('.completion_prompt_manager_prompt');
        $(this).before(prompts);
        $(this).remove();
    });
}
// 导出当前预设的分组配置
function exportPresetGrouping(presetName) {
    const groups = getPresetGrouping(presetName);
    return groups.length > 0 ? groups : null;
}
// 导入分组配置到指定预设
function importPresetGrouping(presetName, groups) {
    if (!groups || !Array.isArray(groups) || groups.length === 0) {
        console.warn('导入的分组配置为空或格式不正确');
        return;
    }
    console.log('开始导入分组配置到预设:', presetName, '分组数量:', groups.length);
    // 验证并修复分组数据结构
    const validGroups = groups
        .map(group => {
        // 确保分组对象有所有必需的字段
        const validGroup = {
            id: group.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: group.name || '未命名分组',
            promptIds: Array.isArray(group.promptIds) ? group.promptIds : [],
            subGroups: Array.isArray(group.subGroups) ? group.subGroups : [],
            collapsed: typeof group.collapsed === 'boolean' ? group.collapsed : true,
            level: typeof group.level === 'number' ? group.level : 0,
            parentId: group.parentId,
        };
        console.log('处理分组:', validGroup.name, '条目数量:', validGroup.promptIds.length);
        return validGroup;
    })
        .filter(group => group.promptIds.length > 0); // 只保留有条目的分组
    if (validGroups.length === 0) {
        console.warn('没有有效的分组配置');
        return;
    }
    console.log('有效分组数量:', validGroups.length);
    savePresetGrouping(presetName, validGroups);
    // 如果是当前预设，立即应用
    const currentPresetName = TavernHelper.getLoadedPresetName();
    console.log('当前预设:', currentPresetName, '目标预设:', presetName);
    if (currentPresetName === presetName) {
        console.log('立即应用分组到当前预设');
        setTimeout(() => {
            applyGroupingToDOM(validGroups);
        }, 100);
    }
}
// 获取所有预设的分组配置（用于批量导出）
function getAllPresetGroupings() {
    const allGroupings = {};
    // 遍历localStorage中所有的分组配置
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('miaomiao_preset_groups_')) {
            const presetName = key.replace('miaomiao_preset_groups_', '');
            const groups = getPresetGrouping(presetName);
            if (groups.length > 0) {
                allGroupings[presetName] = groups;
            }
        }
    }
    return allGroupings;
}
// 清除指定预设的分组配置
function clearPresetGrouping(presetName) {
    localStorage.removeItem(getGroupingStorageKey(presetName));
    // 如果是当前预设，清除DOM中的分组
    const currentPresetName = TavernHelper.getLoadedPresetName();
    if (currentPresetName === presetName) {
        clearAllGrouping();
    }
}
// 显示位置选择弹窗
async function showPositionSelectionPopup(allPrompts, selectedPromptIds, onConfirm) {
    const popupId = 'position-selection-popup';
    $(`#${popupId}`).remove();
    // 过滤掉已选中的条目，只显示可以作为目标的条目
    const availablePrompts = allPrompts.filter(prompt => !selectedPromptIds.includes(prompt.id));
    if (availablePrompts.length === 0) {
        toastr.error('没有可用的目标位置');
        return;
    }
    const promptsHtml = availablePrompts
        .map(prompt => `
    <div class="position-target-item" data-prompt-id="${prompt.id}" style="border: 1px solid #e0e0e0; margin: 5px 0; border-radius: 6px; background-color: #fff;">
      <div style="padding: 10px; font-weight: ${prompt.enabled ? 'bold' : 'normal'}; color: ${prompt.enabled ? '#000' : '#666'}; font-size: 14px;">
        ${$('<div/>').text(prompt.name).html()}
      </div>
      <div style="display: flex; border-top: 1px solid #f0f0f0;">
        <button class="position-btn" data-prompt-id="${prompt.id}" data-position="above" style="flex: 1; padding: 8px; background-color: #e3f2fd; border: none; border-right: 1px solid #f0f0f0; cursor: pointer; font-size: 13px; color: #1976d2;">移动到上方</button>
        <button class="position-btn" data-prompt-id="${prompt.id}" data-position="below" style="flex: 1; padding: 8px; background-color: #f3e5f5; border: none; cursor: pointer; font-size: 13px; color: #7b1fa2;">移动到下方</button>
      </div>
    </div>
  `)
        .join('');
    const popupHtml = `
    <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10003; display: flex; align-items: center; justify-content: center;">
      <div class="position-selection-popup-content" style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 600px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
        <h4 style="margin-top:0; color:#6a4226; text-align: center; border-bottom: 2px solid #f0d8b6; padding-bottom: 10px;">选择移动位置</h4>
        
        <div style="margin: 15px 0; padding: 12px; background-color: #e8f5e8; border-radius: 8px; border-left: 4px solid #4CAF50;">
          <div style="font-size: 13px; color: #2e7d32; font-weight: bold; margin-bottom: 6px;">📋 移动说明</div>
          <div style="font-size: 12px; color: #424242; line-height: 1.4;">
            已选择 ${selectedPromptIds.length} 个条目进行移动。点击目标条目的"移动到上方"或"移动到下方"按钮来设置新位置。
          </div>
        </div>

        <div style="flex: 1; min-height: 0; overflow-y: auto; border: 1px solid #f0e2d0; border-radius: 8px; padding: 12px; margin-bottom: 15px;">
          <div style="font-size: 13px; color: #666; margin-bottom: 12px;">选择要移动到哪个条目的上方或下方：</div>
          <div id="position-targets-container">
            ${promptsHtml}
          </div>
        </div>

        <div style="display: flex; justify-content: center;">
          <button id="position-selection-cancel" style="padding: 10px 16px; background-color:#9E9E9E; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#fff; font-size: 14px;">取消</button>
        </div>
      </div>
    </div>
    <style>
      .position-btn:hover {
        opacity: 0.8;
        font-weight: bold;
      }
      @media (max-width: 600px) {
        #${popupId} {
          align-items: flex-start !important;
          padding: 10px;
        }
        #${popupId} .position-selection-popup-content {
          margin-top: 5vh !important;
          max-height: 90vh !important;
          width: 95% !important;
          padding: 15px;
          border-radius: 12px;
        }
        #${popupId} .position-btn {
          font-size: 12px !important;
          padding: 6px !important;
        }
      }
      @media (max-width: 480px) {
        #${popupId} .position-selection-popup-content {
          margin-top: 2vh !important;
          max-height: 96vh !important;
          padding: 12px;
        }
        #${popupId} h4 {
          font-size: 16px !important;
        }
        #${popupId} .position-btn {
          font-size: 11px !important;
          padding: 5px !important;
        }
      }
    </style>
  `;
    $('body').append(popupHtml);
    // 绑定事件
    $('.position-btn').on('click', function () {
        const targetPromptId = $(this).data('prompt-id');
        const position = $(this).data('position');
        $(`#${popupId}`).remove();
        onConfirm(targetPromptId, position);
    });
    $('#position-selection-cancel').on('click', () => {
        $(`#${popupId}`).remove();
    });
}
// 移动条目到指定位置
function movePromptsToPosition(selectedPromptIds, targetPromptId, position) {
    console.log('开始移动条目:', selectedPromptIds, '到', targetPromptId, position);
    // 通过酒馆助手获取当前预设的条目顺序
    const currentPrompts = getCurrentPresetPrompts();
    const promptIds = currentPrompts.map(p => p.id);
    // 创建新的顺序数组
    const newOrder = [...promptIds];
    // 从原位置移除选中的条目
    selectedPromptIds.forEach(id => {
        const index = newOrder.indexOf(id);
        if (index > -1) {
            newOrder.splice(index, 1);
        }
    });
    // 找到目标位置
    const targetIndex = newOrder.indexOf(targetPromptId);
    if (targetIndex === -1) {
        console.error('未找到目标条目:', targetPromptId);
        toastr.error('移动失败：未找到目标条目');
        return;
    }
    // 计算插入位置
    const insertIndex = position === 'above' ? targetIndex : targetIndex + 1;
    // 在目标位置插入选中的条目
    newOrder.splice(insertIndex, 0, ...selectedPromptIds);
    console.log('新的条目顺序:', newOrder);
    // 应用新顺序到DOM
    applyNewPromptOrder(newOrder);
    // 更新分组界面的显示顺序
    updateGroupingUIOrder(newOrder);
}
// 应用新的条目顺序到DOM
function applyNewPromptOrder(newOrder) {
    console.log('应用新的条目顺序到DOM');
    const container = $('.completion_prompt_manager_prompt').first().parent();
    if (container.length === 0) {
        console.error('未找到预设条目容器');
        return;
    }
    // 按新顺序重新排列DOM元素
    newOrder.forEach(promptId => {
        const element = $(`.completion_prompt_manager_prompt[data-pm-identifier="${promptId}"]`);
        if (element.length === 0) {
            // 尝试在子元素中查找
            const fallbackElement = $(`.completion_prompt_manager_prompt`).filter(function () {
                return $(this).find('[data-pm-identifier]').data('pm-identifier') === promptId;
            });
            if (fallbackElement.length > 0) {
                container.append(fallbackElement);
            }
        }
        else {
            container.append(element);
        }
    });
    console.log('DOM顺序更新完成');
}
// 更新分组界面的显示顺序
function updateGroupingUIOrder(newOrder) {
    console.log('更新分组界面的显示顺序');
    const promptsContainer = $('#prompts-container');
    if (promptsContainer.length === 0) {
        console.log('分组界面未打开，跳过界面更新');
        return;
    }
    // 按新顺序重新排列分组界面中的条目
    newOrder.forEach(promptId => {
        const item = $(`.prompt-item[data-prompt-id="${promptId}"]`);
        if (item.length > 0) {
            promptsContainer.append(item);
        }
    });
    console.log('分组界面顺序更新完成');
}
// 显示新增条目弹窗
async function showAddPromptPopup(onSuccess) {
    const popupId = 'add-prompt-popup';
    $(`#${popupId}`).remove();
    // 获取当前所有条目用于位置选择
    const currentPrompts = getCurrentPresetPrompts();
    const popupHtml = `
    <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10004; display: flex; align-items: center; justify-content: center;">
      <div class="add-prompt-popup-content" style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 700px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 90vh; overflow: hidden;">
        <h4 style="margin-top:0; color:#6a4226; text-align: center; border-bottom: 2px solid #f0d8b6; padding-bottom: 10px; flex-shrink: 0;">新增条目</h4>
        
        <div style="flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 15px;">
          <div style="margin: 15px 0;">
            <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #6a4226;">条目名称：</label>
            <input type="text" id="add-prompt-name" placeholder="输入条目名称..." style="width: 100%; padding: 10px; border: 1px solid #d4b58b; border-radius: 6px; background: #fff; color: #333; font-size: 14px; margin-bottom: 15px; box-sizing: border-box;">
            
            <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #6a4226;">条目内容：</label>
            <textarea id="add-prompt-content" placeholder="输入条目内容..." style="width: 100%; height: 120px; padding: 10px; border: 1px solid #d4b58b; border-radius: 6px; background: #fff; color: #333; font-size: 14px; resize: vertical; box-sizing: border-box;"></textarea>
          </div>

          <div style="margin: 15px 0;">
            <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #6a4226;">插入位置：</label>
            <div style="display: flex; gap: 10px; margin-bottom: 10px;">
              <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="radio" name="position-type" value="end" checked style="margin-right: 6px;">
                <span style="font-size: 14px;">添加到末尾</span>
              </label>
              <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="radio" name="position-type" value="custom" style="margin-right: 6px;">
                <span style="font-size: 14px;">插入到指定位置</span>
              </label>
            </div>
            
            <div id="position-selection-container" style="display: none; border: 1px solid #e0e0e0; border-radius: 6px; max-height: 250px; overflow-y: auto;">
              ${currentPrompts
        .map(prompt => `
                <div class="position-option" data-prompt-id="${prompt.id}" style="border-bottom: 1px solid #f0f0f0; last-child:border-bottom: none;">
                  <div style="padding: 8px 12px; font-weight: ${prompt.enabled ? 'bold' : 'normal'}; color: ${prompt.enabled ? '#000' : '#666'}; font-size: 13px; background-color: #fafafa;">
                    ${$('<div/>').text(prompt.name).html()}
                  </div>
                  <div style="display: flex;">
                    <button class="position-btn" data-prompt-id="${prompt.id}" data-position="above" style="flex: 1; padding: 6px; background-color: #e3f2fd; border: none; border-right: 1px solid #f0f0f0; cursor: pointer; font-size: 12px; color: #1976d2;">插入到上方</button>
                    <button class="position-btn" data-prompt-id="${prompt.id}" data-position="below" style="flex: 1; padding: 6px; background-color: #f3e5f5; border: none; cursor: pointer; font-size: 12px; color: #7b1fa2;">插入到下方</button>
                  </div>
                </div>
              `)
        .join('')}
            </div>
            
            <div id="selected-position-info" style="margin-top: 10px; padding: 8px; background-color: #e8f5e8; border-radius: 4px; font-size: 13px; color: #2e7d32; display: none;">
              <strong>选择的位置：</strong><span id="position-description"></span>
            </div>
          </div>

          <div style="margin: 15px 0; padding: 12px; background-color: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196F3;">
            <div style="font-size: 13px; color: #1976d2; font-weight: bold; margin-bottom: 6px;">💡 提示</div>
            <div style="font-size: 12px; color: #424242; line-height: 1.4;">
              选择"添加到末尾"会将新条目放在预设的最后。选择"插入到指定位置"可以精确控制新条目的位置。
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-shrink: 0; border-top: 1px solid #f0e2d0; padding-top: 15px;">
          <div style="display: flex; align-items: center;">
            <input type="checkbox" id="add-prompt-enabled" checked style="margin-right: 8px; transform: scale(1.2);">
            <label for="add-prompt-enabled" style="font-size: 13px; color: #666;">启用条目</label>
          </div>
          <div style="display: flex; gap: 8px;">
            <button id="add-prompt-cancel" style="padding: 10px 16px; background-color:#9E9E9E; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#fff; font-size: 14px;">取消</button>
            <button id="add-prompt-confirm" style="padding: 10px 16px; background-color:#4CAF50; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#fff; font-size: 14px;">创建条目</button>
          </div>
        </div>
      </div>
    </div>
    <style>
      @media (max-width: 600px) {
        #${popupId} {
          align-items: flex-start !important;
          padding: 10px;
        }
        #${popupId} .add-prompt-popup-content {
          margin-top: 5vh !important;
          max-height: 90vh !important;
          width: 95% !important;
          padding: 15px;
          border-radius: 12px;
        }
        #${popupId} textarea {
          height: 150px !important;
        }
      }
      @media (max-width: 480px) {
        #${popupId} .add-prompt-popup-content {
          margin-top: 2vh !important;
          max-height: 96vh !important;
          padding: 12px;
        }
        #${popupId} h4 {
          font-size: 16px !important;
        }
        #${popupId} textarea {
          height: 120px !important;
        }
      }
    </style>
  `;
    $('body').append(popupHtml);
    // 存储选择的位置信息
    let selectedPosition = null;
    // 绑定事件
    $('#add-prompt-cancel').on('click', () => {
        $(`#${popupId}`).remove();
    });
    // 位置类型切换
    $('input[name="position-type"]').on('change', function () {
        const positionType = $(this).val();
        if (positionType === 'custom') {
            $('#position-selection-container').show();
        }
        else {
            $('#position-selection-container').hide();
            $('#selected-position-info').hide();
            selectedPosition = null;
        }
    });
    // 位置选择按钮点击
    $('.position-btn').on('click', function () {
        const targetId = $(this).data('prompt-id');
        const position = $(this).data('position');
        // 清除之前的选择状态
        $('.position-btn').removeClass('selected').css('font-weight', 'normal');
        // 设置当前选择状态
        $(this).addClass('selected').css('font-weight', 'bold');
        selectedPosition = { targetId, position };
        // 显示选择信息
        const targetPrompt = currentPrompts.find(p => p.id === targetId);
        if (targetPrompt) {
            const positionText = position === 'above' ? '上方' : '下方';
            $('#position-description').text(`插入到"${targetPrompt.name}"的${positionText}`);
            $('#selected-position-info').show();
        }
    });
    $('#add-prompt-confirm').on('click', async () => {
        const name = $('#add-prompt-name').val()?.toString().trim();
        const content = $('#add-prompt-content').val()?.toString().trim();
        const enabled = $('#add-prompt-enabled').is(':checked');
        const positionType = $('input[name="position-type"]:checked').val();
        if (!name) {
            toastr.error('请输入条目名称');
            return;
        }
        if (!content) {
            toastr.error('请输入条目内容');
            return;
        }
        if (positionType === 'custom' && !selectedPosition) {
            toastr.error('请选择插入位置');
            return;
        }
        try {
            if (positionType === 'end' || !selectedPosition) {
                // 添加到末尾
                await addNewPrompt(name, content, enabled);
            }
            else {
                // 插入到指定位置
                await addNewPromptAtPosition(name, content, enabled, selectedPosition.targetId, selectedPosition.position);
            }
            $(`#${popupId}`).remove();
            toastr.success(`条目 "${name}" 创建成功`);
            onSuccess();
        }
        catch (error) {
            console.error('创建条目失败:', error);
            toastr.error('创建条目失败，请重试');
        }
    });
}
// 显示编辑条目弹窗
async function showEditPromptPopup(prompt, onSuccess) {
    const popupId = 'edit-prompt-popup';
    $(`#${popupId}`).remove();
    // 获取条目的当前内容
    const currentContent = await getPromptContent(prompt.id);
    const popupHtml = `
    <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10004; display: flex; align-items: center; justify-content: center;">
      <div class="edit-prompt-popup-content" style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 600px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
        <h4 style="margin-top:0; color:#6a4226; text-align: center; border-bottom: 2px solid #f0d8b6; padding-bottom: 10px;">编辑条目</h4>
        
        <div style="margin: 15px 0;">
          <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #6a4226;">条目名称：</label>
          <input type="text" id="edit-prompt-name" value="${$('<div/>').text(prompt.name).html()}" style="width: 100%; padding: 10px; border: 1px solid #d4b58b; border-radius: 6px; background: #fff; color: #333; font-size: 14px; margin-bottom: 15px; box-sizing: border-box;">
          
          <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #6a4226;">条目内容：</label>
          <textarea id="edit-prompt-content" style="width: 100%; height: 200px; padding: 10px; border: 1px solid #d4b58b; border-radius: 6px; background: #fff; color: #333; font-size: 14px; resize: vertical; box-sizing: border-box;">${$('<div/>').text(currentContent).html()}</textarea>
        </div>

        <div style="margin: 15px 0; padding: 12px; background-color: #fff3e0; border-radius: 8px; border-left: 4px solid #ff9800;">
          <div style="font-size: 13px; color: #f57c00; font-weight: bold; margin-bottom: 6px;">✏️ 编辑说明</div>
          <div style="font-size: 12px; color: #424242; line-height: 1.4;">
            修改条目名称和内容后，变更将立即应用到预设中。请确保内容格式正确。
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
          <div style="display: flex; align-items: center;">
            <input type="checkbox" id="edit-prompt-enabled" ${prompt.enabled ? 'checked' : ''} style="margin-right: 8px; transform: scale(1.2);">
            <label for="edit-prompt-enabled" style="font-size: 13px; color: #666;">启用条目</label>
          </div>
          <div style="display: flex; gap: 8px;">
            <button id="edit-prompt-cancel" style="padding: 10px 16px; background-color:#9E9E9E; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#fff; font-size: 14px;">取消</button>
            <button id="edit-prompt-confirm" style="padding: 10px 16px; background-color:#FF9800; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#fff; font-size: 14px;">保存修改</button>
          </div>
        </div>
      </div>
    </div>
    <style>
      @media (max-width: 600px) {
        #${popupId} {
          align-items: flex-start !important;
          padding: 10px;
        }
        #${popupId} .edit-prompt-popup-content {
          margin-top: 5vh !important;
          max-height: 90vh !important;
          width: 95% !important;
          padding: 15px;
          border-radius: 12px;
        }
        #${popupId} textarea {
          height: 150px !important;
        }
      }
      @media (max-width: 480px) {
        #${popupId} .edit-prompt-popup-content {
          margin-top: 2vh !important;
          max-height: 96vh !important;
          padding: 12px;
        }
        #${popupId} h4 {
          font-size: 16px !important;
        }
        #${popupId} textarea {
          height: 120px !important;
        }
      }
    </style>
  `;
    $('body').append(popupHtml);
    // 绑定事件
    $('#edit-prompt-cancel').on('click', () => {
        $(`#${popupId}`).remove();
    });
    $('#edit-prompt-confirm').on('click', async () => {
        const name = $('#edit-prompt-name').val()?.toString().trim();
        const content = $('#edit-prompt-content').val()?.toString().trim();
        const enabled = $('#edit-prompt-enabled').is(':checked');
        if (!name) {
            toastr.error('请输入条目名称');
            return;
        }
        if (!content) {
            toastr.error('请输入条目内容');
            return;
        }
        try {
            await updatePrompt(prompt.id, name, content, enabled);
            $(`#${popupId}`).remove();
            toastr.success(`条目 "${name}" 更新成功`);
            onSuccess();
        }
        catch (error) {
            console.error('更新条目失败:', error);
            toastr.error('更新条目失败，请重试');
        }
    });
}
// 新增条目
async function addNewPrompt(name, content, enabled) {
    console.log('新增条目:', name, enabled);
    try {
        // 使用UUID生成函数
        // 使用酒馆助手的预设API直接创建条目
        await TavernHelper.updatePresetWith('in_use', preset => {
            const newPrompt = {
                id: (0,___WEBPACK_IMPORTED_MODULE_0__/* .generateUUID */ .lk)(),
                name: name,
                enabled: enabled,
                position: {
                    type: 'relative',
                },
                role: 'system',
                content: content,
            };
            // 添加到预设的prompts数组末尾
            preset.prompts.push(newPrompt);
            return preset;
        }, { render: 'immediate' });
        console.log('条目创建成功');
        triggerPresetSave();
    }
    catch (error) {
        console.error('创建条目失败:', error);
        throw error;
    }
}
// 在指定位置插入新条目
async function addNewPromptAtPosition(name, content, enabled, targetId, position) {
    console.log('在指定位置插入新条目:', name, '位置:', targetId, position);
    try {
        // 使用UUID生成函数
        // 直接在指定位置创建条目
        await TavernHelper.updatePresetWith('in_use', preset => {
            const newPrompt = {
                id: (0,___WEBPACK_IMPORTED_MODULE_0__/* .generateUUID */ .lk)(),
                name: name,
                enabled: enabled,
                position: {
                    type: 'relative',
                },
                role: 'system',
                content: content,
            };
            // 找到目标条目的索引
            const targetIndex = preset.prompts.findIndex(p => p.id === targetId);
            if (targetIndex === -1) {
                // 如果找不到目标条目，就添加到末尾
                preset.prompts.push(newPrompt);
            }
            else {
                // 根据位置插入条目
                const insertIndex = position === 'above' ? targetIndex : targetIndex + 1;
                preset.prompts.splice(insertIndex, 0, newPrompt);
            }
            return preset;
        }, { render: 'immediate' });
        console.log('条目创建并插入成功');
        triggerPresetSave();
    }
    catch (error) {
        console.error('在指定位置插入条目失败:', error);
        throw error;
    }
}
// 获取条目内容
async function getPromptContent(promptId) {
    // 尝试从DOM中获取条目内容
    const promptElement = $(`.completion_prompt_manager_prompt[data-pm-identifier="${promptId}"]`);
    if (promptElement.length === 0) {
        console.warn('未找到条目元素:', promptId);
        return '';
    }
    // 查找条目内容元素
    const contentElement = promptElement.find('.completion_prompt_manager_prompt_content, .prompt-content, textarea');
    if (contentElement.length > 0) {
        return contentElement.text() || contentElement.val()?.toString() || '';
    }
    console.warn('未找到条目内容:', promptId);
    return '';
}
// 更新条目
async function updatePrompt(promptId, name, content, enabled) {
    console.log('更新条目:', promptId, name, enabled);
    try {
        // 使用酒馆助手的预设API直接更新条目
        await TavernHelper.updatePresetWith('in_use', preset => {
            // 查找要更新的条目
            const promptToUpdate = preset.prompts.find(p => p.id === promptId);
            if (promptToUpdate) {
                promptToUpdate.name = name;
                promptToUpdate.content = content;
                promptToUpdate.enabled = enabled;
            }
            else {
                // 如果在prompts中没找到，尝试在prompts_unused中查找
                const unusedPromptToUpdate = preset.prompts_unused.find(p => p.id === promptId);
                if (unusedPromptToUpdate) {
                    unusedPromptToUpdate.name = name;
                    unusedPromptToUpdate.content = content;
                    unusedPromptToUpdate.enabled = enabled;
                }
            }
            return preset;
        }, { render: 'immediate' });
        console.log('条目更新成功');
        triggerPresetSave();
    }
    catch (error) {
        console.error('更新条目失败:', error);
        throw error;
    }
}
// 删除选中的条目
async function deleteSelectedPrompts(promptIds) {
    console.log('删除条目:', promptIds);
    try {
        // 使用酒馆助手的预设API直接删除条目
        await TavernHelper.updatePresetWith('in_use', preset => {
            // 从prompts数组中删除条目
            preset.prompts = preset.prompts.filter(p => !promptIds.includes(p.id));
            // 从prompts_unused数组中删除条目
            preset.prompts_unused = preset.prompts_unused.filter(p => !promptIds.includes(p.id));
            return preset;
        }, { render: 'immediate' });
        console.log('删除条目成功:', promptIds);
        triggerPresetSave();
        toastr.success(`成功删除 ${promptIds.length} 个条目`);
    }
    catch (error) {
        console.error('删除条目失败:', promptIds, error);
        toastr.error('删除条目失败，请重试');
    }
}
// 在分组树中查找包含指定条目的分组
function findPromptInGroups(groups, promptId) {
    for (const group of groups) {
        if (group.promptIds.includes(promptId)) {
            return group;
        }
        // 递归查找子分组
        const foundInSubGroups = findPromptInGroups(group.subGroups, promptId);
        if (foundInSubGroups) {
            return foundInSubGroups;
        }
    }
    return null;
}
// 检查分组是否有有效内容（条目或子分组）
function hasValidContent(group) {
    return group.promptIds.length > 0 || group.subGroups.some(subGroup => hasValidContent(subGroup));
}
// 检测选中条目是否都属于同一个分组
function detectCommonParentGroup(selectedPrompts, groups) {
    if (selectedPrompts.length === 0)
        return null;
    // 找到第一个条目所属的分组
    const firstPromptGroup = findPromptInGroups(groups, selectedPrompts[0]);
    if (!firstPromptGroup)
        return null;
    // 检查其他条目是否都属于同一个分组
    for (let i = 1; i < selectedPrompts.length; i++) {
        const promptGroup = findPromptInGroups(groups, selectedPrompts[i]);
        if (!promptGroup || promptGroup.id !== firstPromptGroup.id) {
            return null; // 不是同一个分组
        }
    }
    return firstPromptGroup;
}
// 创建子分组
async function createSubGroup(parentGroup, subGroupName, selectedPrompts, existingGroups) {
    // 检查子分组名称是否与父分组的其他子分组重名
    if (parentGroup.subGroups.some(sg => sg.name === subGroupName)) {
        toastr.error(`子分组名称 "${subGroupName}" 已存在于分组 "${parentGroup.name}" 中`);
        return;
    }
    // 创建新子分组
    const newSubGroup = {
        id: Date.now().toString(),
        name: subGroupName,
        promptIds: [...selectedPrompts],
        subGroups: [],
        collapsed: true,
        level: parentGroup.level + 1,
        parentId: parentGroup.id,
    };
    // 从父分组中移除这些条目
    selectedPrompts.forEach(promptId => {
        const index = parentGroup.promptIds.indexOf(promptId);
        if (index > -1) {
            parentGroup.promptIds.splice(index, 1);
        }
    });
    // 添加子分组
    parentGroup.subGroups.push(newSubGroup);
    // 更新UI
    selectedPrompts.forEach(promptId => {
        const item = $(`.prompt-item[data-prompt-id="${promptId}"]`);
        item.css('background-color', '#e8f5e8');
        const existingTag = item.find('.group-tag');
        const groupPath = getGroupPath(newSubGroup, existingGroups);
        if (existingTag.length) {
            existingTag.text(groupPath);
        }
        else {
            item
                .find('span:last')
                .after(`<span class="group-tag" style="font-size: 12px; color: #4CAF50; background: #e8f5e8; padding: 2px 6px; border-radius: 3px; margin-left: 8px;">${groupPath}</span>`);
        }
    });
    toastr.success(`子分组 "${getGroupPath(newSubGroup, existingGroups)}" 创建成功，将在关闭分组界面时应用`);
}
// 创建顶级分组
async function createTopLevelGroup(groupName, selectedPrompts, existingGroups) {
    // 创建新的顶级分组
    const newGroup = {
        id: Date.now().toString(),
        name: groupName,
        promptIds: [...selectedPrompts],
        subGroups: [],
        collapsed: true,
        level: 0,
    };
    existingGroups.push(newGroup);
    // 更新UI
    selectedPrompts.forEach(promptId => {
        const item = $(`.prompt-item[data-prompt-id="${promptId}"]`);
        item.css('background-color', '#e8f5e8');
        const existingTag = item.find('.group-tag');
        if (existingTag.length) {
            existingTag.text(groupName);
        }
        else {
            item
                .find('span:last')
                .after(`<span class="group-tag" style="font-size: 12px; color: #4CAF50; background: #e8f5e8; padding: 2px 6px; border-radius: 3px; margin-left: 8px;">${groupName}</span>`);
        }
    });
    toastr.success(`分组 "${groupName}" 创建成功，将在关闭分组界面时应用`);
}
// 获取分组的完整路径
function getGroupPath(group, allGroups) {
    const path = [];
    let currentGroup = group;
    while (currentGroup) {
        path.unshift(currentGroup.name);
        if (currentGroup.parentId) {
            currentGroup = findGroupById(allGroups, currentGroup.parentId);
        }
        else {
            break;
        }
    }
    return path.join('/');
}
// 根据ID查找分组（递归查找）
function findGroupById(groups, groupId) {
    for (const group of groups) {
        if (group.id === groupId) {
            return group;
        }
        const foundInSubGroups = findGroupById(group.subGroups, groupId);
        if (foundInSubGroups) {
            return foundInSubGroups;
        }
    }
    return null;
}
// 显示分组选择弹窗
async function showGroupSelectionPopup(selectedPrompts, existingGroups) {
    const popupId = 'group-selection-popup';
    $(`#${popupId}`).remove();
    if (existingGroups.length === 0) {
        toastr.warning('当前没有可用的分组，请先创建分组');
        return;
    }
    // 生成分组列表HTML
    const groupsHtml = generateGroupsListHtml(existingGroups, 0);
    const popupHtml = `
    <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10002; display: flex; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box;">
      <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 100%; max-width: 500px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh; position: relative;">
        <h4 style="margin-top:0; color:#6a4226; text-align: center; border-bottom: 2px solid #f0d8b6; padding-bottom: 10px;">选择目标分组</h4>
        <div style="flex: 1; min-height: 0; overflow-y: auto; margin: 15px 0;">
          <div style="font-size: 13px; color: #666; margin-bottom: 12px; line-height: 1.4;">
            请选择要将 ${selectedPrompts.length} 个条目加入的分组：
          </div>
          <div id="groups-list" style="max-height: 300px; overflow-y: auto;">
            ${groupsHtml}
          </div>
        </div>
        <div style="text-align: right; margin-top: 15px; flex-shrink: 0;">
          <div id="selected-group-info" style="font-size: 12px; color: #666; margin-bottom: 10px; text-align: left; display: none;">
            已选择分组: <span id="selected-group-name" style="font-weight: bold; color: #4CAF50;"></span>
          </div>
          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button id="group-selection-cancel" style="padding: 8px 16px; background-color:#bcaaa4; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">取消</button>
            <button id="group-selection-confirm" style="padding: 8px 16px; background-color:#4CAF50; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#fff; display: none;">加入此分组</button>
          </div>
        </div>
      </div>
    </div>
    <style>
      .group-option.selected-group {
        background-color: #e8f5e8 !important;
        border-color: #4CAF50 !important;
        border-width: 2px !important;
        box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3) !important;
      }
      .group-option.selected-group:hover {
        background-color: #d4edda !important;
      }
      @media (max-width: 768px) {
        #${popupId} {
          align-items: flex-start !important;
          padding: 10px !important;
        }
        #${popupId} > div {
          margin-top: 5vh !important;
          max-height: 85vh !important;
          width: 100% !important;
          padding: 15px !important;
        }
      }
      @media (max-width: 480px) {
        #${popupId} {
          padding: 5px !important;
        }
        #${popupId} > div {
          margin-top: 2vh !important;
          max-height: 90vh !important;
          padding: 12px !important;
        }
      }
    </style>
  `;
    $('body').append(popupHtml);
    let selectedGroup = null;
    // 先解绑所有可能重复的事件，防止脚本重复加载导致的问题
    $('#group-selection-cancel').off('click');
    $('#group-selection-confirm').off('click');
    $(document).off('click', '.group-option');
    // 绑定事件
    $('#group-selection-cancel').on('click', () => {
        $(`#${popupId}`).remove();
    });
    // 确认加入分组
    $('#group-selection-confirm').on('click', async () => {
        if (!selectedGroup) {
            toastr.error('请先选择一个分组');
            return;
        }
        try {
            await addPromptsToGroup(selectedPrompts, selectedGroup, existingGroups);
            $(`#${popupId}`).remove();
            // 重新加载分组界面
            setTimeout(() => {
                $('#preset-manager-grouping-popup').remove();
                showPromptGroupingUI();
            }, 100);
        }
        catch (error) {
            console.error('加入分组失败:', error);
            toastr.error('加入分组失败，请重试');
        }
    });
    // 延迟绑定事件，确保DOM完全加载
    setTimeout(() => {
        console.log('开始绑定分组选择事件');
        console.log('现有分组列表:', existingGroups.map(g => ({ id: g.id, name: g.name, type: typeof g.id })));
        // 直接绑定到弹窗内的元素
        $(`#${popupId} .group-option`)
            .off('click')
            .on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const groupId = $(this).data('group-id');
            console.log('点击分组选项:', groupId, '类型:', typeof groupId, '元素:', this);
            // 确保groupId是字符串类型
            const groupIdStr = String(groupId);
            console.log('转换后的groupId:', groupIdStr, '类型:', typeof groupIdStr);
            const group = findGroupById(existingGroups, groupIdStr);
            console.log('找到分组:', group);
            if (group) {
                // 清除之前的选择
                $(`#${popupId} .group-option`).removeClass('selected-group');
                // 标记当前选择
                $(this).addClass('selected-group');
                selectedGroup = group;
                // 显示选择信息和确认按钮
                const nameElement = $(`#${popupId} #selected-group-name`);
                const infoElement = $(`#${popupId} #selected-group-info`);
                const confirmButton = $(`#${popupId} #group-selection-confirm`);
                console.log('更新UI元素:', {
                    nameElement: nameElement.length,
                    infoElement: infoElement.length,
                    confirmButton: confirmButton.length,
                });
                nameElement.text(group.name);
                infoElement.show();
                confirmButton.show();
                console.log('已选择分组:', group.name, 'UI已更新');
            }
            else {
                console.error('未找到分组:', groupId);
                toastr.error('未找到选中的分组');
            }
        });
        console.log('分组选择事件绑定完成，找到元素数量:', $(`#${popupId} .group-option`).length);
    }, 100);
    // 添加调试信息
    console.log('分组选择弹窗已创建，分组数量:', existingGroups.length);
    console.log('确认按钮元素:', $('#group-selection-confirm').length);
    console.log('选择信息元素:', $('#selected-group-info').length);
}
// 生成分组列表HTML
function generateGroupsListHtml(groups, level) {
    let html = '';
    groups.forEach(group => {
        const hasContent = group.promptIds.length > 0 || group.subGroups.length > 0;
        if (hasContent) {
            html += `
        <div class="group-option" data-group-id="${group.id}" 
             style="padding: 12px; margin: 8px 0; border: 1px solid #e0e0e0; border-radius: 8px; cursor: pointer; background-color: #f9f9f9; transition: all 0.2s ease; margin-left: ${level * 20}px; user-select: none;"
             onmouseover="this.style.backgroundColor='#e8f5e8'; this.style.borderColor='#4CAF50';"
             onmouseout="this.style.backgroundColor='#f9f9f9'; this.style.borderColor='#e0e0e0';">
          <div style="font-weight: bold; color: #333; font-size: 14px; margin-bottom: 4px;">
            ${$('<div/>').text(group.name).html()}
          </div>
          <div style="font-size: 12px; color: #666; display: flex; gap: 12px;">
            <span>📄 条目: ${group.promptIds.length}</span>
            <span>📁 子分组: ${group.subGroups.length}</span>
          </div>
        </div>
      `;
        }
        // 递归处理子分组
        if (group.subGroups.length > 0) {
            html += generateGroupsListHtml(group.subGroups, level + 1);
        }
    });
    return html;
}
// 将条目加入指定分组
async function addPromptsToGroup(selectedPrompts, targetGroup, existingGroups) {
    // 检查条目是否已经在目标分组中
    const alreadyInGroup = selectedPrompts.filter(promptId => targetGroup.promptIds.includes(promptId));
    if (alreadyInGroup.length > 0) {
        toastr.warning(`有 ${alreadyInGroup.length} 个条目已在该分组中，将跳过`);
    }
    // 将条目添加到目标分组
    const newPrompts = selectedPrompts.filter(promptId => !targetGroup.promptIds.includes(promptId));
    targetGroup.promptIds.push(...newPrompts);
    // 更新UI
    newPrompts.forEach(promptId => {
        const item = $(`.prompt-item[data-prompt-id="${promptId}"]`);
        item.css('background-color', '#e8f5e8');
        // 更新或添加分组标签
        const existingTag = item.find('.group-tag');
        const groupPath = getGroupPath(targetGroup, existingGroups);
        if (existingTag.length) {
            existingTag.text(groupPath);
        }
        else {
            item
                .find('.prompt-text')
                .append(`<div style="color: #666; font-size: 12px; margin-top: 4px; word-wrap: break-word; overflow-wrap: break-word;">📁 ${groupPath}</div>`);
            item.append(`<span class="group-tag" style="background-color: #4CAF50; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; margin-left: 8px; flex-shrink: 0; align-self: flex-start; margin-top: 2px;">已分组</span>`);
        }
    });
    // 保存分组配置
    const currentPresetName = TavernHelper.getLoadedPresetName();
    savePresetGrouping(currentPresetName, existingGroups);
    // 立即应用分组到DOM
    applyGroupingToDOM(existingGroups);
    // 延迟恢复以确保DOM更新完成
    setTimeout(() => {
        restoreGroupingImmediate();
    }, 100);
    toastr.success(`已将 ${newPrompts.length} 个条目加入分组 "${getGroupPath(targetGroup, existingGroups)}"，已立即应用`);
}
// 将条目从分组中移除
async function removePromptsFromGroups(selectedPrompts, existingGroups) {
    selectedPrompts.forEach(promptId => {
        const group = findPromptInGroups(existingGroups, promptId);
        if (group) {
            // 从分组中移除条目
            const index = group.promptIds.indexOf(promptId);
            if (index > -1) {
                group.promptIds.splice(index, 1);
            }
            // 更新UI
            const item = $(`.prompt-item[data-prompt-id="${promptId}"]`);
            item.css('background-color', '#fff');
            item.find('.group-tag').remove();
            item.find('.prompt-text div:last-child').remove(); // 移除分组路径显示
        }
    });
    // 保存分组配置
    const currentPresetName = TavernHelper.getLoadedPresetName();
    savePresetGrouping(currentPresetName, existingGroups);
    // 立即应用分组到DOM
    applyGroupingToDOM(existingGroups);
    // 延迟恢复以确保DOM更新完成
    setTimeout(() => {
        restoreGroupingImmediate();
    }, 100);
    toastr.success(`已将 ${selectedPrompts.length} 个条目移出分组，已立即应用`);
}
// 显示解散分组弹窗
async function showDissolveGroupPopup(existingGroups) {
    const popupId = 'dissolve-group-popup';
    $(`#${popupId}`).remove();
    const groupsHtml = existingGroups
        .map(group => `
    <div class="group-selection-item" style="display: flex; align-items: center; padding: 10px; border: 1px solid #e0e0e0; margin: 5px 0; border-radius: 6px; cursor: pointer; background-color: #fff;">
      <input type="checkbox" class="group-checkbox" data-group-name="${$('<div/>').text(group.name).html()}" style="margin-right: 12px; transform: scale(1.3);">
      <div style="flex: 1;">
        <div style="font-weight: bold; color: #333; font-size: 14px;">${$('<div/>').text(group.name).html()}</div>
        <div style="font-size: 12px; color: #666; margin-top: 2px;">包含 ${group.promptIds.length} 个条目</div>
      </div>
    </div>
  `)
        .join('');
    const popupHtml = `
    <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10002; display: flex; align-items: center; justify-content: center;">
      <div class="group-selection-popup-content" style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 500px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 70vh;">
        <h4 style="margin-top:0; color:#6a4226; text-align: center; border-bottom: 2px solid #f0d8b6; padding-bottom: 10px;">选择要解散的分组</h4>
        
        <div style="margin: 15px 0; display: flex; gap: 8px; flex-wrap: wrap;">
          <button id="select-all-groups-btn" style="padding: 6px 12px; background-color:#2196F3; border:none; border-radius:6px; color:#fff; cursor:pointer; font-size:13px;">全选</button>
          <button id="select-none-groups-btn" style="padding: 6px 12px; background-color:#9E9E9E; border:none; border-radius:6px; color:#fff; cursor:pointer; font-size:13px;">全不选</button>
        </div>

        <div style="flex: 1; min-height: 0; overflow-y: auto; border: 1px solid #f0e2d0; border-radius: 8px; padding: 12px; margin-bottom: 15px;">
          <div style="font-size: 13px; color: #666; margin-bottom: 12px;">选择要解散的分组，解散后分组内的条目将变为独立条目</div>
          <div id="groups-container">
            ${groupsHtml}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
          <div style="font-size: 12px; color: #666;">⚠️ 解散操作不可撤销</div>
          <div style="display: flex; gap: 8px;">
            <button id="group-selection-cancel" style="padding: 10px 16px; background-color:#9E9E9E; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#fff; font-size: 14px;">取消</button>
            <button id="group-selection-confirm" style="padding: 10px 16px; background-color:#ff9800; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#fff; font-size: 14px;">解散选中</button>
          </div>
        </div>
      </div>
    </div>
  `;
    $('body').append(popupHtml);
    // 绑定事件
    $('.group-selection-item').on('click', function (e) {
        if (e.target.type === 'checkbox')
            return;
        const checkbox = $(this).find('.group-checkbox');
        checkbox.prop('checked', !checkbox.prop('checked'));
    });
    $('#select-all-groups-btn').on('click', () => {
        $('.group-checkbox').prop('checked', true);
    });
    $('#select-none-groups-btn').on('click', () => {
        $('.group-checkbox').prop('checked', false);
    });
    $('#group-selection-cancel').on('click', () => {
        $(`#${popupId}`).remove();
    });
    $('#group-selection-confirm').on('click', () => {
        const selectedGroupNames = [];
        $('.group-checkbox:checked').each(function () {
            selectedGroupNames.push($(this).data('group-name'));
        });
        if (selectedGroupNames.length === 0) {
            toastr.error('请选择要解散的分组');
            return;
        }
        // 解散选中的分组
        selectedGroupNames.forEach(groupName => {
            const groupIndex = existingGroups.findIndex(g => g.name === groupName);
            if (groupIndex > -1) {
                const group = existingGroups[groupIndex];
                // 更新UI - 移除分组标签和背景色
                group.promptIds.forEach(promptId => {
                    const item = $(`.prompt-item[data-prompt-id="${promptId}"]`);
                    item.css('background-color', '#fff');
                    item.find('.group-tag').remove();
                    // 清除分组路径显示
                    const promptText = item.find('.prompt-text');
                    if (promptText.length > 0) {
                        const lastDiv = promptText.find('div:last-child');
                        if (lastDiv.text().includes('📁')) {
                            lastDiv.remove();
                        }
                    }
                });
                // 递归处理子分组
                const processSubGroups = (subGroups) => {
                    subGroups.forEach(subGroup => {
                        subGroup.promptIds.forEach(promptId => {
                            const item = $(`.prompt-item[data-prompt-id="${promptId}"]`);
                            item.css('background-color', '#fff');
                            item.find('.group-tag').remove();
                            const promptText = item.find('.prompt-text');
                            if (promptText.length > 0) {
                                const lastDiv = promptText.find('div:last-child');
                                if (lastDiv.text().includes('📁')) {
                                    lastDiv.remove();
                                }
                            }
                        });
                        if (subGroup.subGroups.length > 0) {
                            processSubGroups(subGroup.subGroups);
                        }
                    });
                };
                if (group.subGroups.length > 0) {
                    processSubGroups(group.subGroups);
                }
                existingGroups.splice(groupIndex, 1);
            }
        });
        // 保存更新后的分组配置
        const currentPresetName = TavernHelper.getLoadedPresetName();
        const validGroups = existingGroups.filter(g => hasValidContent(g));
        savePresetGrouping(currentPresetName, validGroups);
        // 立即应用分组到DOM
        applyGroupingToDOM(validGroups);
        // 延迟恢复以确保DOM更新完成
        setTimeout(() => {
            restoreGroupingImmediate();
        }, 100);
        $(`#${popupId}`).remove();
        toastr.success(`已解散 ${selectedGroupNames.length} 个分组`);
    });
}


/***/ }),

/***/ 482:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Db: () => (/* binding */ CONFIG_LOREBOOK_NAME),
/* harmony export */   EF: () => (/* binding */ TOGGLE_BUTTON_NAME),
/* harmony export */   Ij: () => (/* binding */ generateUniqueId),
/* harmony export */   KL: () => (/* binding */ V2_MIGRATION_KEY),
/* harmony export */   Mk: () => (/* binding */ lastProcessedCharAvatar),
/* harmony export */   Xl: () => (/* binding */ UI_ID),
/* harmony export */   df: () => (/* binding */ TIPS),
/* harmony export */   iu: () => (/* binding */ setLastProcessedCharAvatar),
/* harmony export */   lk: () => (/* binding */ generateUUID),
/* harmony export */   xd: () => (/* binding */ initializePresetManager)
/* harmony export */ });
/* unused harmony export ensureConfigLorebookExists */
// 定义用于存储配置的世界书的固定名称
const CONFIG_LOREBOOK_NAME = 'PresetConfigManager_Data';
const V2_MIGRATION_KEY = 'MiaoMiaoPresetManager_AllConfigs_V2'; // 用于检测旧版合并数据的Key
const TOGGLE_BUTTON_NAME = '喵喵预设配置管理';
const UI_ID = 'preset-manager-ui';
let lastProcessedCharAvatar = null; // 用于跟踪上一个处理过的角色，防止重复触发
// 小贴士列表
const TIPS = [
    '如果你玩BL的话，来试试小n同人女预设吧！其他MoM系预设也可以试试哦！',
    '当你的总token达到6w左右时，你就该总结隐藏了哦',
    '你知道吗，聊天界面开关正则有一定可能丢失你的聊天记录',
    '不要使用第三方/"半公益站"的api或云酒馆！首先你的数据会非常不安全，其次没有后台我们无法解答你的问题，最后贩子不仅收你钱还掺水！',
];
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
// 生成标准的UUID v4格式，用作预设条目 identifier
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
function setLastProcessedCharAvatar(avatar) {
    lastProcessedCharAvatar = avatar;
}
// 确保配置世界书存在
async function ensureConfigLorebookExists() {
    try {
        await TavernHelper.getWorldbook(CONFIG_LOREBOOK_NAME);
    }
    catch (error) {
        console.log(`'${CONFIG_LOREBOOK_NAME}' not found. Creating it now.`);
        await TavernHelper.createOrReplaceWorldbook(CONFIG_LOREBOOK_NAME, []);
    }
}
// 初始化函数（将在加载时执行函数中调用）
async function initializePresetManager() {
    await ensureConfigLorebookExists();
    $(document).on('click', function (e) {
        if (!$(e.target).is('button[name="more-actions"]') && $(e.target).closest('.pm-submenu').length === 0) {
            $('.pm-submenu').hide();
        }
    });
    // 自动为所有预设创建识别条目（仅在新版用户首次使用时执行）
    try {
        const configs = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 825)).then(m => m.getStoredConfigs());
        const hasOldConfigs = Object.values(configs).some((config) => !config.identifierId && config.presetName);
        if (hasOldConfigs) {
            console.log('检测到旧版配置，开始自动创建识别条目...');
            const { autoCreateIdentifiersForAllPresets } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 825));
            await autoCreateIdentifiersForAllPresets();
        }
    }
    catch (error) {
        console.error('自动创建识别条目时出错:', error);
    }
}
// 移除自动初始化，改为在加载时执行函数中调用


/***/ }),

/***/ 718:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindConfigListEvents: () => (/* binding */ bindConfigListEvents)
/* harmony export */ });
// 配置列表的按钮事件绑定
function bindConfigListEvents() {
    const listElement = $('#preset-manager-list');
    console.log('绑定配置列表事件，找到按钮数量:', listElement.find('button').length);
    listElement.off('click', 'button').on('click', 'button', async function (e) {
        const button = $(this);
        const action = button.attr('name');
        console.log('按钮点击事件触发，action:', action, 'configId:', button.data('id'));
        if (action === 'more-actions') {
            e.stopPropagation();
            const submenu = button.siblings('.pm-submenu');
            $('.pm-submenu').not(submenu).hide(); // Hide other open menus
            submenu.toggle();
            return;
        }
        if (action === 'close-submenu') {
            button.closest('.pm-submenu').hide();
            return;
        }
        const configId = button.data('id');
        // 动态导入避免循环引用
        switch (action) {
            case 'rename-config': {
                const { renameConfig } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 825));
                await renameConfig(configId);
                break;
            }
            case 'update-config': {
                const { updateConfig } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 825));
                await updateConfig(configId);
                break;
            }
            case 'load-config': {
                const { loadConfig } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 825));
                await loadConfig(configId);
                break;
            }
            case 'export-config': {
                const { exportConfig } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 842));
                await exportConfig(configId);
                break;
            }
            case 'delete-config': {
                const { deleteConfig } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 825));
                await deleteConfig(configId);
                break;
            }
            case 'bind-regex': {
                const { showRegexBindingPopup } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 304));
                await showRegexBindingPopup(configId);
                break;
            }
            case 'view-config': {
                const { showViewConfigPopup } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 337));
                await showViewConfigPopup(configId);
                break;
            }
        }
        button.closest('.pm-submenu').hide();
    });
}


/***/ }),

/***/ 825:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   autoCreateIdentifiersForAllPresets: () => (/* binding */ autoCreateIdentifiersForAllPresets),
/* harmony export */   createIdentifierForCurrentPreset: () => (/* binding */ createIdentifierForCurrentPreset),
/* harmony export */   deleteConfig: () => (/* binding */ deleteConfig),
/* harmony export */   loadConfig: () => (/* binding */ loadConfig),
/* harmony export */   renameConfig: () => (/* binding */ renameConfig),
/* harmony export */   saveCurrentConfig: () => (/* binding */ saveCurrentConfig),
/* harmony export */   updateConfig: () => (/* binding */ updateConfig)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(482);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(406);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(165);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(337);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(903);





// 特殊识别条目的名称和内容
const IDENTIFIER_PROMPT_NAME = '*喵喵脚本识别*';
const IDENTIFIER_PROMPT_CONTENT = '';
// 触发一次预设保存，避免条目更改丢失
function triggerPresetSave() {
    try {
        const $btn = $('#update_oai_preset');
        if ($btn.length) {
            $btn.trigger('click');
            console.log('已触发预设保存');
        }
        else {
            console.warn('未找到预设保存按钮 #update_oai_preset');
        }
    }
    catch (err) {
        console.error('触发预设保存时出错:', err);
    }
}
// 创建或获取识别条目
async function createOrGetIdentifierPrompt() {
    try {
        // 获取当前预设的所有条目
        const preset = TavernHelper.getPreset('in_use');
        const prompts = [...preset.prompts, ...preset.prompts_unused];
        // 查找是否已存在识别条目
        const existingPrompt = prompts.find(p => p.name === IDENTIFIER_PROMPT_NAME);
        if (existingPrompt) {
            console.log('找到现有识别条目:', existingPrompt.id);
            return existingPrompt.id;
        }
        // 创建新的识别条目
        console.log('创建新的识别条目...');
        await TavernHelper.updatePresetWith('in_use', preset => {
            const newPrompt = {
                id: (0,___WEBPACK_IMPORTED_MODULE_0__/* .generateUniqueId */ .Ij)(),
                name: IDENTIFIER_PROMPT_NAME,
                enabled: false, // 不启用
                position: {
                    type: 'relative',
                },
                role: 'system',
                content: IDENTIFIER_PROMPT_CONTENT,
            };
            // 添加到预设的prompts数组末尾
            preset.prompts.push(newPrompt);
            return preset;
        }, { render: 'immediate' });
        // 触发保存
        triggerPresetSave();
        // 重新获取条目列表以获取新创建的ID
        const updatedPreset = TavernHelper.getPreset('in_use');
        const updatedPrompts = [...updatedPreset.prompts, ...updatedPreset.prompts_unused];
        const newPrompt = updatedPrompts.find(p => p.name === IDENTIFIER_PROMPT_NAME);
        if (newPrompt) {
            console.log('识别条目创建成功，ID:', newPrompt.id);
            return newPrompt.id;
        }
        else {
            console.error('无法找到新创建的识别条目');
            return null;
        }
    }
    catch (error) {
        console.error('创建识别条目失败:', error);
        return null;
    }
}
// 确保当前预设中有指定的识别条目
async function ensureIdentifierInCurrentPreset(identifierId) {
    try {
        const preset = TavernHelper.getPreset('in_use');
        const prompts = [...preset.prompts, ...preset.prompts_unused];
        // 检查是否已存在该识别条目
        const existingPrompt = prompts.find(p => p.id === identifierId);
        if (existingPrompt) {
            console.log('当前预设中已存在识别条目:', identifierId);
            return;
        }
        // 如果不存在，创建该识别条目
        console.log('在当前预设中创建识别条目:', identifierId);
        await TavernHelper.updatePresetWith('in_use', preset => {
            const newPrompt = {
                id: identifierId,
                name: IDENTIFIER_PROMPT_NAME,
                enabled: false, // 不启用
                position: {
                    type: 'relative',
                },
                role: 'system',
                content: IDENTIFIER_PROMPT_CONTENT,
            };
            // 添加到预设的prompts数组末尾
            preset.prompts.push(newPrompt);
            return preset;
        }, { render: 'immediate' });
        // 触发保存
        triggerPresetSave();
        console.log('识别条目已添加到当前预设');
    }
    catch (error) {
        console.error('确保识别条目存在失败:', error);
    }
}
// 为指定预设创建识别条目
async function createIdentifierForPreset(presetName) {
    try {
        // 切换到目标预设
        if (!TavernHelper.loadPreset(presetName)) {
            console.warn(`无法加载预设: ${presetName}`);
            return null;
        }
        // 等待预设切换完成
        await new Promise(resolve => setTimeout(resolve, 500));
        // 检查预设是否已有识别条目
        const preset = TavernHelper.getPreset('in_use');
        const prompts = [...preset.prompts, ...preset.prompts_unused];
        const existingIdentifier = prompts.find(p => p.name === IDENTIFIER_PROMPT_NAME);
        if (existingIdentifier) {
            console.log(`预设 "${presetName}" 已存在识别条目:`, existingIdentifier.id);
            return existingIdentifier.id;
        }
        // 创建新的识别条目
        const identifierId = (0,___WEBPACK_IMPORTED_MODULE_0__/* .generateUniqueId */ .Ij)();
        console.log(`为预设 "${presetName}" 创建识别条目，ID:`, identifierId);
        await TavernHelper.updatePresetWith('in_use', preset => {
            const newPrompt = {
                id: identifierId,
                name: IDENTIFIER_PROMPT_NAME,
                enabled: false, // 不启用
                position: {
                    type: 'relative',
                },
                role: 'system',
                content: IDENTIFIER_PROMPT_CONTENT,
            };
            // 添加到预设的prompts数组末尾
            preset.prompts.push(newPrompt);
            return preset;
        }, { render: 'immediate' });
        // 触发保存
        triggerPresetSave();
        console.log(`预设 "${presetName}" 识别条目创建完成，ID:`, identifierId);
        return identifierId;
    }
    catch (error) {
        console.error(`为预设 "${presetName}" 创建识别条目失败:`, error);
        return null;
    }
}
// 为当前预设创建识别条目并更新所有相关配置
async function createIdentifierForCurrentPreset() {
    try {
        // 检查当前预设是否已有识别条目
        const preset = TavernHelper.getPreset('in_use');
        const prompts = [...preset.prompts, ...preset.prompts_unused];
        const existingIdentifier = prompts.find(p => p.name === IDENTIFIER_PROMPT_NAME);
        if (existingIdentifier) {
            toastr.warning('当前预设已存在识别条目，无需重复创建');
            return;
        }
        // 创建新的识别条目
        const identifierId = (0,___WEBPACK_IMPORTED_MODULE_0__/* .generateUniqueId */ .Ij)();
        console.log('为当前预设创建识别条目，ID:', identifierId);
        await TavernHelper.updatePresetWith('in_use', preset => {
            const newPrompt = {
                id: identifierId,
                name: IDENTIFIER_PROMPT_NAME,
                enabled: false, // 不启用
                position: {
                    type: 'relative',
                },
                role: 'system',
                content: IDENTIFIER_PROMPT_CONTENT,
            };
            // 添加到预设的prompts数组末尾
            preset.prompts.push(newPrompt);
            return preset;
        }, { render: 'immediate' });
        // 触发保存
        triggerPresetSave();
        // 获取当前预设名称
        const currentPresetName = TavernHelper.getLoadedPresetName();
        console.log('当前预设名称:', currentPresetName);
        // 更新所有使用当前预设名称的旧配置，添加识别条目ID
        const configs = await (0,___WEBPACK_IMPORTED_MODULE_4__.getStoredConfigs)();
        let updatedCount = 0;
        for (const configId in configs) {
            const config = configs[configId];
            // 如果配置没有identifierId且presetName匹配当前预设
            if (!config.identifierId && config.presetName === currentPresetName) {
                config.identifierId = identifierId;
                updatedCount++;
                console.log(`更新配置 "${config.name}" 添加识别条目ID`);
            }
        }
        if (updatedCount > 0) {
            // 保存更新后的配置
            await (0,___WEBPACK_IMPORTED_MODULE_4__/* .setStoredConfigs */ .BR)(configs);
            // 清除缓存并重新渲染
            (0,___WEBPACK_IMPORTED_MODULE_4__/* .clearConfigCache */ .ih)();
            await (0,___WEBPACK_IMPORTED_MODULE_4__/* .renderConfigsList */ .sd)();
            toastr.success(`已为当前预设创建识别条目，并更新了 ${updatedCount} 个相关配置`);
        }
        else {
            toastr.success('已为当前预设创建识别条目');
        }
        console.log('识别条目创建完成，ID:', identifierId);
    }
    catch (error) {
        console.error('创建识别条目失败:', error);
        toastr.error('创建识别条目失败，请检查控制台日志');
    }
}
// 自动为所有预设创建识别条目并更新配置
async function autoCreateIdentifiersForAllPresets() {
    try {
        console.log('开始自动为所有预设创建识别条目...');
        // 获取所有预设名称
        const presetNames = TavernHelper.getPresetNames();
        console.log('找到预设列表:', presetNames);
        // 获取所有配置
        const configs = await (0,___WEBPACK_IMPORTED_MODULE_4__.getStoredConfigs)();
        console.log('找到配置数量:', Object.keys(configs).length);
        // 统计需要处理的预设
        const presetToProcess = new Set();
        for (const configId in configs) {
            const config = configs[configId];
            if (!config.identifierId && config.presetName) {
                presetToProcess.add(config.presetName);
            }
        }
        console.log('需要处理的预设:', Array.from(presetToProcess));
        if (presetToProcess.size === 0) {
            console.log('所有配置都已有关联的识别条目，无需处理');
            return;
        }
        // 记录当前预设，稍后恢复
        const originalPreset = TavernHelper.getLoadedPresetName();
        console.log('当前预设:', originalPreset);
        let totalUpdated = 0;
        const presetIdentifierMap = new Map();
        // 为每个需要处理的预设创建识别条目
        for (const presetName of presetToProcess) {
            if (presetNames.includes(presetName)) {
                console.log(`处理预设: ${presetName}`);
                const identifierId = await createIdentifierForPreset(presetName);
                if (identifierId) {
                    presetIdentifierMap.set(presetName, identifierId);
                    console.log(`预设 "${presetName}" 识别条目ID: ${identifierId}`);
                }
            }
            else {
                console.warn(`预设 "${presetName}" 不存在，跳过`);
            }
        }
        // 更新所有相关配置
        for (const configId in configs) {
            const config = configs[configId];
            if (!config.identifierId && config.presetName && presetIdentifierMap.has(config.presetName)) {
                config.identifierId = presetIdentifierMap.get(config.presetName);
                totalUpdated++;
                console.log(`更新配置 "${config.name}" 关联预设 "${config.presetName}"`);
            }
        }
        // 保存更新后的配置
        if (totalUpdated > 0) {
            await (0,___WEBPACK_IMPORTED_MODULE_4__/* .setStoredConfigs */ .BR)(configs);
            console.log(`已更新 ${totalUpdated} 个配置`);
        }
        // 恢复原始预设
        if (originalPreset && presetNames.includes(originalPreset)) {
            TavernHelper.loadPreset(originalPreset);
            console.log(`已恢复原始预设: ${originalPreset}`);
        }
        // 清除缓存并重新渲染
        (0,___WEBPACK_IMPORTED_MODULE_4__/* .clearConfigCache */ .ih)();
        await (0,___WEBPACK_IMPORTED_MODULE_4__/* .renderConfigsList */ .sd)();
        toastr.success(`自动创建完成！为 ${presetIdentifierMap.size} 个预设创建了识别条目，更新了 ${totalUpdated} 个配置`);
        console.log('自动创建识别条目完成');
    }
    catch (error) {
        console.error('自动创建识别条目失败:', error);
        toastr.error('自动创建识别条目失败，请检查控制台日志');
    }
}
async function renameConfig(configId) {
    const configs = await (0,___WEBPACK_IMPORTED_MODULE_4__.getStoredConfigs)();
    const configToRename = configs[configId];
    if (!configToRename) {
        toastr.error('找不到要重命名的配置。');
        return;
    }
    const oldName = configToRename.name;
    const newName = await triggerSlash(`/input default="${oldName}" "请输入新的配置名称"`);
    if (newName && newName.trim() !== '') {
        configs[configId].name = newName.trim();
        await (0,___WEBPACK_IMPORTED_MODULE_4__/* .setStoredConfigs */ .BR)(configs);
        (0,___WEBPACK_IMPORTED_MODULE_4__/* .clearConfigCache */ .ih)(); // 清除配置缓存
        toastr.success(`配置已从 "${oldName}" 重命名为 "${newName.trim()}"。`);
        await (0,___WEBPACK_IMPORTED_MODULE_4__/* .renderConfigsList */ .sd)();
        (0,___WEBPACK_IMPORTED_MODULE_2__/* .updateConfigListCache */ .oz)(); // 更新UI缓存
    }
    else {
        toastr.info('重命名操作已取消。');
    }
}
async function updateConfig(configId) {
    try {
        const configs = await (0,___WEBPACK_IMPORTED_MODULE_4__.getStoredConfigs)();
        const oldConfig = configs[configId];
        if (!oldConfig) {
            toastr.error(`配置不存在，无法更新。`);
            return;
        }
        const loadedPresetName = TavernHelper.getLoadedPresetName();
        const preset = TavernHelper.getPreset('in_use');
        const allPrompts = [...preset.prompts, ...preset.prompts_unused];
        const currentPromptStates = allPrompts.map((p) => ({
            id: p.id,
            enabled: p.enabled,
            name: p.name,
        }));
        const configToSave = {
            ...oldConfig,
            presetName: loadedPresetName,
            states: currentPromptStates,
        };
        const updateRegexChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "是否要同时更新此配置的正则开关状态？"`);
        if (updateRegexChoice === '1') {
            const allRegexes = await TavernHelper.getTavernRegexes({ scope: 'global' });
            const newRegexStates = allRegexes.map((regex) => ({
                id: regex.id,
                enabled: regex.enabled,
            }));
            configToSave.regexStates = newRegexStates;
            toastr.info('已同步更新正则状态。');
        }
        const oldStateIds = new Set(oldConfig.states.map(s => s.id));
        const newEntries = configToSave.states.filter(s => !oldStateIds.has(s.id));
        if (newEntries.length > 0) {
            const promptIdToNameMap = new Map(currentPromptStates.map((p) => [p.id, p.name]));
            const userChoices = await (0,___WEBPACK_IMPORTED_MODULE_3__/* .showNewEntriesPopup */ .eS)(newEntries, promptIdToNameMap);
            if (userChoices !== null) {
                const choicesMap = new Map(userChoices.map((choice) => [choice.id, choice.enabled]));
                configToSave.states.forEach(state => {
                    if (choicesMap.has(state.id))
                        state.enabled = choicesMap.get(state.id);
                });
            }
            else {
                toastr.info('已为新条目保留默认状态。');
            }
        }
        configs[configId] = configToSave;
        await (0,___WEBPACK_IMPORTED_MODULE_4__/* .setStoredConfigs */ .BR)(configs);
        (0,___WEBPACK_IMPORTED_MODULE_4__/* .clearConfigCache */ .ih)(); // 清除配置缓存
        toastr.success(`配置 "${configToSave.name}" 已更新。`);
        await (0,___WEBPACK_IMPORTED_MODULE_4__/* .renderConfigsList */ .sd)();
        (0,___WEBPACK_IMPORTED_MODULE_2__/* .updateConfigListCache */ .oz)(); // 更新UI缓存
    }
    catch (error) {
        console.error('更新预设配置失败:', error);
        toastr.error('更新预设配置失败，请检查控制台获取更多信息。');
    }
}
async function saveCurrentConfig() {
    // 先创建识别条目，然后通过识别条目ID获取正确的预设名称
    const identifierId = await createOrGetIdentifierPrompt();
    if (!identifierId) {
        toastr.error('无法创建识别条目，配置保存失败');
        return;
    }
    // 获取当前预设名称（用于显示和向后兼容）
    const currentPresetName = await (0,___WEBPACK_IMPORTED_MODULE_4__/* .getPresetNameByIdentifier */ .nx)(identifierId);
    if (!currentPresetName) {
        toastr.error('无法识别当前预设，配置保存失败');
        return;
    }
    const blacklist = ['恶灵低语', 'deepspay', 'spaymale', '深阉', '小骡之神', '小猫之神', 'kemini'];
    if (blacklist.some(keyword => currentPresetName.toLowerCase().includes(keyword))) {
        toastr.warning('*你使用了作者黑名单的预设哦（盯）*');
        return;
    }
    const nameInput = $('#preset-manager-name-input');
    const configName = nameInput.val()?.toString().trim();
    if (!configName) {
        toastr.error('请输入配置名称。');
        return;
    }
    try {
        console.log('当前预设名称:', currentPresetName);
        console.log('识别条目ID:', identifierId);
        const preset = TavernHelper.getPreset('in_use');
        const allPrompts = [...preset.prompts, ...preset.prompts_unused];
        const promptStates = allPrompts.map((p) => ({
            id: p.id,
            enabled: p.enabled,
            name: p.name,
        }));
        const configToSave = {
            id: (0,___WEBPACK_IMPORTED_MODULE_0__/* .generateUniqueId */ .Ij)(),
            name: configName,
            presetName: currentPresetName, // 使用实际的预设名称而不是"in_use"
            identifierId: identifierId, // 使用识别条目ID进行可靠的预设识别
            states: promptStates,
        };
        if ($('#preset-manager-bind-char').is(':checked')) {
            const charData = await TavernHelper.getCharData('current');
            if (charData && charData.avatar) {
                configToSave.boundCharAvatar = charData.avatar;
                configToSave.boundCharName = charData.name;
            }
            else {
                toastr.warning('无法获取当前角色信息，配置未绑定。');
            }
        }
        const configs = await (0,___WEBPACK_IMPORTED_MODULE_4__.getStoredConfigs)();
        configs[configToSave.id] = configToSave;
        await (0,___WEBPACK_IMPORTED_MODULE_4__/* .setStoredConfigs */ .BR)(configs);
        (0,___WEBPACK_IMPORTED_MODULE_4__/* .clearConfigCache */ .ih)(); // 清除配置缓存
        toastr.success(`配置 "${configName}" 已保存。`);
        nameInput.val('');
        $('#preset-manager-bind-char').prop('checked', false);
        await (0,___WEBPACK_IMPORTED_MODULE_4__/* .renderConfigsList */ .sd)();
        (0,___WEBPACK_IMPORTED_MODULE_2__/* .updateConfigListCache */ .oz)(); // 更新UI缓存
    }
    catch (error) {
        console.error('保存预设配置失败:', error);
        toastr.error('保存预设配置失败，请检查控制台获取更多信息。');
    }
}
async function loadConfig(configId, shouldToggleUI = true) {
    try {
        const configs = await (0,___WEBPACK_IMPORTED_MODULE_4__.getStoredConfigs)();
        const configToLoad = configs[configId];
        if (!configToLoad) {
            toastr.error(`配置不存在。`);
            return;
        }
        // 优先使用识别条目ID查找预设，如果没有则回退到预设名称
        let targetPresetName = null;
        if (configToLoad.identifierId) {
            // 使用识别条目ID查找预设
            targetPresetName = await (0,___WEBPACK_IMPORTED_MODULE_4__/* .getPresetNameByIdentifier */ .nx)(configToLoad.identifierId);
            if (targetPresetName) {
                // 如果找到的是"in_use"，需要转换为当前正在使用的实际预设名称
                if (targetPresetName === 'in_use') {
                    const currentPresetName = TavernHelper.getLoadedPresetName();
                    targetPresetName = currentPresetName !== 'in_use' ? currentPresetName : 'in_use';
                    console.log('通过识别条目ID找到in_use，转换为当前预设:', targetPresetName);
                }
                else {
                    console.log('通过识别条目ID找到预设:', targetPresetName);
                }
            }
            else {
                console.warn('无法通过识别条目ID找到预设，尝试使用预设名称');
            }
        }
        // 如果通过识别条目ID没找到，尝试使用预设名称（向后兼容）
        if (!targetPresetName && configToLoad.presetName) {
            if (TavernHelper.getPresetNames().includes(configToLoad.presetName)) {
                targetPresetName = configToLoad.presetName;
                console.log('通过预设名称找到预设:', targetPresetName);
            }
            else {
                console.warn(`预设 "${configToLoad.presetName}" 不存在，尝试扫描所有预设查找识别条目`);
                // 如果预设名称也不存在，尝试扫描所有预设查找识别条目
                if (configToLoad.identifierId) {
                    targetPresetName = await (0,___WEBPACK_IMPORTED_MODULE_4__/* .getPresetNameByIdentifier */ .nx)(configToLoad.identifierId);
                }
            }
        }
        if (targetPresetName) {
            // 加载预设
            if (TavernHelper.loadPreset(targetPresetName)) {
                toastr.info(`已切换到预设 "${targetPresetName}"。`);
                await new Promise(resolve => setTimeout(resolve, 500));
                // 确保目标预设中有识别条目
                if (configToLoad.identifierId) {
                    await ensureIdentifierInCurrentPreset(configToLoad.identifierId);
                }
            }
            else {
                toastr.error(`加载预设 "${targetPresetName}" 失败。`);
                return;
            }
        }
        else {
            toastr.warning(`无法找到对应的预设，将仅对当前预设应用条目状态。`);
        }
        const promptStates = configToLoad.states;
        if (!promptStates || !Array.isArray(promptStates)) {
            toastr.error(`配置 "${configToLoad.name}" 数据格式不正确或为空。`);
            return;
        }
        const statesMap = new Map(promptStates.map(s => [s.id, s.enabled]));
        await TavernHelper.updatePresetWith('in_use', preset => {
            [...preset.prompts, ...preset.prompts_unused].forEach((prompt) => {
                if (statesMap.has(prompt.id))
                    prompt.enabled = statesMap.get(prompt.id);
            });
            return preset;
        });
        if (configToLoad.regexStates && Array.isArray(configToLoad.regexStates)) {
            const statesToApply = new Map(configToLoad.regexStates.map(r => [r.id, r.enabled]));
            if (statesToApply.size > 0) {
                await TavernHelper.updateTavernRegexesWith(regexes => {
                    regexes.forEach((regex) => {
                        if (regex.scope === 'global' && statesToApply.has(regex.id)) {
                            regex.enabled = statesToApply.get(regex.id);
                        }
                    });
                    return regexes;
                }, { scope: 'global' });
                toastr.success(`已应用配置 "${configToLoad.name}" 绑定的全局正则。`);
            }
        }
        toastr.success(`已加载配置 "${configToLoad.name}"。`);
        // 加载配置后触发分组恢复
        setTimeout(() => {
            (0,___WEBPACK_IMPORTED_MODULE_1__/* .triggerGroupingRestore */ .aY)();
        }, 500);
        if (shouldToggleUI) {
            (0,___WEBPACK_IMPORTED_MODULE_2__/* .toggleUI */ .jS)();
        }
    }
    catch (error) {
        console.error('加载预设配置失败:', error);
        toastr.error('加载预设配置失败，请检查控制台获取更多信息。');
    }
}
async function deleteConfig(configId) {
    try {
        const configs = await (0,___WEBPACK_IMPORTED_MODULE_4__.getStoredConfigs)();
        const configToDelete = configs[configId];
        if (configToDelete) {
            delete configs[configId];
            await (0,___WEBPACK_IMPORTED_MODULE_4__/* .setStoredConfigs */ .BR)(configs);
            (0,___WEBPACK_IMPORTED_MODULE_4__/* .clearConfigCache */ .ih)(); // 清除配置缓存
            toastr.success(`已删除配置 "${configToDelete.name}"。`);
            await (0,___WEBPACK_IMPORTED_MODULE_4__/* .renderConfigsList */ .sd)();
            (0,___WEBPACK_IMPORTED_MODULE_2__/* .updateConfigListCache */ .oz)(); // 更新UI缓存
        }
        else {
            toastr.warning(`配置不存在。`);
        }
    }
    catch (error) {
        console.error('删除配置失败:', error);
        toastr.error('删除配置失败，请检查控制台获取更多信息。');
    }
}


/***/ }),

/***/ 842:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   exportConfig: () => (/* binding */ exportConfig),
/* harmony export */   k: () => (/* binding */ handleFileImport)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(482);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(406);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(304);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(903);




async function exportConfig(configId) {
    try {
        const configs = await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)();
        const configData = configs[configId];
        if (!configData) {
            toastr.error(`配置不存在，无法导出。`);
            return;
        }
        const configName = configData.name;
        let userRemark = '';
        const addRemarkChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "是否要为此导出添加备注信息？"`);
        if (addRemarkChoice === '1') {
            userRemark = await triggerSlash(`/input multiline=true placeholder="请输入备注，例如预设用途、来源等..." "添加备注"`);
        }
        const exportBundle = {
            type: 'MiaoMiaoPresetBundle',
            version: 1,
            remark: userRemark || '',
            presetConfig: configData,
            presetData: null,
            regexData: null,
            groupingConfig: null,
        };
        const configPresetName = configData.presetName;
        if (configPresetName && TavernHelper.getPresetNames().includes(configPresetName)) {
            const includePresetChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "此配置关联了预设 \\"${configPresetName}\\"。是否要将预设文件本身一起打包导出？"`);
            if (includePresetChoice === '1') {
                const presetData = TavernHelper.getPreset(configPresetName);
                if (presetData) {
                    presetData.name = configPresetName;
                    exportBundle.presetData = presetData;
                    toastr.info(`已将预设 "${configPresetName}" 打包。`);
                }
                else {
                    toastr.warning(`无法获取预设 "${configPresetName}" 的数据。`);
                }
            }
        }
        if (configData.regexStates && configData.regexStates.length > 0) {
            const userChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "此配置绑定了正则。是否选择要一起导出的正则？"`);
            if (userChoice === '1') {
                const boundRegexIds = new Set(configData.regexStates.map(r => r.id));
                const allGlobalRegexes = await TavernHelper.getTavernRegexes({ scope: 'global' });
                const boundRegexes = allGlobalRegexes.filter((r) => boundRegexIds.has(r.id));
                const { showRegexExportSelectionPopup } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 337));
                const selectedRegexes = await showRegexExportSelectionPopup(boundRegexes);
                if (selectedRegexes) {
                    exportBundle.regexData = selectedRegexes;
                    toastr.info(`已将 ${selectedRegexes.length} 条正则打包导出。`);
                }
                else {
                    toastr.info('已取消导出正则。');
                }
            }
        }
        // 检查是否包含分组配置
        const groupingPresetName = configData.presetName;
        if (groupingPresetName) {
            const groupingConfig = (0,___WEBPACK_IMPORTED_MODULE_1__/* .exportPresetGrouping */ .pM)(groupingPresetName);
            if (groupingConfig) {
                const includeGroupingChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "预设 \\"${groupingPresetName}\\" 包含条目分组设置。是否要一起导出？"`);
                if (includeGroupingChoice === '1') {
                    exportBundle.groupingConfig = groupingConfig;
                    toastr.info('已将分组设置打包导出。');
                }
            }
        }
        const defaultFileName = `${configName}_bundle`;
        let userFileName = await triggerSlash(`/input default="${defaultFileName}" "请输入导出的文件名（无需后缀）"`);
        if (!userFileName || userFileName.trim() === '') {
            userFileName = defaultFileName;
            toastr.info('文件名为空，已使用默认名称。');
        }
        userFileName = userFileName.trim().replace(/\.json$/, '');
        const jsonString = JSON.stringify(exportBundle, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${userFileName}.json`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        a.remove();
        toastr.success(`配置包 "${configName}" 已导出。`);
    }
    catch (error) {
        console.error('导出配置失败:', error);
        toastr.error('导出配置失败，请检查控制台获取更多信息。');
    }
}
async function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file)
        return;
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const content = e.target?.result;
            const parsedContent = JSON.parse(content);
            if (parsedContent.entries && typeof parsedContent.entries === 'object') {
                toastr.info('检测到世界书备份文件。');
                const configsToImport = [];
                for (const entry of Object.values(parsedContent.entries)) {
                    if (entry.content) {
                        try {
                            const config = JSON.parse(entry.content);
                            if (config.id && config.name && Array.isArray(config.states)) {
                                configsToImport.push(config);
                            }
                        }
                        catch (err) {
                            // 忽略解析失败的条目
                        }
                    }
                }
                if (configsToImport.length > 0) {
                    const { startBatchImportFlow } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 42));
                    await startBatchImportFlow(configsToImport);
                }
                else {
                    toastr.warning('世界书文件中未找到有效的喵喵配置数据。');
                }
                return;
            }
            if (parsedContent.remark) {
                const { showRemarkPopup } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 337));
                await showRemarkPopup(parsedContent.remark);
            }
            if (parsedContent.type === 'MiaoMiaoPresetMegaBundle') {
                const { handleMegaBundleImport } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 42));
                await handleMegaBundleImport(parsedContent);
                return;
            }
            let configToImport, presetToImport, regexToImport, groupingToImport;
            if (parsedContent.type === 'MiaoMiaoPresetBundle') {
                console.log('检测到整合包文件，版本:', parsedContent.version);
                toastr.info('检测到整合包文件。');
                configToImport = parsedContent.presetConfig;
                presetToImport = parsedContent.presetData;
                regexToImport = parsedContent.regexData;
                groupingToImport = parsedContent.groupingConfig;
                console.log('分组配置:', groupingToImport);
            }
            else {
                configToImport = parsedContent;
            }
            if (!configToImport || typeof configToImport.presetName !== 'string' || !Array.isArray(configToImport.states)) {
                toastr.error('导入失败：配置数据格式不正确。');
                return;
            }
            if (presetToImport) {
                const importPresetChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "此文件包含预设文件 \\"${presetToImport.name}\\"。是否导入/覆盖？"`);
                if (importPresetChoice === '1') {
                    await TavernHelper.createOrReplacePreset(presetToImport.name, presetToImport);
                    toastr.success(`预设文件 "${presetToImport.name}" 已导入。`);
                }
            }
            if (regexToImport && regexToImport.length > 0) {
                await (0,___WEBPACK_IMPORTED_MODULE_2__/* .importRegexLogic */ .P)(regexToImport);
            }
            // 处理分组配置导入
            if (groupingToImport && Array.isArray(groupingToImport) && groupingToImport.length > 0) {
                if (configToImport.presetName) {
                    try {
                        console.log('导入分组配置:', groupingToImport);
                        (0,___WEBPACK_IMPORTED_MODULE_1__/* .importPresetGrouping */ .q$)(configToImport.presetName, groupingToImport);
                        toastr.success('已成功导入并应用分组设置到预设。');
                    }
                    catch (error) {
                        console.error('导入分组配置失败:', error);
                        toastr.error('导入分组配置失败：' + error.message);
                    }
                }
                else {
                    console.warn('配置中没有预设名称，无法导入分组配置');
                }
            }
            const initialName = configToImport.name || file.name.replace(/_bundle\.json$/i, '').replace(/\.json$/i, '');
            let configName = await triggerSlash(`/input default="${initialName}" "请输入导入配置的名称"`);
            configName = configName.trim();
            if (!configName) {
                toastr.info('导入已取消。');
                return;
            }
            const configs = await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)();
            configToImport.name = configName;
            configToImport.id = (0,___WEBPACK_IMPORTED_MODULE_0__/* .generateUniqueId */ .Ij)(); // Always generate new ID for single import
            configs[configToImport.id] = configToImport;
            await (0,___WEBPACK_IMPORTED_MODULE_3__/* .setStoredConfigs */ .BR)(configs);
            toastr.success(`配置 "${configName}" 已成功导入。`);
            await (0,___WEBPACK_IMPORTED_MODULE_3__/* .renderConfigsList */ .sd)();
        }
        catch (error) {
            console.error('导入文件失败:', error);
            toastr.error('导入文件失败，请检查控制台获取更多信息。');
        }
        finally {
            $(event.target).val('');
        }
    };
    reader.readAsText(file);
}


/***/ }),

/***/ 903:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BR: () => (/* binding */ setStoredConfigs),
/* harmony export */   getStoredConfigs: () => (/* binding */ getStoredConfigs),
/* harmony export */   ih: () => (/* binding */ clearConfigCache),
/* harmony export */   nx: () => (/* binding */ getPresetNameByIdentifier),
/* harmony export */   sd: () => (/* binding */ renderConfigsList)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(482);

// 添加配置缓存
let configCache = null;
let lastCacheTime = 0;
const CONFIG_CACHE_DURATION = 10000; // 10秒缓存
async function getStoredConfigs() {
    // 检查缓存是否有效
    const now = Date.now();
    if (configCache && now - lastCacheTime < CONFIG_CACHE_DURATION) {
        return configCache;
    }
    let worldbookEntries;
    try {
        worldbookEntries = await TavernHelper.getWorldbook(___WEBPACK_IMPORTED_MODULE_0__/* .CONFIG_LOREBOOK_NAME */ .Db);
    }
    catch (error) {
        return {};
    }
    const v2Entry = worldbookEntries.find((entry) => entry.strategy?.keys?.includes(___WEBPACK_IMPORTED_MODULE_0__/* .V2_MIGRATION_KEY */ .KL));
    if (v2Entry) {
        console.log('喵喵预设配置管理: 检测到旧版合并数据，正在迁移...');
        try {
            const configsArray = JSON.parse(v2Entry.content);
            const migratedEntries = configsArray.map((config) => ({
                name: config.name || config.id,
                strategy: { type: 'constant', keys: [config.id] },
                content: JSON.stringify(config),
                enabled: false,
            }));
            const otherEntries = worldbookEntries.filter((entry) => !entry.strategy?.keys?.includes(___WEBPACK_IMPORTED_MODULE_0__/* .V2_MIGRATION_KEY */ .KL));
            await TavernHelper.createOrReplaceWorldbook(___WEBPACK_IMPORTED_MODULE_0__/* .CONFIG_LOREBOOK_NAME */ .Db, [...otherEntries, ...migratedEntries]);
            toastr.info('喵喵预设配置管理：已自动升级数据格式。');
            worldbookEntries = await TavernHelper.getWorldbook(___WEBPACK_IMPORTED_MODULE_0__/* .CONFIG_LOREBOOK_NAME */ .Db);
        }
        catch (e) {
            console.error('迁移配置失败:', e);
            toastr.error('自动迁移配置数据失败，请检查控制台。');
        }
    }
    const configs = {};
    for (const entry of worldbookEntries) {
        try {
            const configData = JSON.parse(entry.content);
            if (configData.id && configData.name && Array.isArray(configData.states)) {
                configs[configData.id] = configData;
            }
        }
        catch (e) {
            // 忽略解析失败的条目
        }
    }
    // 更新缓存
    configCache = configs;
    lastCacheTime = now;
    return configs;
}
// 清除配置缓存
function clearConfigCache() {
    configCache = null;
    lastCacheTime = 0;
}
// 通过识别条目ID获取预设名称
async function getPresetNameByIdentifier(identifierId) {
    try {
        console.log(`正在查找识别条目ID: ${identifierId}`);
        const presetNames = TavernHelper.getPresetNames();
        console.log(`可用预设列表:`, presetNames);
        for (const presetName of presetNames) {
            const preset = TavernHelper.getPreset(presetName);
            if (preset && preset.prompts) {
                // 检查 prompts 和 prompts_unused 两个数组
                const allPrompts = [...preset.prompts, ...(preset.prompts_unused || [])];
                const hasIdentifier = allPrompts.some((p) => p.id === identifierId);
                if (hasIdentifier) {
                    console.log(`在预设 "${presetName}" 中找到识别条目ID: ${identifierId}`);
                    return presetName;
                }
            }
        }
        console.warn(`未找到识别条目ID: ${identifierId}`);
        return null;
    }
    catch (error) {
        console.error('通过识别条目获取预设名称失败:', error);
        return null;
    }
}
async function setStoredConfigs(configsObject) {
    try {
        const nameCounts = {};
        const entries = Object.values(configsObject).map(config => {
            let entryName = config.name;
            nameCounts[entryName] = (nameCounts[entryName] || 0) + 1;
            if (nameCounts[entryName] > 1) {
                entryName = `${entryName} (${config.id.slice(-5)})`;
            }
            return {
                name: entryName,
                strategy: { type: 'constant', keys: [config.id] },
                content: JSON.stringify(config),
                enabled: false,
                comment: `MiaoMiao Preset Config: ${config.name} (ID: ${config.id})`,
            };
        });
        await TavernHelper.createOrReplaceWorldbook(___WEBPACK_IMPORTED_MODULE_0__/* .CONFIG_LOREBOOK_NAME */ .Db, entries);
    }
    catch (error) {
        console.error('写入配置到世界书失败:', error);
        toastr.error('配置保存/更新失败，请检查控制台日志。');
    }
}
async function renderConfigsList() {
    const configsObject = await getStoredConfigs();
    const configs = Object.values(configsObject);
    const listElement = $('#preset-manager-list');
    listElement.empty();
    if (configs.length === 0) {
        listElement.append('<li style="color:#888; padding:10px;">暂无已保存的配置。</li>');
        return;
    }
    // 使用异步分组，优先通过识别条目ID获取预设名称
    const groupedConfigs = {};
    for (const config of configs) {
        let groupName = '未分类';
        if (config.identifierId) {
            // 优先使用识别条目ID获取预设名称
            const presetName = await getPresetNameByIdentifier(config.identifierId);
            if (presetName) {
                // 如果找到的是"in_use"，需要转换为当前正在使用的实际预设名称
                if (presetName === 'in_use') {
                    const currentPresetName = TavernHelper.getLoadedPresetName();
                    groupName = currentPresetName !== 'in_use' ? currentPresetName : 'in_use';
                    console.log(`配置 "${config.name}" 找到in_use，转换为当前预设: ${groupName}`);
                }
                else {
                    groupName = presetName;
                    console.log(`配置 "${config.name}" 通过识别条目ID找到预设: ${presetName}`);
                }
            }
            else if (config.presetName && config.presetName !== 'in_use') {
                // 回退到预设名称，但排除"in_use"
                groupName = config.presetName;
                console.log(`配置 "${config.name}" 使用预设名称: ${config.presetName}`);
            }
            else {
                console.warn(`配置 "${config.name}" 无法找到有效预设名称，使用默认分组`);
            }
        }
        else if (config.presetName && config.presetName !== 'in_use') {
            // 向后兼容：使用预设名称，但排除"in_use"
            groupName = config.presetName;
            console.log(`配置 "${config.name}" 使用预设名称（向后兼容）: ${config.presetName}`);
        }
        else {
            console.warn(`配置 "${config.name}" 没有有效的预设信息，使用默认分组`);
        }
        if (!groupedConfigs[groupName])
            groupedConfigs[groupName] = [];
        groupedConfigs[groupName].push(config);
    }
    const sortedGroupNames = Object.keys(groupedConfigs).sort((a, b) => {
        if (a === '未分类')
            return 1;
        if (b === '未分类')
            return -1;
        return a.localeCompare(b);
    });
    for (const groupName of sortedGroupNames) {
        const configsInGroup = groupedConfigs[groupName];
        const safeGroupName = $('<div/>').text(groupName).html();
        const isUncategorized = groupName === '未分类';
        const groupElement = $(`
            <details class="pm-config-group" ${isUncategorized ? 'open' : ''}>
                <summary class="pm-config-group-summary">${safeGroupName} <span class="pm-config-count">(${configsInGroup.length})</span></summary>
                <ul class="pm-config-sublist"></ul>
            </details>
        `);
        const sublist = groupElement.find('.pm-config-sublist');
        for (const configData of configsInGroup) {
            const boundCharDisplay = configData.boundCharName
                ? `<span style="color:#4CAF50; margin-left: 8px; font-weight:bold;">(绑定: ${configData.boundCharName})</span>`
                : '';
            const listItem = $(`
                <li style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom: 1px solid #f0e2d0; font-size:14px;">
                    <div style="display:flex; flex-direction:column; align-items:flex-start; overflow:hidden; margin-right: 10px; flex: 1; min-width: 0;">
                        <span style="font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width: 100%;" title="${$('<div/>').text(configData.name).html()}">${$('<div/>').text(configData.name).html()}${boundCharDisplay}</span>
                    </div>
                    <div class="pm-actions-container">
                        <button data-id="${configData.id}" name="load-config" style="background-color:#f9d6a5; color:#3a2c2c;">加载</button>
                        <button data-id="${configData.id}" name="delete-config" style="background-color:#f5a8a0; color:#fff;">删除</button>
                        <div class="pm-more-btn-wrapper">
                            <button name="more-actions" style="background-color:#b0bec5; color:#fff;">更多</button>
                            <div class="pm-submenu">
                                <button data-id="${configData.id}" name="view-config">查看</button>
                                <button data-id="${configData.id}" name="update-config">更新</button>
                                <button data-id="${configData.id}" name="rename-config">重命名</button>
                                <button data-id="${configData.id}" name="bind-regex">正则</button>
                                <button data-id="${configData.id}" name="export-config">导出</button>
                                <div style="border-top: 1px solid #eee; margin: 5px 0;"></div>
                                <button name="close-submenu" style="color: #888; text-align: center;">关闭</button>
                            </div>
                        </div>
                    </div>
                </li>
            `);
            sublist.append(listItem);
        }
        listElement.append(groupElement);
    }
    // 绑定按钮事件
    // 使用动态导入避免循环引用，添加延迟确保DOM完全更新
    setTimeout(() => {
        Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 718))
            .then(({ bindConfigListEvents }) => {
            bindConfigListEvents();
        })
            .catch(error => {
            console.error('绑定按钮事件失败:', error);
        });
    }, 100);
}


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
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

// EXTERNAL MODULE: ./src/喵喵预设配置管理/初始化和配置.ts
var _ = __webpack_require__(482);
// EXTERNAL MODULE: ./src/喵喵预设配置管理/条目分组功能.ts
var src_ = __webpack_require__(406);
// EXTERNAL MODULE: ./src/喵喵预设配置管理/界面创建和管理.ts
var src_0 = __webpack_require__(165);
// EXTERNAL MODULE: ./src/喵喵预设配置管理/配置存储和读取.ts
var src_1 = __webpack_require__(903);
// EXTERNAL MODULE: ./src/喵喵预设配置管理/配置操作功能.ts
var src_2 = __webpack_require__(825);
;// ./src/喵喵预设配置管理/角色绑定功能.ts




async function onChatChanged() {
    try {
        await new Promise(resolve => setTimeout(resolve, 250));
        const charData = await TavernHelper.getCharData('current');
        if (!charData || !charData.avatar || charData.avatar === _/* lastProcessedCharAvatar */.Mk) {
            if (!charData || !charData.avatar)
                (0,_/* setLastProcessedCharAvatar */.iu)(null);
            return;
        }
        (0,_/* setLastProcessedCharAvatar */.iu)(charData.avatar);
        const configs = await (0,src_1.getStoredConfigs)();
        const boundConfigs = Object.values(configs).filter(config => config.boundCharAvatar === charData.avatar);
        if (boundConfigs.length === 0)
            return;
        let configIdToLoad = null;
        if (boundConfigs.length === 1) {
            const singleConfig = boundConfigs[0];
            const popupText = `角色 "${charData.name}" 拥有绑定的配置 "${singleConfig.name}"。是否要加载此配置？`;
            const userChoice = await triggerSlash(`/popup okButton="加载" cancelButton="取消" result=true "${popupText}"`);
            if (userChoice === '1')
                configIdToLoad = singleConfig.id;
        }
        else {
            const { showConfigSelectionPopup } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 337));
            configIdToLoad = await showConfigSelectionPopup(boundConfigs, charData.name);
        }
        if (configIdToLoad) {
            await (0,src_2.loadConfig)(configIdToLoad, false);
            // 角色切换后触发分组恢复
            setTimeout(() => {
                (0,src_/* triggerGroupingRestore */.aY)();
            }, 800);
        }
    }
    catch (error) {
        console.error('检查绑定配置时出错:', error);
        toastr.error('检查角色绑定配置时出错。');
    }
}

;// ./src/喵喵预设配置管理/加载和卸载时执行函数.ts




// 防止重复初始化的全局标记
const SCRIPT_ID = 'MIAO_MIAO_PRESET_MANAGER';
// 等待必要的全局变量加载完成
function checkReady() {
    const win = window;
    if (win.jQuery &&
        win.TavernHelper &&
        typeof TavernHelper.createOrReplaceWorldbook === 'function' &&
        win.tavern_events &&
        typeof getButtonEvent === 'function') {
        initScript();
    }
    else {
        setTimeout(checkReady, 100);
    }
}
function init() {
    // 检查是否已存在，如果存在则重新初始化（适配脚本重复加载）
    const win = window;
    if (win[SCRIPT_ID]) {
        console.log('⚠️ 喵喵预设配置管理已存在，重新初始化以适配重复加载');
        // 清理旧的事件绑定
        cleanupOldBindings();
    }
    // 设置全局标记
    win[SCRIPT_ID] = true;
    win.miaoMiaoPresetManager = true;
    console.log('🔥 jQuery ready 事件触发...');
    checkReady();
}
// 清理旧的事件绑定
function cleanupOldBindings() {
    try {
        // 解绑所有可能的事件
        $('#preset-manager-close').off('click');
        $('#preset-manager-help-btn').off('click');
        $('#preset-manager-save-btn').off('click');
        $('#preset-manager-import-btn').off('click');
        $('#preset-manager-batch-export-btn').off('click');
        $('#preset-manager-batch-delete-btn').off('click');
        $('#preset-manager-grouping-btn').off('click');
        $('#preset-manager-import-file').off('change');
        // 解绑分组相关事件
        $('.prompt-item').off('click');
        $('.prompt-checkbox').off('change');
        $('.dropdown-close-btn').off('click');
        $(document).off('click', '.dropdown-close-btn');
        console.log('✅ 旧的事件绑定已清理');
    }
    catch (error) {
        console.warn('清理旧事件绑定时出错:', error);
    }
}
async function initScript() {
    try {
        console.log('🚀 喵喵预设配置管理开始初始化...');
        // 初始化配置管理器
        await (0,_/* initializePresetManager */.xd)();
        console.log('✅ 配置管理器初始化完成');
        // 创建UI界面
        (0,src_0/* createUI */.RD)();
        console.log('✅ UI界面创建完成');
        // 注册按钮事件
        const buttonEventId = getButtonEvent(_/* TOGGLE_BUTTON_NAME */.EF);
        eventOn(buttonEventId, src_0/* toggleUI */.jS);
        console.log('✅ 按钮事件已注册:', buttonEventId);
        // 注册角色切换事件
        eventOn(tavern_events.CHAT_CHANGED, onChatChanged);
        // 延迟加载非关键功能，避免阻塞UI
        setTimeout(() => {
            initNonCriticalFeatures();
        }, 100);
        console.log('✅ 喵喵预设配置管理已加载成功!');
    }
    catch (error) {
        console.error('初始化喵喵预设配置管理失败:', error);
        toastr.error('喵喵预设配置管理加载失败，请检查控制台');
    }
}
// 初始化非关键功能，避免阻塞主UI
function initNonCriticalFeatures() {
    try {
        // 恢复分组配置
        eventOn(tavern_events.SETTINGS_LOADED, src_/* restoreGroupingFromConfig */.Ec);
        // 监听预设变化，如果存在该事件的话
        const tavernEventsExt = tavern_events;
        if (tavernEventsExt.PRESET_CHANGED) {
            eventOn(tavernEventsExt.PRESET_CHANGED, src_/* restoreGroupingFromConfig */.Ec);
        }
        // 监听预设界面变化，延迟恢复分组
        if (tavernEventsExt.PROMPT_MANAGER_UPDATED) {
            eventOn(tavernEventsExt.PROMPT_MANAGER_UPDATED, () => (0,src_/* restoreGroupingDelayed */.s8)(150, 'dom_change'));
        }
        // 监听设置更新事件，这通常在条目开关后触发
        eventOn(tavern_events.SETTINGS_UPDATED, () => {
            console.log('检测到设置更新，准备恢复分组');
            (0,src_/* restoreGroupingDelayed */.s8)(200, 'settings');
        });
        // 优化DOM观察器 - 使用防抖机制
        let restoreTimeout = null;
        const observer = new MutationObserver(mutations => {
            let shouldRestore = false;
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    const target = mutation.target;
                    // 检查是否是预设管理器的条目变化
                    if (target.classList?.contains('completion_prompt_manager') ||
                        target.querySelector?.('.completion_prompt_manager_prompt') ||
                        // 检查是否是预设条目本身的变化
                        target.classList?.contains('completion_prompt_manager_prompt') ||
                        // 检查是否是分组容器的变化
                        target.classList?.contains('prompt-group-container')) {
                        shouldRestore = true;
                    }
                }
                // 检查属性变化（如开关状态变化）
                if (mutation.type === 'attributes') {
                    const target = mutation.target;
                    if (target.classList?.contains('completion_prompt_manager_prompt') ||
                        target.closest?.('.completion_prompt_manager_prompt')) {
                        shouldRestore = true;
                    }
                }
            });
            if (shouldRestore) {
                // 防抖处理，避免频繁触发
                if (restoreTimeout) {
                    clearTimeout(restoreTimeout);
                }
                restoreTimeout = window.setTimeout(() => {
                    console.log('检测到预设条目变化，准备恢复分组');
                    (0,src_/* restoreGroupingDelayed */.s8)(150, 'toggle');
                }, 50);
            }
        });
        // 开始观察预设管理器区域的变化
        const presetManagerContainer = $('.completion_prompt_manager').get(0);
        if (presetManagerContainer) {
            observer.observe(presetManagerContainer, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'data-pm-identifier'],
            });
            console.log('✅ 预设管理器DOM观察器已启动');
        }
        // 延迟恢复分组，避免阻塞UI加载
        setTimeout(() => {
            console.log('🔄 脚本加载完成，开始强制恢复分组配置...');
            (0,src_/* forceRestoreGrouping */.nO)();
        }, 2000);
        console.log('✅ 非关键功能初始化完成');
    }
    catch (error) {
        console.error('初始化非关键功能失败:', error);
    }
}
// 在加载脚本时执行初始化
console.log('🔥 喵喵预设配置管理模块开始加载...');
$(() => init());
// 在卸载脚本时执行清理
$(window).on('pagehide', () => {
    // 清理全局标记
    const win = window;
    delete win[SCRIPT_ID];
    delete win.miaoMiaoPresetManager;
    // 快速清理UI元素，避免阻塞
    const uiElement = document.getElementById('preset-manager-ui');
    const fileElement = document.getElementById('preset-manager-import-file');
    if (uiElement) {
        uiElement.remove();
    }
    if (fileElement) {
        fileElement.remove();
    }
    // 异步清理分组效果，避免阻塞页面卸载
    setTimeout(async () => {
        try {
            const { clearAllGrouping } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 406));
            clearAllGrouping();
        }
        catch (error) {
            // 忽略清理错误
        }
    }, 0);
    console.log('✅ 喵喵预设配置管理已卸载');
});

// EXTERNAL MODULE: ./src/喵喵预设配置管理/导入导出功能.ts
var src_3 = __webpack_require__(842);
;// ./src/喵喵预设配置管理/index.ts













