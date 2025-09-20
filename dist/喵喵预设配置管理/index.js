import { default as default_0 } from "https://testingcf.jsdelivr.net/npm/downloadjs/+esm";
/******/ var __webpack_modules__ = ({

/***/ 11:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ec: () => (/* binding */ restoreGroupingFromConfig),
/* harmony export */   XZ: () => (/* binding */ showPromptGroupingUI),
/* harmony export */   clearAllGrouping: () => (/* binding */ clearAllGrouping),
/* harmony export */   nO: () => (/* binding */ forceRestoreGrouping),
/* harmony export */   pM: () => (/* binding */ exportPresetGrouping),
/* harmony export */   q$: () => (/* binding */ importPresetGrouping),
/* harmony export */   s8: () => (/* binding */ restoreGroupingDelayed)
/* harmony export */ });
/* unused harmony exports getCurrentPresetPrompts, getAllPresetGroupings, clearPresetGrouping */
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
// 获取当前预设的所有条目
function getCurrentPresetPrompts() {
    const prompts = [];
    const promptElements = $('.completion_prompt_manager_prompt');
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
    const promptsHtml = prompts
        .map((prompt, index) => {
        const isInGroup = existingGroups.some(group => group.promptIds.includes(prompt.id));
        const groupName = existingGroups.find(group => group.promptIds.includes(prompt.id))?.name || '';
        return `
      <div class="prompt-item" data-prompt-id="${prompt.id}" data-index="${index}" 
           style="display: flex; align-items: center; padding: 8px; border: 1px solid #e0e0e0; margin: 2px 0; border-radius: 4px; cursor: pointer; background-color: ${isInGroup ? '#e8f5e8' : '#fff'};">
        <input type="checkbox" class="prompt-checkbox" style="margin-right: 10px; transform: scale(1.2);">
        <span style="flex: 1; font-weight: ${prompt.enabled ? 'bold' : 'normal'}; color: ${prompt.enabled ? '#000' : '#666'};">
          ${$('<div/>').text(prompt.name).html()}
        </span>
        ${isInGroup ? `<span style="font-size: 12px; color: #4CAF50; background: #e8f5e8; padding: 2px 6px; border-radius: 3px;">${groupName}</span>` : ''}
      </div>
    `;
    })
        .join('');
    const popupHtml = `
    <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
      <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 600px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
        <h4 style="margin-top:0; color:#6a4226; text-align: center; border-bottom: 2px solid #f0d8b6; padding-bottom: 10px;">预设条目分组管理</h4>
        
        <div style="margin: 15px 0; display: flex; gap: 10px; align-items: center;">
          <input type="text" id="group-name-input" placeholder="输入分组名称..." style="flex: 1; padding: 6px 10px; border: 1px solid #d4b58b; border-radius: 4px; background: #fff; color: #333;">
          <button id="create-group-btn" style="padding: 6px 12px; background-color:#4CAF50; border:none; border-radius:6px; color:#fff; cursor:pointer; font-weight:bold;">创建分组</button>
          <button id="remove-group-btn" style="padding: 6px 12px; background-color:#f44336; border:none; border-radius:6px; color:#fff; cursor:pointer; font-weight:bold;">移除分组</button>
          <button id="clear-all-groups-btn" style="padding: 6px 12px; background-color:#ff5722; border:none; border-radius:6px; color:#fff; cursor:pointer; font-weight:bold;">清除所有</button>
        </div>

        <div style="margin-bottom: 15px; display: flex; gap: 10px;">
          <button id="select-all-btn" style="padding: 4px 8px; background-color:#2196F3; border:none; border-radius:4px; color:#fff; cursor:pointer; font-size:12px;">全选</button>
          <button id="select-none-btn" style="padding: 4px 8px; background-color:#9E9E9E; border:none; border-radius:4px; color:#fff; cursor:pointer; font-size:12px;">全不选</button>
        </div>

        <div style="flex: 1; min-height: 0; overflow-y: auto; border: 1px solid #f0e2d0; border-radius: 8px; padding: 10px; margin-bottom: 15px;">
          <div style="font-size: 14px; color: #666; margin-bottom: 10px;">提示：选中条目后可以创建分组，分组后的条目会在预设界面中折叠显示</div>
          <div id="prompts-container">
            ${promptsHtml}
          </div>
        </div>

        <div style="margin-bottom: 15px; padding: 10px; background-color: #f0f8ff; border-radius: 6px; border-left: 4px solid #2196F3;">
          <div style="font-size: 13px; color: #1976D2; font-weight: bold; margin-bottom: 5px;">💡 分组说明</div>
          <div style="font-size: 12px; color: #424242;">分组设置直接应用到预设界面，会自动保存到浏览器本地存储中，与预设绑定。</div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div id="existing-groups-info" style="font-size: 12px; color: #666;"></div>
          <div style="display: flex; gap: 10px;">
            <button id="grouping-close" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">关闭</button>
          </div>
        </div>
      </div>
    </div>
  `;
    $('body').append(popupHtml);
    // 显示现有分组信息
    updateExistingGroupsInfo(existingGroups);
    // 绑定事件
    bindGroupingEvents(prompts, existingGroups);
    // 移动端样式
    const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 5vh; max-height: 90vh !important; } }</style>`;
    $(`#${popupId}`).append(mobileStyles);
}
function updateExistingGroupsInfo(groups) {
    const infoElement = $('#existing-groups-info');
    if (groups.length === 0) {
        infoElement.text('当前没有分组');
    }
    else {
        infoElement.text(`现有分组: ${groups.map(g => g.name).join(', ')}`);
    }
}
function bindGroupingEvents(_prompts, existingGroups) {
    let selectedPrompts = [];
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
        // 检查是否有重名分组
        if (existingGroups.some(g => g.name === groupName)) {
            toastr.error('分组名称已存在');
            return;
        }
        // 检查选中的条目是否已经在其他分组中
        const alreadyGroupedPrompts = [];
        selectedPrompts.forEach(promptId => {
            const existingGroup = existingGroups.find(group => group.promptIds.includes(promptId));
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
        // 创建新分组
        const newGroup = {
            id: Date.now().toString(),
            name: groupName,
            promptIds: [...selectedPrompts],
            collapsed: true,
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
        updateExistingGroupsInfo(existingGroups);
        $('#group-name-input').val('');
        $('.prompt-checkbox').prop('checked', false);
        selectedPrompts = [];
        // 直接应用分组到预设界面
        applyGroupingToPreset(existingGroups);
        toastr.success(`分组 "${groupName}" 创建成功并已应用`);
    });
    // 移除分组
    $('#remove-group-btn').on('click', () => {
        if (selectedPrompts.length === 0) {
            toastr.error('请选择要移除分组的条目');
            return;
        }
        // 从所有分组中移除选中的条目
        existingGroups.forEach(group => {
            group.promptIds = group.promptIds.filter(id => !selectedPrompts.includes(id));
        });
        // 移除空分组
        const groupsToRemove = existingGroups.filter(group => group.promptIds.length === 0);
        groupsToRemove.forEach(group => {
            const index = existingGroups.indexOf(group);
            if (index > -1)
                existingGroups.splice(index, 1);
        });
        // 更新UI
        selectedPrompts.forEach(promptId => {
            const item = $(`.prompt-item[data-prompt-id="${promptId}"]`);
            item.css('background-color', '#fff');
            item.find('.group-tag').remove();
        });
        updateExistingGroupsInfo(existingGroups);
        $('.prompt-checkbox').prop('checked', false);
        selectedPrompts = [];
        // 直接应用分组到预设界面
        applyGroupingToPreset(existingGroups);
        toastr.success('已移除选中条目的分组并应用');
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
            });
            updateExistingGroupsInfo(existingGroups);
            $('.prompt-checkbox').prop('checked', false);
            selectedPrompts = [];
            // 直接应用清空的分组到预设界面
            applyGroupingToPreset(existingGroups);
            toastr.success('已清除所有分组并应用');
        }
    });
    // 关闭
    $('#grouping-close').on('click', () => {
        // 关闭前确保保存当前的分组状态
        const currentPresetName = TavernHelper.getLoadedPresetName();
        const validGroups = existingGroups.filter(g => g.promptIds.length > 0);
        savePresetGrouping(currentPresetName, validGroups);
        // 确保分组应用到预设界面
        applyGroupingToDOM(validGroups);
        $('#preset-manager-grouping-popup').remove();
        console.log('分组界面关闭，已保存并应用分组配置');
    });
}
// 应用分组到预设界面
function applyGroupingToPreset(groups) {
    try {
        // 保存分组配置到本地存储
        const currentPresetName = TavernHelper.getLoadedPresetName();
        const validGroups = groups.filter(g => g.promptIds.length > 0);
        savePresetGrouping(currentPresetName, validGroups);
        // 应用DOM分组效果
        applyGroupingToDOM(validGroups);
        toastr.success('分组设置已应用到预设界面');
    }
    catch (error) {
        console.error('应用分组失败:', error);
        toastr.error('应用分组失败，请检查控制台');
    }
}
// 应用分组到DOM
function applyGroupingToDOM(groups) {
    console.log('开始应用分组到DOM，分组数量:', groups.length);
    // 移除现有的分组容器
    $('.prompt-group-container').remove();
    // 确保所有条目都从分组容器中移出
    $('.prompt-group-container .completion_prompt_manager_prompt').each(function () {
        $(this).insertAfter($('.completion_prompt_manager_prompt').last());
    });
    groups.forEach(group => {
        if (group.promptIds.length === 0)
            return;
        console.log('处理分组:', group.name, '条目数量:', group.promptIds.length);
        // 找到分组中的第一个条目
        const firstPromptElement = $(`.completion_prompt_manager_prompt[data-pm-identifier="${group.promptIds[0]}"]`);
        if (firstPromptElement.length === 0) {
            console.log('未找到分组第一个条目:', group.promptIds[0]);
            return;
        }
        console.log('找到第一个条目，开始创建分组容器');
        // 统计分组内启用的条目数量
        const enabledCount = group.promptIds.filter(promptId => {
            const promptElement = $(`.completion_prompt_manager_prompt[data-pm-identifier="${promptId}"]`);
            return promptElement.find('.prompt-manager-toggle-action').hasClass('fa-toggle-on');
        }).length;
        // 创建分组容器
        const groupContainer = $(`
      <div class="prompt-group-container" style="border: 1px solid rgba(128, 128, 128, 0.3); margin: 5px 0; background-color: rgba(0, 0, 0, 0.05);">
        <div class="prompt-group-header" style="padding: 6px 10px; background-color: rgba(0, 0, 0, 0.08); cursor: pointer; display: flex; align-items: center;">
          <span class="group-toggle-icon" style="margin-right: 6px; font-size: 12px; color: inherit;">${group.collapsed ? '▶' : '▼'}</span>
          <span style="font-weight: bold; color: inherit;">${$('<div/>').text(group.name).html()}</span>
          <span style="margin-left: 8px; font-size: 12px; color: #666;">(${enabledCount}/${group.promptIds.length})</span>
        </div>
        <div class="prompt-group-content" style="padding: 3px; ${group.collapsed ? 'display: none;' : ''}"></div>
      </div>
    `);
        // 将分组插入到第一个条目之前
        firstPromptElement.before(groupContainer);
        console.log('分组容器已插入到DOM');
        // 将分组中的所有条目移动到分组容器中
        group.promptIds.forEach(promptId => {
            const promptElement = $(`.completion_prompt_manager_prompt[data-pm-identifier="${promptId}"]`);
            if (promptElement.length > 0) {
                groupContainer.find('.prompt-group-content').append(promptElement);
                console.log('移动条目到分组容器:', promptId);
            }
            else {
                console.log('未找到条目:', promptId);
            }
        });
        console.log('分组容器创建完成，条目数量:', groupContainer.find('.completion_prompt_manager_prompt').length);
        // 绑定展开/折叠事件
        groupContainer.find('.prompt-group-header').on('click', function () {
            const content = $(this).siblings('.prompt-group-content');
            const icon = $(this).find('.group-toggle-icon');
            if (content.is(':visible')) {
                content.hide();
                icon.text('▶');
                group.collapsed = true;
            }
            else {
                content.show();
                icon.text('▼');
                group.collapsed = false;
            }
        });
    });
}
// 加载时恢复分组
function restoreGroupingFromConfig() {
    try {
        const currentPresetName = TavernHelper.getLoadedPresetName();
        const groups = getPresetGrouping(currentPresetName);
        if (groups.length > 0) {
            console.log(`恢复预设 "${currentPresetName}" 的分组配置，共 ${groups.length} 个分组`);
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
function restoreGroupingDelayed(delay = 500) {
    setTimeout(() => {
        restoreGroupingFromConfig();
    }, delay);
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
            setTimeout(() => tryRestore(attempt + 1), 500);
        }
        else {
            console.log('⚠️ 分组恢复失败，已达到最大尝试次数');
        }
    };
    tryRestore(1);
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
            collapsed: typeof group.collapsed === 'boolean' ? group.collapsed : true,
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


/***/ }),

