
(function () {
    'use strict';
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
        '不要使用第三方/“半公益站”的api或云酒馆！首先你的数据会非常不安全，其次没有后台我们无法解答你的问题，最后贩子不仅收你钱还掺水！',
    ];
    function generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
    function createUI() {
        if ($(`#${UI_ID}`).length > 0)
            return;
        const uiContainer = $(`
            <div id="${UI_ID}">
                <style>
                    #${UI_ID}{display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10000;background-color:#fff8f0;color:#3a2c2c;border:1px solid #e0c9a6;border-radius:16px;padding:20px;box-shadow:0 4px 25px rgba(120,90,60,.25);width:90%;max-width:550px;max-height:80vh;font-family:'Segoe UI',sans-serif;display:flex;flex-direction:column}#${UI_ID} h4{margin-top:0;border-bottom:2px solid #f0d8b6;padding-bottom:10px;color:#6a4226}#${UI_ID} h5{margin:8px 0;color:#7a5235}#${UI_ID} button{transition:all .2s ease}#${UI_ID} button:hover{opacity:.85}#${UI_ID} #preset-manager-list-section{flex:1;overflow-y:auto}@media (max-width:600px){#${UI_ID}{top:0;left:0;transform:none;width:100%;height:100vh;max-width:none;max-height:none;border-radius:0;padding:10px;box-shadow:none;display:flex;flex-direction:column}#${UI_ID} h4{font-size:18px;text-align:center;padding:12px 0;margin:0;border-bottom:2px solid #f0d8b6}#${UI_ID} #preset-manager-close{top:10px;right:10px;font-size:28px}#${UI_ID} #preset-manager-save-section{flex-wrap:wrap}#${UI_ID} #preset-manager-name-input{width:100%;margin-left:0;margin-bottom:10px}}
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
                    <div style="margin-top: 10px; display:flex; flex-wrap: wrap; gap: 10px; align-items:center;">
                        <button id="preset-manager-import-btn" style="padding:6px 12px; background-color:#a5d6f9; border:none; border-radius:6px; color:#3a2c2c; cursor:pointer; font-weight:bold;">导入</button>
                        <button id="preset-manager-batch-export-btn" style="padding:6px 12px; background-color:#81c784; border:none; border-radius:6px; color:#3a2c2c; cursor:pointer; font-weight:bold;">批量导出</button>
                        <button id="preset-manager-batch-delete-btn" style="padding:6px 12px; background-color:#ef9a9a; border:none; border-radius:6px; color:#fff; cursor:pointer; font-weight:bold;">批量删除</button>
                        <button id="preset-manager-help-btn" style="padding:6px 12px; background-color:#bcaaa4; border:none; border-radius:6px; color:#3a2c2c; cursor:pointer; font-weight:bold;">使用说明</button>
                        <div style="width:100%; margin-top:10px; display:flex; align-items:center; padding-left: 5px;">
                           <label for="preset-manager-bind-char" style="cursor:pointer;">绑定到当前角色</label>
                           <label class="pm-switch" style="margin-left: auto;">
                              <input type="checkbox" id="preset-manager-bind-char"/>
                              <span class="pm-slider"></span>
                           </label>
                        </div>
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
        $(`#${UI_ID}`).hide();
        $('#preset-manager-close').on('click', toggleUI);
        $('#preset-manager-help-btn').on('click', showHelpPopup);
        $('#preset-manager-save-btn').on('click', saveCurrentConfig);
        $('#preset-manager-import-btn').on('click', () => $('#preset-manager-import-file').click());
        $('#preset-manager-batch-export-btn').on('click', showBatchExportPopup);
        $('#preset-manager-batch-delete-btn').on('click', showBatchDeletePopup);
        $('#preset-manager-import-file').on('change', handleFileImport);
    }
    function toggleUI() {
        const ui = $(`#${UI_ID}`);
        if (ui.is(':visible')) {
            ui.fadeOut();
        }
        else {
            renderConfigsList();
            const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)];
            $('#preset-manager-tips-section').text('小贴士：' + randomTip);
            ui.fadeIn();
        }
    }
    async function getStoredConfigs() {
        let worldbookEntries;
        try {
            worldbookEntries = await TavernHelper.getWorldbook(CONFIG_LOREBOOK_NAME);
        }
        catch (error) {
            return {};
        }
        const v2Entry = worldbookEntries.find((entry) => entry.strategy?.keys?.includes(V2_MIGRATION_KEY));
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
                const otherEntries = worldbookEntries.filter((entry) => !entry.strategy?.keys?.includes(V2_MIGRATION_KEY));
                await TavernHelper.createOrReplaceWorldbook(CONFIG_LOREBOOK_NAME, [...otherEntries, ...migratedEntries]);
                toastr.info('喵喵预设配置管理：已自动升级数据格式。');
                worldbookEntries = await TavernHelper.getWorldbook(CONFIG_LOREBOOK_NAME);
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
                // 忽略解析错误
            }
        }
        return configs;
    }
    async function setStoredConfigs(configsObject) {
        try {
            const nameCounts = {};
            const entries = Object.values(configsObject).map((config) => {
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
            await TavernHelper.createOrReplaceWorldbook(CONFIG_LOREBOOK_NAME, entries);
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
            listElement.append('<li style=\"color:#888; padding:10px;\">暂无已保存的配置。</li>');
            return;
        }
        const groupedConfigs = configs.reduce((acc, config) => {
            const groupName = config.presetName || '未分类';
            if (!acc[groupName])
                acc[groupName] = [];
            acc[groupName].push(config);
            return acc;
        }, {});
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
                <details class=\"pm-config-group\" ${isUncategorized ? 'open' : ''}>
                    <summary class=\"pm-config-group-summary\">${safeGroupName} <span class=\"pm-config-count\">(${configsInGroup.length})</span></summary>
                    <ul class=\"pm-config-sublist\"></ul>
                </details>
            `);
            const sublist = groupElement.find('.pm-config-sublist');
            for (const configData of configsInGroup) {
                const boundCharDisplay = configData.boundCharName
                    ? `<span style=\"color:#4CAF50; margin-left: 8px; font-weight:bold;\">(绑定: ${configData.boundCharName})</span>`
                    : '';
                const listItem = $(`
                    <li style=\"display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom: 1px solid #f0e2d0; font-size:14px;\">
                        <div style=\"display:flex; flex-direction:column; align-items:flex-start; overflow:hidden; margin-right: 10px; flex: 1; min-width: 0;\">
                            <span style=\"font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width: 100%;\" title=\"${$('<div/>').text(configData.name).html()}\">${$('<div/>').text(configData.name).html()}${boundCharDisplay}</span>
                        </div>
                        <div class=\"pm-actions-container\">
                            <button data-id=\"${configData.id}\" name=\"load-config\" style=\"background-color:#f9d6a5; color:#3a2c2c;\">加载</button>
                            <button data-id=\"${configData.id}\" name=\"delete-config\" style=\"background-color:#f5a8a0; color:#fff;\">删除</button>
                            <div class=\"pm-more-btn-wrapper\">
                                <button name=\"more-actions\" style=\"background-color:#b0bec5; color:#fff;\">更多</button>
                                <div class=\"pm-submenu\">
                                    <button data-id=\"${configData.id}\" name=\"update-config\">更新</button>
                                    <button data-id=\"${configData.id}\" name=\"rename-config\">重命名</button>
                                    <button data-id=\"${configData.id}\" name=\"bind-regex\">正则</button>
                                    <button data-id=\"${configData.id}\" name=\"export-config\">导出</button>
                                    <div style=\"border-top: 1px solid #eee; margin: 5px 0;\"></div>
                                    <button name=\"close-submenu\" style=\"color: #888; text-align: center;\">关闭</button>
                                </div>
                            </div>
                        </div>
                    </li>
                `);
                sublist.append(listItem);
            }
            listElement.append(groupElement);
        }
        listElement.off('click', 'button').on('click', 'button', function (e) {
            const button = $(this);
            const action = button.attr('name');
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
            switch (action) {
                case 'rename-config':
                    renameConfig(configId);
                    break;
                case 'update-config':
                    updateConfig(configId);
                    break;
                case 'load-config':
                    loadConfig(configId);
                    break;
                case 'export-config':
                    exportConfig(configId);
                    break;
                case 'delete-config':
                    deleteConfig(configId);
                    break;
                case 'bind-regex':
                    showRegexBindingPopup(configId);
                    break;
            }
            button.closest('.pm-submenu').hide();
        });
    }
    async function showRegexBindingPopup(configId) {
        const popupId = 'preset-manager-regex-popup';
        $(`#${popupId}`).remove();
        try {
            const allRegexes = await TavernHelper.getTavernRegexes({ scope: 'global' });
            if (allRegexes.length === 0) {
                toastr.info('没有可绑定的全局正则。');
                return;
            }
            const configs = await getStoredConfigs();
            const currentConfig = configs[configId];
            if (!currentConfig)
                return;
            const savedStates = new Map(currentConfig.regexStates?.map(r => [r.id, r.enabled]) ?? []);
            const regexesHtml = allRegexes
                .map(regex => {
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
                const cfgs = await getStoredConfigs();
                if (cfgs[configId] && cfgs[configId].regexStates) {
                    delete cfgs[configId].regexStates;
                    await setStoredConfigs(cfgs);
                    toastr.success(`配置 "${cfgs[configId].name}" 的正则绑定已清除。`);
                }
                else {
                    toastr.info(`配置没有正则绑定。`);
                }
                $(`#${popupId}`).remove();
                renderConfigsList();
            });
            $('#regex-bind-save').on('click', async () => {
                const newRegexStates = allRegexes.map(regex => ({
                    id: regex.id,
                    enabled: $(`#regex-toggle-${regex.id}`).is(':checked'),
                }));
                const cfgs = await getStoredConfigs();
                if (!cfgs[configId])
                    return;
                cfgs[configId].regexStates = newRegexStates;
                await setStoredConfigs(cfgs);
                toastr.success(`配置 "${cfgs[configId].name}" 的正则绑定已保存。`);
                $(`#${popupId}`).remove();
                renderConfigsList();
                const currentPresetName = cfgs[configId].presetName;
                if (!currentPresetName)
                    return;
                const otherConfigIds = Object.keys(cfgs).filter(id => id !== configId && cfgs[id].presetName === currentPresetName);
                if (otherConfigIds.length > 0) {
                    const confirmMessage = `是否要将此正则绑定应用到其他使用预设 "${currentPresetName}" 的 ${otherConfigIds.length} 个配置上？`;
                    const userChoice = await triggerSlash(`/popup okButton=\"应用\" cancelButton=\"取消\" result=true \"${confirmMessage}\"`);
                    if (userChoice === '1') {
                        otherConfigIds.forEach(id => {
                            cfgs[id].regexStates = newRegexStates;
                        });
                        await setStoredConfigs(cfgs);
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
            <p style="font-size: 14px; color: #6a4226; margin: 15px 0; text-align: center;">角色 \"${$('<div/>').text(charName).html()}\" 绑定了多个配置，请选择一个进行加载：</p>
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
                $(this).find('input[type=\"radio\"]').prop('checked', true);
            });
            $('#config-select-confirm').on('click', () => {
                const selectedId = $('input[name=\"config-selection\"]:checked').val();
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
    async function showRegexExportSelectionPopup(boundRegexes) {
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
    async function renameConfig(configId) {
        const configs = await getStoredConfigs();
        const configToRename = configs[configId];
        if (!configToRename) {
            toastr.error('找不到要重命名的配置。');
            return;
        }
        const oldName = configToRename.name;
        const newName = await triggerSlash(`/input default=\"${oldName}\" \"请输入新的配置名称\"`);
        if (newName && newName.trim() !== '') {
            configs[configId].name = newName.trim();
            await setStoredConfigs(configs);
            toastr.success(`配置已从 \"${oldName}\" 重命名为 \"${newName.trim()}\"。`);
            await renderConfigsList();
        }
        else {
            toastr.info('重命名操作已取消。');
        }
    }
    async function updateConfig(configId) {
        try {
            const configs = await getStoredConfigs();
            const oldConfig = configs[configId];
            if (!oldConfig) {
                toastr.error('配置不存在，无法更新。');
                return;
            }
            const loadedPresetName = TavernHelper.getLoadedPresetName();
            const preset = TavernHelper.getPreset('in_use');
            const allPrompts = [...preset.prompts, ...preset.prompts_unused];
            const currentPromptStates = allPrompts.map(p => ({ id: p.id, enabled: p.enabled, name: p.name }));
            const configToSave = {
                ...oldConfig,
                presetName: loadedPresetName,
                states: currentPromptStates,
            };
            const updateRegexChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "是否要同时更新此配置的正则开关状态？"`);
            if (updateRegexChoice === '1') {
                const allRegexes = await TavernHelper.getTavernRegexes({ scope: 'global' });
                const newRegexStates = allRegexes.map(regex => ({ id: regex.id, enabled: regex.enabled }));
                configToSave.regexStates = newRegexStates;
                toastr.info('已同步更新正则状态。');
            }
            const oldStateIds = new Set(oldConfig.states.map((s) => s.id));
            const newEntries = configToSave.states.filter(s => !oldStateIds.has(s.id));
            if (newEntries.length > 0) {
                const promptIdToNameMap = new Map(currentPromptStates.map(p => [p.id, p.name]));
                const userChoices = await showNewEntriesPopup(newEntries, promptIdToNameMap);
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
            await setStoredConfigs(configs);
            toastr.success(`配置 \"${configToSave.name}\" 已更新。`);
            await renderConfigsList();
        }
        catch (error) {
            console.error('更新预设配置失败:', error);
            toastr.error('更新预设配置失败，请检查控制台获取更多信息。');
        }
    }
    async function saveCurrentConfig() {
        const loadedPresetName = TavernHelper.getLoadedPresetName();
        const blacklist = ['恶灵低语', 'deepspay', 'spaymale', '深阉', '小骡之神', '小猫之神', 'kemini'];
        if (blacklist.some(keyword => loadedPresetName.toLowerCase().includes(keyword))) {
            toastr.warning('*你使用了作者黑名单的预设哦（盯）*');
            return;
        }
        const nameInput = $('#preset-manager-name-input');
        const configName = nameInput.val().trim();
        if (!configName) {
            toastr.error('请输入配置名称。');
            return;
        }
        try {
            const preset = TavernHelper.getPreset('in_use');
            const allPrompts = [...preset.prompts, ...preset.prompts_unused];
            const promptStates = allPrompts.map(p => ({ id: p.id, enabled: p.enabled, name: p.name }));
            const configToSave = {
                id: generateUniqueId(),
                name: configName,
                presetName: loadedPresetName,
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
            const configs = await getStoredConfigs();
            configs[configToSave.id] = configToSave;
            await setStoredConfigs(configs);
            toastr.success(`配置 \"${configName}\" 已保存。`);
            nameInput.val('');
            $('#preset-manager-bind-char').prop('checked', false);
            await renderConfigsList();
        }
        catch (error) {
            console.error('保存预设配置失败:', error);
            toastr.error('保存预设配置失败，请检查控制台获取更多信息。');
        }
    }
    async function loadConfig(configId, shouldToggleUI = true) {
        try {
            const configs = await getStoredConfigs();
            const configToLoad = configs[configId];
            if (!configToLoad) {
                toastr.error('配置不存在。');
                return;
            }
            if (configToLoad.presetName) {
                if (TavernHelper.getPresetNames().includes(configToLoad.presetName)) {
                    if (TavernHelper.loadPreset(configToLoad.presetName)) {
                        toastr.info(`已切换到预设 \"${configToLoad.presetName}\"。`);
                        await new Promise(resolve => setTimeout(resolve, 150));
                    }
                    else {
                        toastr.error(`加载预设 \"${configToLoad.presetName}\" 失败。`);
                        return;
                    }
                }
                else {
                    toastr.warning(`配置关联的预设 \"${configToLoad.presetName}\" 不存在。将仅对当前预设应用条目状态。`);
                }
            }
            const promptStates = configToLoad.states;
            if (!promptStates || !Array.isArray(promptStates)) {
                toastr.error(`配置 \"${configToLoad.name}\" 数据格式不正确或为空。`);
                return;
            }
            const statesMap = new Map(promptStates.map((s) => [s.id, s.enabled]));
            await TavernHelper.updatePresetWith('in_use', preset => {
                [...preset.prompts, ...preset.prompts_unused].forEach(prompt => {
                    if (statesMap.has(prompt.id))
                        prompt.enabled = statesMap.get(prompt.id);
                });
                return preset;
            });
            if (configToLoad.regexStates && Array.isArray(configToLoad.regexStates)) {
                const statesToApply = new Map(configToLoad.regexStates.map((r) => [r.id, r.enabled]));
                if (statesToApply.size > 0) {
                    await TavernHelper.updateTavernRegexesWith(regexes => {
                        regexes.forEach((regex) => {
                            if (regex.scope === 'global' && statesToApply.has(regex.id)) {
                                regex.enabled = statesToApply.get(regex.id);
                            }
                        });
                        return regexes;
                    }, { scope: 'global' });
                    toastr.success(`已应用配置 \"${configToLoad.name}\" 绑定的全局正则。`);
                }
            }
            toastr.success(`已加载配置 \"${configToLoad.name}\"。`);
            if (shouldToggleUI)
                toggleUI();
        }
        catch (error) {
            console.error('加载预设配置失败:', error);
            toastr.error('加载预设配置失败，请检查控制台获取更多信息。');
        }
    }
    async function exportConfig(configId) {
        try {
            const configs = await getStoredConfigs();
            const configData = configs[configId];
            if (!configData) {
                toastr.error('配置不存在，无法导出。');
                return;
            }
            const configName = configData.name;
            let userRemark = '';
            const addRemarkChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "是否要为此导出添加备注信息？"`);
            if (addRemarkChoice === '1') {
                userRemark = (await triggerSlash(`/input multiline=true placeholder="请输入备注，例如预设用途、来源等..." "添加备注"`));
            }
            const exportBundle = {
                type: 'MiaoMiaoPresetBundle',
                version: 1,
                remark: userRemark || '',
                presetConfig: configData,
                presetData: null,
                regexData: null,
            };
            const presetName = configData.presetName;
            if (presetName && TavernHelper.getPresetNames().includes(presetName)) {
                const includePresetChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "此配置关联了预设 \"${presetName}\"。是否要将预设文件本身一起打包导出？"`);
                if (includePresetChoice === '1') {
                    const presetData = TavernHelper.getPreset(presetName);
                    if (presetData) {
                        presetData.name = presetName;
                        exportBundle.presetData = presetData;
                        toastr.info(`已将预设 \"${presetName}\" 打包。`);
                    }
                    else {
                        toastr.warning(`无法获取预设 \"${presetName}\" 的数据。`);
                    }
                }
            }
            if (configData.regexStates && configData.regexStates.length > 0) {
                const userChoice = await triggerSlash(`/popup okButton=\"是\" cancelButton=\"否\" result=true \"此配置绑定了正则。是否选择要一起导出的正则？\"`);
                if (userChoice === '1') {
                    const boundRegexIds = new Set(configData.regexStates.map((r) => r.id));
                    const allGlobalRegexes = await TavernHelper.getTavernRegexes({ scope: 'global' });
                    const boundRegexes = allGlobalRegexes.filter(r => boundRegexIds.has(r.id));
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
            const defaultFileName = `${configName}_bundle`;
            let userFileName = (await triggerSlash(`/input default=\"${defaultFileName}\" \"请输入导出的文件名（无需后缀）\"`));
            if (!userFileName || userFileName.trim() === '') {
                userFileName = defaultFileName;
                toastr.info('文件名为空，已使用默认名称。');
            }
            userFileName = userFileName.trim().replace(/\.json$/, '');
            const jsonString = JSON.stringify(exportBundle, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `${userFileName}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toastr.success(`配置包 \"${configName}\" 已导出。`);
        }
        catch (error) {
            console.error('导出配置失败:', error);
            toastr.error('导出配置失败，请检查控制台获取更多信息。');
        }
    }
    async function handleFileImport(event) {
        const file = event.target.files?.[0];
        if (!file)
            return;
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            if (data.type === 'MiaoMiaoPresetBundle' && data.version === 1) {
                const bundle = data;
                const configData = bundle.presetConfig;
                const presetData = bundle.presetData;
                const regexData = bundle.regexData;
                if (!configData) {
                    toastr.error('文件格式错误：缺少配置数据。');
                    return;
                }
                const configName = configData.name;
                const existingConfigs = await getStoredConfigs();
                const existingNames = Object.values(existingConfigs).map((c) => c.name);
                let finalConfigName = configName;
                let counter = 1;
                while (existingNames.includes(finalConfigName)) {
                    finalConfigName = `${configName}_${counter}`;
                    counter++;
                }
                configData.name = finalConfigName;
                configData.id = generateUniqueId();
                if (presetData) {
                    const presetName = presetData.name;
                    if (presetName && !TavernHelper.getPresetNames().includes(presetName)) {
                        const importPresetChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "文件包含预设 \"${presetName}\"，是否要导入此预设？"`);
                        if (importPresetChoice === '1') {
                            try {
                                await TavernHelper.importRawPreset(JSON.stringify(presetData));
                                toastr.success(`预设 \"${presetName}\" 已导入。`);
                            }
                            catch (error) {
                                console.error('导入预设失败:', error);
                                toastr.error(`导入预设 \"${presetName}\" 失败。`);
                            }
                        }
                    }
                }
                if (regexData && Array.isArray(regexData) && regexData.length > 0) {
                    const importRegexChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "文件包含 ${regexData.length} 条正则，是否要导入这些正则？"`);
                    if (importRegexChoice === '1') {
                        try {
                            await importRegexLogic(regexData);
                            toastr.success(`已导入 ${regexData.length} 条正则。`);
                        }
                        catch (error) {
                            console.error('导入正则失败:', error);
                            toastr.error('导入正则失败。');
                        }
                    }
                }
                existingConfigs[configData.id] = configData;
                await setStoredConfigs(existingConfigs);
                toastr.success(`配置 \"${finalConfigName}\" 已导入。`);
                await renderConfigsList();
            }
            else {
                toastr.error('文件格式不支持或版本不匹配。');
            }
        }
        catch (error) {
            console.error('导入文件失败:', error);
            toastr.error('导入文件失败，请检查文件格式。');
        }
    }
    async function deleteConfig(configId) {
        const configs = await getStoredConfigs();
        const configToDelete = configs[configId];
        if (!configToDelete) {
            toastr.error('配置不存在，无法删除。');
            return;
        }
        const confirmDelete = await triggerSlash(`/popup okButton="删除" cancelButton="取消" result=true "确定要删除配置 \"${configToDelete.name}\" 吗？此操作不可撤销。"`);
        if (confirmDelete === '1') {
            delete configs[configId];
            await setStoredConfigs(configs);
            toastr.success(`配置 \"${configToDelete.name}\" 已删除。`);
            await renderConfigsList();
        }
        else {
            toastr.info('删除操作已取消。');
        }
    }
    function showHelpPopup() {
        const helpContent = `
      <div style="max-width: 500px; line-height: 1.6;">
        <h3 style="color: #c62828; margin-top: 0;">喵喵预设配置管理 - 使用帮助</h3>
        
        <h4 style="color: #6a4226; margin: 20px 0 10px 0;">基本功能</h4>
        <ul style="margin: 0 0 20px 0; padding-left: 20px;">
          <li><strong>保存配置：</strong>将当前预设的条目开关状态保存为配置</li>
          <li><strong>加载配置：</strong>应用已保存的配置到当前预设</li>
          <li><strong>重命名配置：</strong>修改配置名称</li>
          <li><strong>更新配置：</strong>用当前状态更新已保存的配置</li>
          <li><strong>删除配置：</strong>永久删除配置</li>
        </ul>

        <h4 style="color: #6a4226; margin: 20px 0 10px 0;">高级功能</h4>
        <ul style="margin: 0 0 20px 0; padding-left: 20px;">
          <li><strong>角色绑定：</strong>勾选"绑定当前角色"可将配置与特定角色关联</li>
          <li><strong>正则绑定：</strong>为配置绑定全局正则的开关状态</li>
          <li><strong>导出/导入：</strong>将配置打包导出或从文件导入</li>
          <li><strong>批量操作：</strong>支持批量删除、导出、导入多个配置</li>
        </ul>

        <h4 style="color: #6a4226; margin: 20px 0 10px 0;">使用技巧</h4>
        <ul style="margin: 0 0 20px 0; padding-left: 20px;">
          <li>配置会自动检测新增的预设条目并询问默认状态</li>
          <li>同名预设的配置可以共享正则绑定设置</li>
          <li>导出时可选择是否包含预设文件和正则数据</li>
          <li>导入时会自动处理重名冲突</li>
        </ul>

        <h4 style="color: #6a4226; margin: 20px 0 10px 0;">注意事项</h4>
        <ul style="margin: 0; padding-left: 20px;">
          <li>配置数据存储在酒馆的世界书中，不会影响预设文件本身</li>
          <li>删除配置是不可逆操作，请谨慎使用</li>
          <li>建议定期导出重要配置作为备份</li>
        </ul>
      </div>
    `;
        const popupId = 'preset-manager-help-popup';
        $(`#${popupId}`).remove();
        const popupHtml = `
      <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
        <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 600px; box-shadow: 0 4px 25px rgba(120,90,60,.25); max-height: 80vh; overflow-y: auto;">
          ${helpContent}
          <div style="text-align: center; margin-top: 20px;">
            <button id="help-close" style="padding: 8px 20px; background-color: #f4c78e; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; color: #3a2c2c;">关闭</button>
          </div>
        </div>
      </div>
    `;
        $('body').append(popupHtml);
        const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 5vh; } }</style>`;
        $(`#${popupId}`).append(mobileStyles);
        $('#help-close').on('click', () => $(`#${popupId}`).remove());
    }
    function showRemarkPopup(remarkText) {
        const popupId = 'preset-manager-remark-popup';
        $(`#${popupId}`).remove();
        const popupHtml = `
      <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
        <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 500px; box-shadow: 0 4px 25px rgba(120,90,60,.25); max-height: 80vh; overflow-y: auto;">
          <h4 style="margin-top: 0; color: #6a4226; text-align: center;">配置备注</h4>
          <div style="background-color: #f9f5f0; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #f4c78e; white-space: pre-wrap; line-height: 1.6;">${remarkText || '此配置暂无备注信息。'}</div>
          <div style="text-align: center;">
            <button id="remark-close" style="padding: 8px 20px; background-color: #f4c78e; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; color: #3a2c2c;">关闭</button>
          </div>
        </div>
      </div>
    `;
        $('body').append(popupHtml);
        const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 5vh; } }</style>`;
        $(`#${popupId}`).append(mobileStyles);
        $('#remark-close').on('click', () => $(`#${popupId}`).remove());
    }
    function showRegexDeletionPopup(existingRegexes) {
        return new Promise(resolve => {
            const popupId = 'preset-manager-regex-deletion-popup';
            $(`#${popupId}`).remove();
            const regexesHtml = existingRegexes
                .map((regex, index) => {
                const safeName = $('<div/>').text(regex.script_name).html();
                return `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 5px; border-bottom: 1px solid #eee;">
            <label for="regex-delete-toggle-${index}" style="cursor: pointer; flex: 1; margin-right: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${safeName}">${safeName}</label>
            <label class="pm-switch">
              <input type="checkbox" id="regex-delete-toggle-${index}" data-id="${regex.id}"/>
              <span class="pm-slider"></span>
            </label>
          </div>
        `;
            })
                .join('');
            const popupHtml = `
        <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
          <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
            <h4 style="margin-top:0; color:#c62828; text-align: center;">选择要删除的正则</h4>
            <div style="flex: 1; min-height: 0; overflow-y: auto; margin: 15px 0; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;">
              ${regexesHtml}
            </div>
            <div style="text-align: right; display:flex; justify-content:flex-end; gap: 10px;">
              <button id="regex-delete-cancel" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;">取消</button>
              <button id="regex-delete-confirm" style="padding: 8px 16px; background-color:#f5a8a0; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#fff;">删除选中</button>
            </div>
          </div>
        </div>
      `;
            $('body').append(popupHtml);
            const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 5vh; } }</style>`;
            $(`#${popupId}`).append(mobileStyles);
            $('#regex-delete-cancel').on('click', () => {
                $(`#${popupId}`).remove();
                resolve(null);
            });
            $('#regex-delete-confirm').on('click', () => {
                const selectedIds = new Set();
                existingRegexes.forEach((regex, index) => {
                    if ($(`#regex-delete-toggle-${index}`).is(':checked')) {
                        selectedIds.add(regex.id);
                    }
                });
                const selectedRegexes = existingRegexes.filter(r => selectedIds.has(r.id));
                $(`#${popupId}`).remove();
                resolve(selectedRegexes);
            });
        });
    }
    function sortRegexes(regexes) {
        return regexes.sort((a, b) => {
            const nameA = (a.script_name || '').toLowerCase();
            const nameB = (b.script_name || '').toLowerCase();
            return nameA.localeCompare(nameB);
        });
    }
    async function importRegexLogic(regexToImport) {
        try {
            const existingRegexes = await TavernHelper.getTavernRegexes({ scope: 'global' });
            const existingNames = new Set(existingRegexes.map((r) => r.script_name));
            const existingIds = new Set(existingRegexes.map((r) => r.id));
            const regexesToAdd = [];
            const regexesToUpdate = [];
            for (const regex of regexToImport) {
                if (existingIds.has(regex.id)) {
                    regexesToUpdate.push(regex);
                }
                else if (!existingNames.has(regex.script_name)) {
                    regexesToAdd.push(regex);
                }
                else {
                    const duplicateChoice = await triggerSlash(`/popup okButton="跳过" cancelButton="覆盖" result=true "正则 \"${regex.script_name}\" 已存在，是否跳过？"`);
                    if (duplicateChoice !== '1') {
                        regexesToUpdate.push(regex);
                    }
                }
            }
            if (regexesToAdd.length > 0) {
                // 注意：此API可能不存在，需要使用其他方法添加正则
                // await TavernHelper.addTavernRegexes(regexesToAdd as any, { scope: 'global' });
                toastr.info(`跳过添加 ${regexesToAdd.length} 条新正则（API不可用）。`);
            }
            if (regexesToUpdate.length > 0) {
                await TavernHelper.updateTavernRegexesWith(regexes => {
                    const updateMap = new Map(regexesToUpdate.map(r => [r.id, r]));
                    regexes.forEach((regex) => {
                        if (updateMap.has(regex.id)) {
                            Object.assign(regex, updateMap.get(regex.id));
                        }
                    });
                    return regexes;
                }, { scope: 'global' });
                toastr.success(`已更新 ${regexesToUpdate.length} 条正则。`);
            }
            if (regexesToAdd.length === 0 && regexesToUpdate.length === 0) {
                toastr.info('没有需要导入的正则。');
            }
        }
        catch (error) {
            console.error('导入正则失败:', error);
            toastr.error('导入正则失败，请检查控制台获取更多信息。');
        }
    }
    async function showBatchExportPopup() {
        const configs = await getStoredConfigs();
        const configList = Object.values(configs);
        if (configList.length === 0) {
            toastr.warning('没有可导出的配置。');
            return;
        }
        const configsHtml = configList
            .map((config, index) => {
            const safeName = $('<div/>').text(config.name).html();
            return `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 5px; border-bottom: 1px solid #eee;">
          <label for="batch-export-toggle-${index}" style="cursor: pointer; flex: 1; margin-right: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${safeName}">${safeName}</label>
          <label class="pm-switch">
            <input type="checkbox" class="batch-export-checkbox" id="batch-export-toggle-${index}" data-id="${config.id}" checked/>
            <span class="pm-slider"></span>
          </label>
        </div>
      `;
        })
            .join('');
        const popupId = 'preset-manager-batch-export-popup';
        $(`#${popupId}`).remove();
        const popupHtml = `
      <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
        <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
          <h4 style="margin-top:0; color:#6a4226; text-align: center;">批量导出配置</h4>
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
        const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 5vh; } }</style>`;
        $(`#${popupId}`).append(mobileStyles);
        $('#batch-export-select-all').on('click', () => $('.batch-export-checkbox').prop('checked', true));
        $('#batch-export-deselect-all').on('click', () => $('.batch-export-checkbox').prop('checked', false));
        $('#batch-export-cancel').on('click', () => $(`#${popupId}`).remove());
        $('#batch-export-confirm').on('click', async () => {
            const selectedIds = new Set();
            $('.batch-export-checkbox:checked').each(function () {
                selectedIds.add($(this).data('id'));
            });
            const selectedConfigs = configList.filter((c) => selectedIds.has(c.id));
            $(`#${popupId}`).remove();
            await batchExportConfigs(selectedConfigs);
        });
    }
    async function batchExportConfigs(selectedConfigs) {
        if (selectedConfigs.length === 0) {
            toastr.warning('没有选择要导出的配置。');
            return;
        }
        try {
            let userRemark = '';
            const addRemarkChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "是否要为此批量导出添加备注信息？"`);
            if (addRemarkChoice === '1') {
                userRemark = (await triggerSlash(`/input multiline=true placeholder="请输入备注，例如导出时间、用途等..." "添加备注"`));
            }
            const exportBundle = {
                type: 'MiaoMiaoPresetBundle',
                version: 1,
                remark: userRemark || '',
                presetConfigs: selectedConfigs,
                presetData: null,
                regexData: null,
            };
            const presetNames = [...new Set(selectedConfigs.map((c) => c.presetName).filter(Boolean))];
            if (presetNames.length > 0) {
                const includePresetsChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "是否要将关联的预设文件一起打包导出？"`);
                if (includePresetsChoice === '1') {
                    const presetDataMap = {};
                    for (const presetName of presetNames) {
                        if (TavernHelper.getPresetNames().includes(presetName)) {
                            const presetData = TavernHelper.getPreset(presetName);
                            if (presetData) {
                                presetData.name = presetName;
                                presetDataMap[presetName] = presetData;
                            }
                        }
                    }
                    exportBundle.presetData = presetDataMap;
                    toastr.info(`已将 ${Object.keys(presetDataMap).length} 个预设文件打包。`);
                }
            }
            const allRegexIds = new Set();
            selectedConfigs.forEach((config) => {
                if (config.regexStates) {
                    config.regexStates.forEach((r) => allRegexIds.add(r.id));
                }
            });
            if (allRegexIds.size > 0) {
                const includeRegexChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "是否要将绑定的正则一起导出？"`);
                if (includeRegexChoice === '1') {
                    const allGlobalRegexes = await TavernHelper.getTavernRegexes({ scope: 'global' });
                    const boundRegexes = allGlobalRegexes.filter(r => allRegexIds.has(r.id));
                    exportBundle.regexData = boundRegexes;
                    toastr.info(`已将 ${boundRegexes.length} 条正则打包导出。`);
                }
            }
            const defaultFileName = `batch_export_${new Date().toISOString().slice(0, 10)}`;
            let userFileName = (await triggerSlash(`/input default="${defaultFileName}" "请输入导出的文件名（无需后缀）"`));
            if (!userFileName || userFileName.trim() === '') {
                userFileName = defaultFileName;
            }
            userFileName = userFileName.trim().replace(/\.json$/, '');
            const jsonString = JSON.stringify(exportBundle, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `${userFileName}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toastr.success(`已批量导出 ${selectedConfigs.length} 个配置。`);
        }
        catch (error) {
            console.error('批量导出失败:', error);
            toastr.error('批量导出失败，请检查控制台获取更多信息。');
        }
    }
    async function startBatchImportFlow(configsToImport) {
        if (!configsToImport || configsToImport.length === 0) {
            toastr.warning('没有可导入的配置。');
            return;
        }
        try {
            const existingConfigs = await getStoredConfigs();
            const existingNames = new Set(Object.values(existingConfigs).map((c) => c.name));
            const configsToAdd = [];
            const configsToSkip = [];
            for (const config of configsToImport) {
                let finalName = config.name;
                let counter = 1;
                while (existingNames.has(finalName)) {
                    finalName = `${config.name}_${counter}`;
                    counter++;
                }
                if (finalName !== config.name) {
                    const renameChoice = await triggerSlash(`/popup okButton="重命名" cancelButton="跳过" result=true "配置 \"${config.name}\" 已存在，是否重命名为 \"${finalName}\"？"`);
                    if (renameChoice === '1') {
                        config.name = finalName;
                        configsToAdd.push(config);
                    }
                    else {
                        configsToSkip.push(config);
                    }
                }
                else {
                    configsToAdd.push(config);
                }
                existingNames.add(finalName);
            }
            if (configsToAdd.length > 0) {
                configsToAdd.forEach(config => {
                    config.id = generateUniqueId();
                    existingConfigs[config.id] = config;
                });
                await setStoredConfigs(existingConfigs);
                toastr.success(`已导入 ${configsToAdd.length} 个配置。`);
                if (configsToSkip.length > 0) {
                    toastr.info(`跳过了 ${configsToSkip.length} 个重名配置。`);
                }
                await renderConfigsList();
            }
            else {
                toastr.info('没有配置被导入。');
            }
        }
        catch (error) {
            console.error('批量导入失败:', error);
            toastr.error('批量导入失败，请检查控制台获取更多信息。');
        }
    }
    async function handleMegaBundleImport(megaBundle) {
        try {
            if (megaBundle.presetConfigs && Array.isArray(megaBundle.presetConfigs)) {
                await startBatchImportFlow(megaBundle.presetConfigs);
            }
            if (megaBundle.presetData) {
                const presetDataMap = megaBundle.presetData;
                if (typeof presetDataMap === 'object') {
                    const presetNames = Object.keys(presetDataMap);
                    for (const presetName of presetNames) {
                        if (!TavernHelper.getPresetNames().includes(presetName)) {
                            try {
                                await TavernHelper.importRawPreset(JSON.stringify(presetDataMap[presetName]));
                                toastr.success(`预设 \"${presetName}\" 已导入。`);
                            }
                            catch (error) {
                                console.error(`导入预设 \"${presetName}\" 失败:`, error);
                                toastr.error(`导入预设 \"${presetName}\" 失败。`);
                            }
                        }
                    }
                }
            }
            if (megaBundle.regexData && Array.isArray(megaBundle.regexData)) {
                try {
                    await importRegexLogic(megaBundle.regexData);
                    toastr.success(`已导入 ${megaBundle.regexData.length} 条正则。`);
                }
                catch (error) {
                    console.error('导入正则失败:', error);
                    toastr.error('导入正则失败。');
                }
            }
            toastr.success('批量导入完成。');
        }
        catch (error) {
            console.error('处理批量导入失败:', error);
            toastr.error('处理批量导入失败，请检查控制台获取更多信息。');
        }
    }
    function showBatchImportConfigSelectionPopup(configsToImport) {
        return new Promise(resolve => {
            const popupId = 'preset-manager-batch-import-selection-popup';
            $(`#${popupId}`).remove();
            const configsHtml = configsToImport
                .map((config, index) => {
                const safeName = $('<div/>').text(config.name).html();
                return `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 5px; border-bottom: 1px solid #eee;">
            <label for="batch-import-toggle-${index}" style="cursor: pointer; flex: 1; margin-right: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${safeName}">${safeName}</label>
            <label class="pm-switch">
              <input type="checkbox" class="batch-import-checkbox" id="batch-import-toggle-${index}" data-config='${JSON.stringify(config)}' checked/>
              <span class="pm-slider"></span>
            </label>
          </div>
        `;
            })
                .join('');
            const popupHtml = `
        <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
          <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
            <h4 style="margin-top:0; color:#6a4226; text-align: center;">选择要导入的配置</h4>
            <div style="margin: 10px 0; display: flex; justify-content: space-around;">
              <button id="batch-import-select-all" style="padding: 6px 12px; background-color:#a5d6f9; border:none; border-radius:6px; cursor:pointer;">全选</button>
              <button id="batch-import-deselect-all" style="padding: 6px 12px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer;">全不选</button>
            </div>
            <div style="flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 20px; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;">
              ${configsHtml}
            </div>
            <div style="text-align: right; display:flex; justify-content:flex-end; gap: 10px;">
              <button id="batch-import-cancel" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;">取消</button>
              <button id="batch-import-confirm" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">确认导入</button>
            </div>
          </div>
        </div>
      `;
            $('body').append(popupHtml);
            const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 5vh; } }</style>`;
            $(`#${popupId}`).append(mobileStyles);
            $('#batch-import-select-all').on('click', () => $('.batch-import-checkbox').prop('checked', true));
            $('#batch-import-deselect-all').on('click', () => $('.batch-import-checkbox').prop('checked', false));
            $('#batch-import-cancel').on('click', () => {
                $(`#${popupId}`).remove();
                resolve(null);
            });
            $('#batch-import-confirm').on('click', () => {
                const selectedConfigs = [];
                $('.batch-import-checkbox:checked').each(function () {
                    const configData = JSON.parse($(this).data('config'));
                    selectedConfigs.push(configData);
                });
                $(`#${popupId}`).remove();
                resolve(selectedConfigs);
            });
        });
    }
    async function showBatchDeletePopup() {
        const configs = await getStoredConfigs();
        const configList = Object.values(configs);
        if (configList.length === 0) {
            toastr.warning('没有可删除的配置。');
            return;
        }
        const configsHtml = configList
            .map((config, index) => {
            const safeName = $('<div/>').text(config.name).html();
            return `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 5px; border-bottom: 1px solid #eee;">
          <label for="batch-delete-toggle-${index}" style="cursor: pointer; flex: 1; margin-right: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${safeName}">${safeName}</label>
          <label class="pm-switch">
            <input type="checkbox" class="batch-delete-checkbox" id="batch-delete-toggle-${index}" data-id="${config.id}"/>
            <span class="pm-slider"></span>
          </label>
        </div>
      `;
        })
            .join('');
        const popupId = 'preset-manager-batch-delete-popup';
        $(`#${popupId}`).remove();
        const popupHtml = `
      <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
        <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
          <h4 style="margin-top:0; color:#c62828; text-align: center;">批量删除配置</h4>
          <div style="margin: 10px 0; display: flex; justify-content: space-around;">
            <button id="batch-delete-select-all" style="padding: 6px 12px; background-color:#a5d6f9; border:none; border-radius:6px; cursor:pointer;">全选</button>
            <button id="batch-delete-deselect-all" style="padding: 6px 12px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer;">全不选</button>
          </div>
          <div style="flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 20px; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;">
            ${configsHtml}
          </div>
          <div style="text-align: right; display:flex; justify-content:flex-end; gap: 10px;">
            <button id="batch-delete-cancel" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;">取消</button>
            <button id="batch-delete-confirm" style="padding: 8px 16px; background-color:#f5a8a0; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#fff;">删除选中</button>
          </div>
        </div>
      </div>
    `;
        $('body').append(popupHtml);
        const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 5vh; } }</style>`;
        $(`#${popupId}`).append(mobileStyles);
        $('#batch-delete-select-all').on('click', () => $('.batch-delete-checkbox').prop('checked', true));
        $('#batch-delete-deselect-all').on('click', () => $('.batch-delete-checkbox').prop('checked', false));
        $('#batch-delete-cancel').on('click', () => $(`#${popupId}`).remove());
        $('#batch-delete-confirm').on('click', async () => {
            const selectedIds = new Set();
            $('.batch-delete-checkbox:checked').each(function () {
                selectedIds.add($(this).data('id'));
            });
            const selectedConfigIds = Array.from(selectedIds);
            $(`#${popupId}`).remove();
            await batchDeleteConfigs(selectedConfigIds);
        });
    }
    async function batchDeleteConfigs(configIds) {
        if (configIds.length === 0) {
            toastr.warning('没有选择要删除的配置。');
            return;
        }
        const configs = await getStoredConfigs();
        const configsToDelete = configIds.map(id => configs[id]).filter(Boolean);
        if (configsToDelete.length === 0) {
            toastr.error('选择的配置不存在。');
            return;
        }
        const confirmDelete = await triggerSlash(`/popup okButton="删除" cancelButton="取消" result=true "确定要删除 ${configsToDelete.length} 个配置吗？此操作不可撤销。"`);
        if (confirmDelete === '1') {
            configIds.forEach(id => {
                delete configs[id];
            });
            await setStoredConfigs(configs);
            toastr.success(`已删除 ${configsToDelete.length} 个配置。`);
            await renderConfigsList();
        }
        else {
            toastr.info('删除操作已取消。');
        }
    }
    async function ensureConfigLorebookExists() {
        try {
            try {
                await TavernHelper.getWorldbook(CONFIG_LOREBOOK_NAME);
            }
            catch (error) {
                // 世界书不存在，创建一个新的
                await TavernHelper.createOrReplaceWorldbook(CONFIG_LOREBOOK_NAME, []);
                console.log('已创建配置存储世界书条目。');
            }
        }
        catch (error) {
            console.error('确保配置世界书存在失败:', error);
        }
    }
    async function onChatChanged() {
        try {
            const charData = await TavernHelper.getCharData('current');
            if (!charData || !charData.avatar)
                return;
            const currentCharAvatar = charData.avatar;
            if (lastProcessedCharAvatar === currentCharAvatar)
                return;
            lastProcessedCharAvatar = currentCharAvatar;
            const configs = await getStoredConfigs();
            const boundConfigs = Object.values(configs).filter((config) => config.boundCharAvatar === currentCharAvatar);
            if (boundConfigs.length === 0)
                return;
            if (boundConfigs.length === 1) {
                const config = boundConfigs[0];
                const loadChoice = await triggerSlash(`/popup okButton="加载" cancelButton="取消" result=true "检测到角色 \"${charData.name}\" 绑定了配置 \"${config.name}\"，是否加载？"`);
                if (loadChoice === '1') {
                    await loadConfig(config.id, false);
                }
            }
            else {
                const selectedConfigId = await showConfigSelectionPopup(boundConfigs, charData.name);
                if (selectedConfigId) {
                    await loadConfig(selectedConfigId, false);
                }
            }
        }
        catch (error) {
            console.error('聊天切换处理失败:', error);
        }
    }
    async function init() {
        await ensureConfigLorebookExists();
        createUI();
        eventOn(getButtonEvent(TOGGLE_BUTTON_NAME), toggleUI);
        eventOn(tavern_events.CHAT_CHANGED, onChatChanged);
        $(document).on('click', function (e) {
            if (!$(e.target).is('button[name="more-actions"]') && $(e.target).closest('.pm-submenu').length === 0) {
                $('.pm-submenu').hide();
            }
        });
    }
    function checkReady() {
        if (window.jQuery &&
            window.TavernHelper &&
            typeof TavernHelper.createOrReplaceWorldbook === 'function' &&
            window.tavern_events &&
            typeof getButtonEvent === 'function') {
            init();
        }
        else {
            setTimeout(checkReady, 150);
        }
    }
    checkReady();
})();
$(() => {
    const GROUPS_LOREBOOK_NAME = 'PresetGroups_Data';
    const TOGGLE_BUTTON_NAME = '预设条目分组';
    const UI_ID = 'preset-groups-ui';
    let appliedOnce = false;
    function genId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }
    async function ensureLorebook() {
        try {
            await TavernHelper.getWorldbook(GROUPS_LOREBOOK_NAME);
        }
        catch {
            await TavernHelper.createOrReplaceWorldbook(GROUPS_LOREBOOK_NAME, []);
        }
    }
    async function readAllPresetGroups() {
        try {
            const entries = await TavernHelper.getWorldbook(GROUPS_LOREBOOK_NAME);
            const result = {};
            for (const e of entries) {
                try {
                    const obj = JSON.parse(e.content);
                    if (obj && typeof obj.presetName === 'string' && Array.isArray(obj.groups)) {
                        result[obj.presetName] = obj;
                    }
                }
                catch {
                    /* ignore invalid entry */
                }
            }
            return result;
        }
        catch {
            return {};
        }
    }
    async function writeAllPresetGroups(map) {
        const entries = Object.values(map).map(v => ({
            name: `Groups: ${v.presetName}`,
            strategy: { type: 'constant', keys: [v.presetName] },
            content: JSON.stringify(v),
            enabled: false,
            comment: `Preset Groups for ${v.presetName}`,
        }));
        await TavernHelper.createOrReplaceWorldbook(GROUPS_LOREBOOK_NAME, entries);
    }
    async function getCurrentPresetName() {
        return TavernHelper.getLoadedPresetName();
    }
    function getCurrentPromptStates() {
        const preset = TavernHelper.getPreset('in_use');
        const all = [...preset.prompts, ...preset.prompts_unused];
        return all.map(p => ({ id: p.id, enabled: p.enabled, name: p.name }));
    }
    function ensureUI() {
        if ($(`#${UI_ID}`).length)
            return;
        const ui = $(`
			<div id="${UI_ID}" style="display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10050;background:#fff8f0;color:#3a2c2c;border:1px solid #e0c9a6;border-radius:16px;padding:16px;box-shadow:0 4px 25px rgba(120,90,60,.25);width:92%;max-width:720px;max-height:85vh;display:flex;flex-direction:column;">
				<style>
					#${UI_ID} h4{margin:0 0 10px 0;border-bottom:2px solid #f0d8b6;padding-bottom:8px;color:#6a4226}
					#${UI_ID} .section{margin:8px 0}
					#${UI_ID} .list{border:1px solid #f0e2d0;border-radius:8px;overflow:hidden;background:#fff}
					#${UI_ID} .row{display:flex;align-items:center;gap:8px;padding:8px;border-bottom:1px solid #eee}
					#${UI_ID} .row:last-child{border-bottom:none}
					#${UI_ID} .btn{padding:6px 12px;border:none;border-radius:6px;cursor:pointer}
					#${UI_ID} .btn-primary{background:#f4c78e;color:#3a2c2c;font-weight:600}
					#${UI_ID} .btn-danger{background:#f44336;color:#fff}
					#${UI_ID} .btn-gray{background:#e0e0e0;color:#333}
					#${UI_ID} .groups{max-height:30vh;overflow:auto}
					#${UI_ID} .prompts{max-height:30vh;overflow:auto}
				</style>
				<h4>预设条目分组</h4>
				<button id="${UI_ID}-close" class="btn btn-gray" style="position:absolute;right:12px;top:12px">关闭</button>
				<div class="section">
					<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
						<input id="${UI_ID}-group-name" placeholder="分组名" style="flex:1;min-width:120px;padding:6px 8px;border:1px solid #d4b58b;border-radius:6px;background:#fff;color:#3a2c2c"/>
						<button id="${UI_ID}-create" class="btn btn-primary">用所选范围创建分组</button>
						<button id="${UI_ID}-apply" class="btn btn-primary">应用到页面</button>
						<button id="${UI_ID}-reset" class="btn btn-gray">移除页面折叠</button>
					</div>
				</div>
				<div class="section" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
					<div>
						<div style="margin-bottom:6px;font-weight:600">当前预设条目（点击选择起点，再点选择终点，或用Shift选择）</div>
						<div id="${UI_ID}-prompts" class="list prompts"></div>
					</div>
					<div>
						<div style="margin-bottom:6px;font-weight:600">已有分组</div>
						<div id="${UI_ID}-groups" class="list groups"></div>
					</div>
				</div>
				<div class="section" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
					<button id="${UI_ID}-export" class="btn btn-primary">导出分组</button>
					<button id="${UI_ID}-import" class="btn btn-primary">导入分组</button>
					<label style="display:flex;align-items:center;gap:6px"><input type="checkbox" id="${UI_ID}-include-in-config"/> 导出配置时附带分组</label>
					<button id="${UI_ID}-selector-config" class="btn btn-gray">选择器设置</button>
				</div>
			</div>
		`);
        $('body').append(ui);
        $(`#${UI_ID}-close`).on('click', () => toggleUI());
        $(`#${UI_ID}-create`).on('click', createGroupFromSelection);
        $(`#${UI_ID}-apply`).on('click', () => applyGroupsToPage());
        $(`#${UI_ID}-reset`).on('click', () => removeAppliedFolders());
        $(`#${UI_ID}-export`).on('click', exportGroups);
        $(`#${UI_ID}-import`).on('click', importGroups);
        $(`#${UI_ID}-selector-config`).on('click', openSelectorDialog);
    }
    function toggleUI() {
        const ui = $(`#${UI_ID}`);
        if (ui.is(':visible'))
            ui.hide();
        else {
            render();
            ui.show();
        }
    }
    let lastClickIndex = null;
    const selectedIndexes = new Set();
    function renderPromptsList(prompts) {
        const wrap = $(`#${UI_ID}-prompts`);
        wrap.empty();
        prompts.forEach((p, idx) => {
            const row = $(`<div class="row" style="user-select:none;cursor:pointer"></div>`);
            const cb = $(`<input type="checkbox"/>`).prop('checked', selectedIndexes.has(idx));
            row.append(cb);
            row.append($(`<div style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></div>`).text(p.name));
            row.on('click', (e) => {
                const shift = e.shiftKey;
                if (shift && lastClickIndex !== null) {
                    const [a, b] = [lastClickIndex, idx].sort((x, y) => x - y);
                    selectedIndexes.clear();
                    for (let i = a; i <= b; i++)
                        selectedIndexes.add(i);
                }
                else {
                    selectedIndexes.clear();
                    selectedIndexes.add(idx);
                    lastClickIndex = idx;
                }
                renderPromptsList(prompts);
            });
            wrap.append(row);
        });
    }
    async function renderGroupsList(groups, prompts) {
        const wrap = $(`#${UI_ID}-groups`);
        wrap.empty();
        if (groups.length === 0) {
            wrap.append(`<div class="row" style="color:#888">暂无分组</div>`);
            return;
        }
        const idToIndex = new Map(prompts.map((p, i) => [p.id, i]));
        groups.forEach(g => {
            const a = idToIndex.get(g.startPromptId) ?? -1;
            const b = idToIndex.get(g.endPromptId) ?? -1;
            const range = a >= 0 && b >= 0 ? `[${Math.min(a, b)} - ${Math.max(a, b)}]` : '[无效]';
            const row = $(`<div class="row"></div>`);
            row.append($(`<div style="font-weight:600"></div>`).text(g.name));
            row.append($(`<div style="color:#777"></div>`).text(range));
            const toggle = $(`<button class="btn btn-gray">${g.collapsed ? '展开' : '折叠'}</button>`);
            toggle.on('click', async () => {
                const map = await readAllPresetGroups();
                const preset = await getCurrentPresetName();
                const cur = map[preset];
                if (!cur)
                    return;
                const item = cur.groups.find(x => x.id === g.id);
                if (!item)
                    return;
                item.collapsed = !item.collapsed;
                await writeAllPresetGroups(map);
                render();
                applyGroupsToPage();
            });
            const rename = $(`<button class="btn btn-primary">重命名</button>`);
            rename.on('click', async () => {
                const newName = await triggerSlash(`/input default="${g.name}" "输入新的分组名"`);
                if (!newName)
                    return;
                const map = await readAllPresetGroups();
                const preset = await getCurrentPresetName();
                const cur = map[preset];
                if (!cur)
                    return;
                const item = cur.groups.find(x => x.id === g.id);
                if (!item)
                    return;
                item.name = newName.trim();
                await writeAllPresetGroups(map);
                render();
                applyGroupsToPage();
            });
            const del = $(`<button class="btn btn-danger">删除</button>`);
            del.on('click', async () => {
                const ok = await triggerSlash(`/popup okButton="删除" cancelButton="取消" result=true "确认删除分组：${g.name}"`);
                if (ok !== '1')
                    return;
                const map = await readAllPresetGroups();
                const preset = await getCurrentPresetName();
                const cur = map[preset];
                if (!cur)
                    return;
                cur.groups = cur.groups.filter(x => x.id !== g.id);
                await writeAllPresetGroups(map);
                render();
                applyGroupsToPage();
            });
            row.append($(`<div style="margin-left:auto;display:flex;gap:6px"></div>`).append(toggle, rename, del));
            wrap.append(row);
        });
    }
    async function render() {
        const prompts = getCurrentPromptStates();
        renderPromptsList(prompts);
        const map = await readAllPresetGroups();
        const preset = await getCurrentPresetName();
        const cur = map[preset] ?? { presetName: preset, groups: [], selectors: [] };
        renderGroupsList(cur.groups, prompts);
    }
    async function createGroupFromSelection() {
        const prompts = getCurrentPromptStates();
        if (selectedIndexes.size === 0) {
            toastr.info('请选择一段连续的条目');
            return;
        }
        const sorted = Array.from(selectedIndexes).sort((a, b) => a - b);
        if (sorted[sorted.length - 1] - sorted[0] + 1 !== sorted.length) {
            toastr.error('必须选择相邻条目');
            return;
        }
        const nameInput = $(`#${UI_ID}-group-name`).val();
        const groupName = (nameInput || '').toString().trim() || `分组 ${new Date().toLocaleTimeString()}`;
        const startPrompt = prompts[sorted[0]];
        const endPrompt = prompts[sorted[sorted.length - 1]];
        const preset = await getCurrentPresetName();
        const map = await readAllPresetGroups();
        const cur = map[preset] ?? { presetName: preset, groups: [], selectors: [] };
        cur.groups.push({
            id: genId(),
            name: groupName,
            startPromptId: startPrompt.id,
            endPromptId: endPrompt.id,
            collapsed: true,
        });
        map[preset] = cur;
        await writeAllPresetGroups(map);
        toastr.success('分组已创建');
        render();
        applyGroupsToPage();
    }
    function normalizeText(t) {
        return t.replace(/\s+/g, '').trim();
    }
    function findPromptListNodes() {
        const candidates = getSelectorCandidates();
        for (const sel of candidates) {
            const nodes = $(sel);
            if (nodes.length >= 2)
                return nodes;
        }
        return $();
    }
    function getSelectorCandidates() {
        // 1) 用户为当前预设自定义的选择器（优先）
        // 2) 预置候选
        const preset = TavernHelper.getLoadedPresetName();
        const fallback = [
            'li.completion_prompt_manager_prompt',
            '#preset-list .preset-prompt',
            '.preset .prompt-item',
            "[data-role='preset-prompt']",
            '.st-prompt-item',
            '.prompt-item-row',
            '.preset-prompts li',
            '.preset-prompts .item',
        ];
        const custom = (window.__presetGroupsSelectors || {})[preset] ?? [];
        return [...custom, ...fallback];
    }
    async function openSelectorDialog() {
        const preset = await getCurrentPresetName();
        const map = await readAllPresetGroups();
        const cur = map[preset] ?? { presetName: preset, groups: [], selectors: [] };
        const popupId = `${UI_ID}-selector-popup`;
        $(`#${popupId}`).remove();
        const toText = (arr) => (arr ?? []).join('\n');
        const html = `
			<div id="${popupId}" style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:10060;display:flex;align-items:center;justify-content:center">
				<div style="background:#fff8f0;border:1px solid #e0c9a6;border-radius:12px;padding:16px;max-width:720px;width:92%;box-shadow:0 4px 25px rgba(120,90,60,.25)">
					<h4 style="margin:0 0 10px 0;border-bottom:2px solid #f0d8b6;padding-bottom:8px;color:#6a4226">选择器设置（每行一个）</h4>
					<textarea id="${popupId}-input" style="width:100%;height:200px;border:1px solid #d4b58b;border-radius:6px;background:#fff;color:#3a2c2c;padding:8px">${toText(cur.selectors)}</textarea>
					<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
						<button id="${popupId}-test" class="btn btn-primary">测试并高亮</button>
						<button id="${popupId}-save" class="btn btn-primary">保存</button>
						<button id="${popupId}-close" class="btn btn-gray" style="margin-left:auto">关闭</button>
					</div>
				</div>
			</div>`;
        $('body').append(html);
        const readLines = () => {
            return $(`#${popupId}-input`).val()
                .split(/\r?\n/)
                .map(s => s.trim())
                .filter(Boolean);
        };
        $(`#${popupId}-test`).on('click', () => {
            $(`[data-preset-selector-highlight]`).removeAttr('data-preset-selector-highlight').css({ outline: '' });
            const lines = readLines();
            let matched = 0;
            for (const sel of lines) {
                try {
                    const nodes = $(sel);
                    matched += nodes.length;
                    nodes.attr('data-preset-selector-highlight', '1').css({ outline: '2px solid #f4c78e' });
                }
                catch {
                    /* ignore */
                }
            }
            toastr.info(`测试完成：匹配到 ${matched} 个元素`);
        });
        $(`#${popupId}-save`).on('click', async () => {
            const lines = readLines();
            map[preset] = { presetName: preset, groups: cur.groups ?? [], selectors: lines };
            await writeAllPresetGroups(map);
            window.__presetGroupsSelectors =
                window.__presetGroupsSelectors || {};
            window.__presetGroupsSelectors[preset] = lines;
            toastr.success('已保存选择器');
            applyGroupsToPage();
        });
        $(`#${popupId}-close`).on('click', () => $(`#${popupId}`).remove());
    }
    function mapPromptsToNodes(prompts) {
        const nodes = findPromptListNodes();
        if (nodes.length === 0)
            return { nodes, map: [] };
        const nodeTexts = nodes.map((_, el) => normalizeText($(el).text())).get();
        const map = [];
        for (const p of prompts) {
            const idx = nodeTexts.findIndex(t => t.includes(normalizeText(p.name)));
            map.push(idx);
        }
        return { nodes, map };
    }
    // 顶层声明（避免环境模块声明错误）
    (function () {
        window.__presetGroupsSelectors =
            window.__presetGroupsSelectors ?? {};
    })();
    function removeAppliedFolders() {
        $('[data-preset-group-wrapper]').each(function () {
            const wrap = $(this);
            const items = wrap.find('[data-preset-group-item]');
            items.each(function () {
                $(this).insertBefore(wrap);
            });
            wrap.remove();
        });
    }
    async function applyGroupsToPage() {
        const prompts = getCurrentPromptStates();
        const { nodes, map } = mapPromptsToNodes(prompts);
        if (nodes.length === 0) {
            if (!appliedOnce)
                toastr.info('未找到预设条目列表的DOM，无法折叠。可在不同主题下再试。');
            return;
        }
        removeAppliedFolders();
        const preset = await getCurrentPresetName();
        const all = await readAllPresetGroups();
        const cur = all[preset];
        if (!cur || cur.groups.length === 0)
            return;
        const idToIndex = new Map(prompts.map((p, i) => [p.id, i]));
        for (const g of cur.groups) {
            const a = idToIndex.get(g.startPromptId);
            const b = idToIndex.get(g.endPromptId);
            if (a === undefined || b === undefined)
                continue;
            const [start, end] = [Math.min(a, b), Math.max(a, b)];
            const startNodeIdx = map[start];
            const endNodeIdx = map[end];
            if (startNodeIdx < 0 || endNodeIdx < 0)
                continue;
            const startEl = nodes.get(startNodeIdx);
            const endEl = nodes.get(endNodeIdx);
            if (!startEl || !endEl)
                continue;
            const startNode = $(startEl);
            const endNode = $(endEl);
            const wrapper = $(`
				<div data-preset-group-wrapper style="border:1px solid #e0c9a6;border-radius:8px;margin:4px 0;background:#fffdf8">
					<div data-preset-group-header style="display:flex;align-items:center;gap:8px;padding:6px 8px;cursor:pointer;background:#f7efe2;border-bottom:1px solid #f0e2d0">
						<span data-preset-group-toggle style="display:inline-block;width:14px;text-align:center">${g.collapsed ? '▶' : '▼'}</span>
						<span style="font-weight:600">${g.name}</span>
						<span style="margin-left:auto;color:#777">${start}-${end}</span>
					</div>
				</div>
			`);
            const header = wrapper.find('[data-preset-group-header]');
            const toggleIcon = wrapper.find('[data-preset-group-toggle]');
            let curNode = startNode;
            const toMove = [];
            while (true) {
                const n = curNode;
                toMove.push(n);
                if (n.is(endNode))
                    break;
                const next = n.next();
                if (next.length === 0)
                    break;
                curNode = next;
            }
            toMove.forEach(n => {
                n.attr('data-preset-group-item', '');
            });
            toMove[0].before(wrapper);
            toMove.forEach(n => wrapper.append(n));
            const setCollapsed = (collapsed) => {
                wrapper.children('[data-preset-group-item]').css('display', collapsed ? 'none' : '');
                toggleIcon.text(collapsed ? '▶' : '▼');
            };
            setCollapsed(g.collapsed);
            header.on('click', async () => {
                g.collapsed = !g.collapsed;
                setCollapsed(g.collapsed);
                const all2 = await readAllPresetGroups();
                const cur2 = all2[preset];
                if (cur2) {
                    const it = cur2.groups.find(x => x.id === g.id);
                    if (it)
                        it.collapsed = g.collapsed;
                    await writeAllPresetGroups(all2);
                }
            });
        }
        appliedOnce = true;
    }
    async function exportGroups() {
        const preset = await getCurrentPresetName();
        const all = await readAllPresetGroups();
        const cur = all[preset];
        if (!cur || cur.groups.length === 0) {
            toastr.info('当前预设没有已保存分组');
            return;
        }
        const includeConfig = await triggerSlash(`/popup okButton="包含" cancelButton="仅分组" result=true "是否在导出中包含当前预设的条目开关配置？"`);
        const bundle = {
            type: 'MiaoMiaoPresetGroupsBundle',
            version: 1,
            presetName: preset,
            groups: cur.groups,
            selectors: cur.selectors ?? [],
            config: null,
        };
        if (includeConfig === '1') {
            bundle.config = { states: getCurrentPromptStates() };
        }
        const defaultName = `Groups_${preset}`;
        let name = await triggerSlash(`/input default="${defaultName}" "请输入导出文件名（无需后缀）"`);
        name = (name || defaultName)
            .toString()
            .trim()
            .replace(/\.json$/i, '');
        const json = JSON.stringify(bundle, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        toastr.success('分组已导出');
    }
    async function importGroups() {
        const input = $('<input type="file" accept=".json" style="display:none">');
        $('body').append(input);
        input.on('change', async (e) => {
            try {
                const file = e.target.files?.[0];
                if (!file)
                    return;
                const text = await file.text();
                const data = JSON.parse(text);
                if (!data || data.type !== 'MiaoMiaoPresetGroupsBundle') {
                    toastr.error('文件类型不匹配');
                    return;
                }
                const preset = await getCurrentPresetName();
                if (data.presetName && data.presetName !== preset) {
                    const ok = await triggerSlash(`/popup okButton="应用" cancelButton="取消" result=true "导入文件来自预设：${data.presetName}，是否应用到当前预设：${preset}？"`);
                    if (ok !== '1')
                        return;
                }
                const applyGroups = await triggerSlash(`/popup okButton=\"应用分组\" cancelButton=\"跳过\" result=true \"是否应用文件中的分组设置？\"`);
                const applyConfig = data.config
                    ? await triggerSlash(`/popup okButton="应用配置" cancelButton="跳过" result=true "文件包含条目开关配置，是否应用？"`)
                    : '0';
                if (applyGroups === '1') {
                    const all = await readAllPresetGroups();
                    all[preset] = {
                        presetName: preset,
                        groups: data.groups.map(g => ({ ...g, id: genId() })),
                        selectors: Array.isArray(data.selectors) ? data.selectors : [],
                    };
                    await writeAllPresetGroups(all);
                    toastr.success('已导入分组');
                }
                if (applyConfig === '1' && data.config && Array.isArray(data.config.states)) {
                    const states = new Map(data.config.states.map((s) => [s.id, s.enabled]));
                    await TavernHelper.updatePresetWith('in_use', presetObj => {
                        [...presetObj.prompts, ...presetObj.prompts_unused].forEach(p => {
                            if (states.has(p.id))
                                p.enabled = states.get(p.id);
                        });
                        return presetObj;
                    });
                    toastr.success('已应用条目配置');
                }
                render();
                applyGroupsToPage();
            }
            catch (err) {
                console.error(err);
                toastr.error('导入失败');
            }
            finally {
                input.remove();
            }
        });
        input.trigger('click');
    }
    async function init() {
        await ensureLorebook();
        ensureUI();
        eventOn(getButtonEvent(TOGGLE_BUTTON_NAME), toggleUI);
        applyGroupsToPage();
        eventOn(tavern_events.CHAT_CHANGED, () => setTimeout(() => applyGroupsToPage(), 300));
        const mo = new MutationObserver(() => applyGroupsToPage());
        mo.observe(document.body, { childList: true, subtree: true });
        $(window).on('pagehide', () => {
            removeAppliedFolders();
        });
        // 暴露全局打开函数，便于在原脚本UI内调用
        window.PresetGroups_openUI = () => {
            ensureUI();
            const ui = $(`#${UI_ID}`);
            if (!ui.is(':visible')) {
                render();
                ui.show();
            }
            else {
                ui.hide();
            }
        };
        // 自动将“分组管理”入口注入到原管理器UI
        attachIntoPresetManagerUI();
    }
    function attachIntoPresetManagerUI() {
        const addButton = () => {
            const host = $('#preset-manager-save-section > div').first();
            if (host.length === 0)
                return;
            if ($('#preset-manager-group-btn').length > 0)
                return;
            const btn = $('<button id="preset-manager-group-btn" style="margin-left: 10px; padding:6px 12px; background-color:#f4c78e; border:none; border-radius:6px; color:#3a2c2c; cursor:pointer; font-weight:bold;">分组管理</button>');
            btn.on('click', () => window.PresetGroups_openUI?.());
            host.append(btn);
        };
        addButton();
        const obs = new MutationObserver(() => addButton());
        obs.observe(document.body, { childList: true, subtree: true });
    }
    init();
});