/***/ 65:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   P: () => (/* binding */ importRegexLogic),
/* harmony export */   showRegexBindingPopup: () => (/* binding */ showRegexBindingPopup)
/* harmony export */ });
/* unused harmony export sortRegexes */
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(780);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(320);


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
                await (0,___WEBPACK_IMPORTED_MODULE_1__/* .setStoredConfigs */ .B)(configs);
                toastr.success(`配置 "${configs[configId].name}" 的正则绑定已清除。`);
            }
            else {
                toastr.info(`配置没有正则绑定。`);
            }
            $(`#${popupId}`).remove();
            (0,___WEBPACK_IMPORTED_MODULE_1__/* .renderConfigsList */ .s)();
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
            await (0,___WEBPACK_IMPORTED_MODULE_1__/* .setStoredConfigs */ .B)(configs);
            toastr.success(`配置 "${configs[configId].name}" 的正则绑定已保存。`);
            $(`#${popupId}`).remove();
            (0,___WEBPACK_IMPORTED_MODULE_1__/* .renderConfigsList */ .s)();
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
                    await (0,___WEBPACK_IMPORTED_MODULE_1__/* .setStoredConfigs */ .B)(configs);
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

/***/ 291:
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
}
// 移除自动初始化，改为在加载时执行函数中调用


/***/ }),

/***/ 320:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   B: () => (/* binding */ setStoredConfigs),
/* harmony export */   getStoredConfigs: () => (/* binding */ getStoredConfigs),
/* harmony export */   s: () => (/* binding */ renderConfigsList)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(291);

async function getStoredConfigs() {
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
    return configs;
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
    // 使用动态导入避免循环引用
    Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 516)).then(({ bindConfigListEvents }) => {
        bindConfigListEvents();
    });
}


/***/ }),

/***/ 510:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  exportConfig: () => (/* binding */ exportConfig),
  k: () => (/* binding */ handleFileImport)
});

;// external "https://testingcf.jsdelivr.net/npm/downloadjs/+esm"

// EXTERNAL MODULE: ./src/喵喵预设配置管理/初始化和配置.ts
var _ = __webpack_require__(291);
// EXTERNAL MODULE: ./src/喵喵预设配置管理/条目分组功能.ts
var src_ = __webpack_require__(11);
// EXTERNAL MODULE: ./src/喵喵预设配置管理/正则绑定功能.ts
var src_0 = __webpack_require__(65);
// EXTERNAL MODULE: ./src/喵喵预设配置管理/配置存储和读取.ts
var src_1 = __webpack_require__(320);
;// ./src/喵喵预设配置管理/导入导出功能.ts





async function exportConfig(configId) {
    try {
        const configs = await (0,src_1.getStoredConfigs)();
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
                const { showRegexExportSelectionPopup } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 780));
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
            const groupingConfig = (0,src_/* exportPresetGrouping */.pM)(groupingPresetName);
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
        default_0(jsonString, `${userFileName}.json`, 'text/plain');
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
                    const { startBatchImportFlow } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 723));
                    await startBatchImportFlow(configsToImport);
                }
                else {
                    toastr.warning('世界书文件中未找到有效的喵喵配置数据。');
                }
                return;
            }
            if (parsedContent.remark) {
                const { showRemarkPopup } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 780));
                await showRemarkPopup(parsedContent.remark);
            }
            if (parsedContent.type === 'MiaoMiaoPresetMegaBundle') {
                const { handleMegaBundleImport } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 723));
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
                await (0,src_0/* importRegexLogic */.P)(regexToImport);
            }
            // 处理分组配置导入
            if (groupingToImport && Array.isArray(groupingToImport) && groupingToImport.length > 0) {
                if (configToImport.presetName) {
                    try {
                        console.log('导入分组配置:', groupingToImport);
                        (0,src_/* importPresetGrouping */.q$)(configToImport.presetName, groupingToImport);
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
            const configs = await (0,src_1.getStoredConfigs)();
            configToImport.name = configName;
            configToImport.id = (0,_/* generateUniqueId */.Ij)(); // Always generate new ID for single import
            configs[configToImport.id] = configToImport;
            await (0,src_1/* setStoredConfigs */.B)(configs);
            toastr.success(`配置 "${configName}" 已成功导入。`);
            await (0,src_1/* renderConfigsList */.s)();
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

/***/ 516:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindConfigListEvents: () => (/* binding */ bindConfigListEvents)
/* harmony export */ });
// 配置列表的按钮事件绑定
function bindConfigListEvents() {
    const listElement = $('#preset-manager-list');
    listElement.off('click', 'button').on('click', 'button', async function (e) {
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
        // 动态导入避免循环引用
        switch (action) {
            case 'rename-config': {
                const { renameConfig } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 884));
                await renameConfig(configId);
                break;
            }
            case 'update-config': {
                const { updateConfig } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 884));
                await updateConfig(configId);
                break;
            }
            case 'load-config': {
                const { loadConfig } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 884));
                await loadConfig(configId);
                break;
            }
            case 'export-config': {
                const { exportConfig } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 510));
                await exportConfig(configId);
                break;
            }
            case 'delete-config': {
                const { deleteConfig } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 884));
                await deleteConfig(configId);
                break;
            }
            case 'bind-regex': {
                const { showRegexBindingPopup } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 65));
                await showRegexBindingPopup(configId);
                break;
            }
            case 'view-config': {
                const { showViewConfigPopup } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 780));
                await showViewConfigPopup(configId);
                break;
            }
        }
        button.closest('.pm-submenu').hide();
    });
}


/***/ }),

/***/ 574:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   R: () => (/* binding */ createUI),
/* harmony export */   j: () => (/* binding */ toggleUI)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(291);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(510);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(723);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(11);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(780);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(320);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(884);







function createUI() {
    if ($(`#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl}`).length > 0)
        return;
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
                    <button id="preset-manager-grouping-btn" style="padding:6px 12px; background-color:#9c27b0; border:none; border-radius:6px; color:#fff; cursor:pointer; font-weight:bold;">条目分组</button>
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
        (0,___WEBPACK_IMPORTED_MODULE_6__/* .saveCurrentConfig */ .Z)();
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
function toggleUI() {
    const ui = $(`#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl}`);
    if (ui.is(':visible')) {
        ui.fadeOut();
    }
    else {
        (0,___WEBPACK_IMPORTED_MODULE_5__/* .renderConfigsList */ .s)();
        const randomTip = ___WEBPACK_IMPORTED_MODULE_0__/* .TIPS */ .df[Math.floor(Math.random() * ___WEBPACK_IMPORTED_MODULE_0__/* .TIPS */ .df.length)];
        $('#preset-manager-tips-section').text('小贴士：' + randomTip);
        ui.fadeIn();
    }
}


/***/ }),

/***/ 723:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   c: () => (/* binding */ showBatchExportPopup),
/* harmony export */   handleMegaBundleImport: () => (/* binding */ handleMegaBundleImport),
/* harmony export */   startBatchImportFlow: () => (/* binding */ startBatchImportFlow),
/* harmony export */   x: () => (/* binding */ showBatchDeletePopup)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(291);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(65);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(780);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(320);




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
    await (0,___WEBPACK_IMPORTED_MODULE_3__/* .setStoredConfigs */ .B)(storedConfigs);
    toastr.success(`成功导入 ${importList.length} 个配置。`);
    await (0,___WEBPACK_IMPORTED_MODULE_3__/* .renderConfigsList */ .s)();
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
        await (0,___WEBPACK_IMPORTED_MODULE_3__/* .setStoredConfigs */ .B)(storedConfigs);
        toastr.success(`已成功删除 ${configIds.length} 个配置。`);
        await (0,___WEBPACK_IMPORTED_MODULE_3__/* .renderConfigsList */ .s)();
    }
    catch (error) {
        console.error('批量删除失败:', error);
        toastr.error('批量删除失败，请检查控制台。');
    }
}


/***/ }),

/***/ 780:
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
            <ul>
                <li><b>保存/更新配置:</b> 保存或更新当前预设中所有"条目"的启用/禁用状态。更新时可选择是否同步正则状态。</li>
                <li><b>加载配置:</b> 一键切换到指定的预设并将所有"条目"恢复到已保存的状态。</li>
                <li><b>查看配置:</b> 在"更多"菜单中点击"查看"，可详细查看配置的基本信息、条目状态统计、启用/禁用的具体条目列表和绑定的正则信息。</li>
                <li><b>条目分组:</b> 可以将预设条目创建分组，分组后的条目会在预设界面中折叠显示，让界面更加整洁。支持创建、移除和清除分组，分组设置会自动保存。</li>
                <li><b>导入/导出:</b> 以 .json 文件的形式分享单个配置。导出时可以为配置包添加备注，方便分享和识别。整合包可以附带预设本身、绑定的正则和分组配置。</li>
                <li><b>兼容世界书导入:</b> 支持直接导入通过酒馆世界书功能导出的、含有本插件数据的备份文件。</li>
                <li><b>批量导入/导出:</b> 一次性分享多个配置、关联的预设和正则脚本，方便备份和迁移。</li>
                <li><b>批量删除:</b> 在主界面勾选多个配置进行一次性删除，方便清理。</li>
                <li><b>角色绑定:</b> 将配置与特定角色关联，切换到该角色时会自动提示加载。</li>
                <li><b>正则绑定:</b> 将配置与一组全局正则的开关状态关联，加载配置时会自动应用。</li>
                <li><b>重命名与分组:</b> 您可以重命名任何配置，同名预设的配置会自动折叠在一个分组下，使界面更清晰。</li>
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
            let lines = text.split('\n');
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
    const { getStoredConfigs } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 320));
    const configs = await getStoredConfigs();
    const configData = configs[configId];
    if (!configData) {
        toastr.error('配置不存在');
        return;
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
         <div style="max-height: 100px; overflow-y: auto; border: 1px solid #e0c9a6; border-radius: 4px; padding: 8px;">
           ${configData.regexStates
            .map((regex) => `<div style="padding: 4px 8px; margin: 2px; background-color: ${regex.enabled ? '#e3f2fd' : '#fafafa'}; border-radius: 4px; font-size: 12px;">
                ${$('<div/>').text(regex.scriptName).html()} ${regex.enabled ? '(启用)' : '(禁用)'}
              </div>`)
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
            <div style="display: flex; gap: 10px; margin-bottom: 10px;">
              <div style="background-color: #e8f5e8; padding: 8px; border-radius: 6px; flex: 1; text-align: center;">
                <div style="font-weight: bold; color: #2e7d32;">启用</div>
                <div style="font-size: 18px; font-weight: bold;">${enabledStates}</div>
              </div>
              <div style="background-color: #ffebee; padding: 8px; border-radius: 6px; flex: 1; text-align: center;">
                <div style="font-weight: bold; color: #c62828;">禁用</div>
                <div style="font-size: 18px; font-weight: bold;">${disabledStates}</div>
              </div>
              <div style="background-color: #f0f4f8; padding: 8px; border-radius: 6px; flex: 1; text-align: center;">
                <div style="font-weight: bold; color: #546e7a;">总计</div>
                <div style="font-size: 18px; font-weight: bold;">${totalStates}</div>
              </div>
            </div>
          </div>

          ${enabledStates > 0
        ? `
          <div style="margin-bottom: 15px;">
            <h5 style="color: #6a4226; margin-bottom: 8px;">启用的条目 (${enabledStates}个)</h5>
            <div style="max-height: 150px; overflow-y: auto; border: 1px solid #e0c9a6; border-radius: 4px; padding: 8px;">
              ${enabledStatesHtml}
            </div>
          </div>
          `
        : ''}

          ${disabledStates > 0
        ? `
          <div style="margin-bottom: 15px;">
            <h5 style="color: #6a4226; margin-bottom: 8px;">禁用的条目 (${disabledStates}个)</h5>
            <div style="max-height: 150px; overflow-y: auto; border: 1px solid #e0c9a6; border-radius: 4px; padding: 8px;">
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
        const { loadConfig } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 884));
        await loadConfig(configId);
    });
    // 移动端样式
    const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 5vh; max-height: 90vh !important; } }</style>`;
    $(`#${popupId}`).append(mobileStyles);
}


/***/ }),

/***/ 884:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ saveCurrentConfig),
/* harmony export */   deleteConfig: () => (/* binding */ deleteConfig),
/* harmony export */   loadConfig: () => (/* binding */ loadConfig),
/* harmony export */   renameConfig: () => (/* binding */ renameConfig),
/* harmony export */   updateConfig: () => (/* binding */ updateConfig)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(291);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(574);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(780);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(320);




async function renameConfig(configId) {
    const configs = await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)();
    const configToRename = configs[configId];
    if (!configToRename) {
        toastr.error('找不到要重命名的配置。');
        return;
    }
    const oldName = configToRename.name;
    const newName = await triggerSlash(`/input default="${oldName}" "请输入新的配置名称"`);
    if (newName && newName.trim() !== '') {
        configs[configId].name = newName.trim();
        await (0,___WEBPACK_IMPORTED_MODULE_3__/* .setStoredConfigs */ .B)(configs);
        toastr.success(`配置已从 "${oldName}" 重命名为 "${newName.trim()}"。`);
        await (0,___WEBPACK_IMPORTED_MODULE_3__/* .renderConfigsList */ .s)();
    }
    else {
        toastr.info('重命名操作已取消。');
    }
}
async function updateConfig(configId) {
    try {
        const configs = await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)();
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
            const userChoices = await (0,___WEBPACK_IMPORTED_MODULE_2__/* .showNewEntriesPopup */ .eS)(newEntries, promptIdToNameMap);
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
        await (0,___WEBPACK_IMPORTED_MODULE_3__/* .setStoredConfigs */ .B)(configs);
        toastr.success(`配置 "${configToSave.name}" 已更新。`);
        await (0,___WEBPACK_IMPORTED_MODULE_3__/* .renderConfigsList */ .s)();
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
    const configName = nameInput.val()?.toString().trim();
    if (!configName) {
        toastr.error('请输入配置名称。');
        return;
    }
    try {
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
        const configs = await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)();
        configs[configToSave.id] = configToSave;
        await (0,___WEBPACK_IMPORTED_MODULE_3__/* .setStoredConfigs */ .B)(configs);
        toastr.success(`配置 "${configName}" 已保存。`);
        nameInput.val('');
        $('#preset-manager-bind-char').prop('checked', false);
        await (0,___WEBPACK_IMPORTED_MODULE_3__/* .renderConfigsList */ .s)();
    }
    catch (error) {
        console.error('保存预设配置失败:', error);
        toastr.error('保存预设配置失败，请检查控制台获取更多信息。');
    }
}
async function loadConfig(configId, shouldToggleUI = true) {
    try {
        const configs = await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)();
        const configToLoad = configs[configId];
        if (!configToLoad) {
            toastr.error(`配置不存在。`);
            return;
        }
        if (configToLoad.presetName) {
            if (TavernHelper.getPresetNames().includes(configToLoad.presetName)) {
                if (TavernHelper.loadPreset(configToLoad.presetName)) {
                    toastr.info(`已切换到预设 "${configToLoad.presetName}"。`);
                    await new Promise(resolve => setTimeout(resolve, 150));
                }
                else {
                    toastr.error(`加载预设 "${configToLoad.presetName}" 失败。`);
                    return;
                }
            }
            else {
                toastr.warning(`配置关联的预设 "${configToLoad.presetName}" 不存在。将仅对当前预设应用条目状态。`);
            }
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
        if (shouldToggleUI) {
            (0,___WEBPACK_IMPORTED_MODULE_1__/* .toggleUI */ .j)();
        }
    }
    catch (error) {
        console.error('加载预设配置失败:', error);
        toastr.error('加载预设配置失败，请检查控制台获取更多信息。');
    }
}
async function deleteConfig(configId) {
    try {
        const configs = await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)();
        const configToDelete = configs[configId];
        if (configToDelete) {
            delete configs[configId];
            await (0,___WEBPACK_IMPORTED_MODULE_3__/* .setStoredConfigs */ .B)(configs);
            toastr.success(`已删除配置 "${configToDelete.name}"。`);
            await (0,___WEBPACK_IMPORTED_MODULE_3__/* .renderConfigsList */ .s)();
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
var _ = __webpack_require__(291);
// EXTERNAL MODULE: ./src/喵喵预设配置管理/条目分组功能.ts
var src_ = __webpack_require__(11);
// EXTERNAL MODULE: ./src/喵喵预设配置管理/界面创建和管理.ts
var src_0 = __webpack_require__(574);
// EXTERNAL MODULE: ./src/喵喵预设配置管理/配置存储和读取.ts
var src_1 = __webpack_require__(320);
// EXTERNAL MODULE: ./src/喵喵预设配置管理/配置操作功能.ts
var src_2 = __webpack_require__(884);
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
            const { showConfigSelectionPopup } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 780));
            configIdToLoad = await showConfigSelectionPopup(boundConfigs, charData.name);
        }
        if (configIdToLoad)
            await (0,src_2.loadConfig)(configIdToLoad, false);
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
    // 简化重复检查 - 只检查UI是否已存在，如果存在就跳过初始化
    const win = window;
    if (win[SCRIPT_ID]) {
        console.log('⚠️ 喵喵预设配置管理已存在，跳过重复初始化');
        return;
    }
    // 设置全局标记
    win[SCRIPT_ID] = true;
    win.miaoMiaoPresetManager = true;
    console.log('🔥 jQuery ready 事件触发...');
    checkReady();
}
async function initScript() {
    try {
        console.log('🚀 喵喵预设配置管理开始初始化...');
        // 初始化配置管理器
        await (0,_/* initializePresetManager */.xd)();
        console.log('✅ 配置管理器初始化完成');
        // 创建UI界面
        (0,src_0/* createUI */.R)();
        console.log('✅ UI界面创建完成');
        // 注册按钮事件
        const buttonEventId = getButtonEvent(_/* TOGGLE_BUTTON_NAME */.EF);
        eventOn(buttonEventId, src_0/* toggleUI */.j);
        console.log('✅ 按钮事件已注册:', buttonEventId);
        // 注册角色切换事件
        eventOn(tavern_events.CHAT_CHANGED, onChatChanged);
        // 恢复分组配置
        eventOn(tavern_events.SETTINGS_LOADED, src_/* restoreGroupingFromConfig */.Ec);
        // 监听预设变化，如果存在该事件的话
        const tavernEventsExt = tavern_events;
        if (tavernEventsExt.PRESET_CHANGED) {
            eventOn(tavernEventsExt.PRESET_CHANGED, src_/* restoreGroupingFromConfig */.Ec);
        }
        // 监听预设界面变化，延迟恢复分组
        if (tavernEventsExt.PROMPT_MANAGER_UPDATED) {
            eventOn(tavernEventsExt.PROMPT_MANAGER_UPDATED, () => (0,src_/* restoreGroupingDelayed */.s8)(300));
        }
        // 监听DOM变化，当预设条目发生变化时恢复分组
        const observer = new MutationObserver(mutations => {
            let shouldRestore = false;
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    const target = mutation.target;
                    // 检查是否是预设管理器的条目变化
                    if (target.classList?.contains('completion_prompt_manager') ||
                        target.querySelector?.('.completion_prompt_manager_prompt')) {
                        shouldRestore = true;
                    }
                }
            });
            if (shouldRestore) {
                console.log('检测到预设条目变化，准备恢复分组');
                (0,src_/* restoreGroupingDelayed */.s8)(500);
            }
        });
        // 开始观察预设管理器区域的变化
        const presetManagerContainer = $('.completion_prompt_manager').get(0);
        if (presetManagerContainer) {
            observer.observe(presetManagerContainer, {
                childList: true,
                subtree: true,
            });
            console.log('✅ 预设管理器DOM观察器已启动');
        }
        // 初始化完成后立即尝试恢复分组
        setTimeout(() => {
            console.log('🔄 脚本加载完成，开始强制恢复分组配置...');
            (0,src_/* forceRestoreGrouping */.nO)();
        }, 1500);
        console.log('✅ 喵喵预设配置管理已加载成功!');
    }
    catch (error) {
        console.error('初始化喵喵预设配置管理失败:', error);
        toastr.error('喵喵预设配置管理加载失败，请检查控制台');
    }
}
// 在加载脚本时执行初始化
console.log('🔥 喵喵预设配置管理模块开始加载...');
$(() => init());
// 在卸载脚本时执行清理
$(window).on('pagehide', async () => {
    // 清理全局标记
    const win = window;
    delete win[SCRIPT_ID];
    delete win.miaoMiaoPresetManager;
    // 清理UI元素
    $('#preset-manager-ui').remove();
    $('#preset-manager-import-file').remove();
    // 清理分组效果
    try {
        const { clearAllGrouping } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 11));
        clearAllGrouping();
    }
    catch (error) {
        // 忽略清理错误
    }
    console.log('✅ 喵喵预设配置管理已卸载');
});

// EXTERNAL MODULE: ./src/喵喵预设配置管理/导入导出功能.ts + 1 modules
var src_3 = __webpack_require__(510);
;// ./src/喵喵预设配置管理/index.ts













